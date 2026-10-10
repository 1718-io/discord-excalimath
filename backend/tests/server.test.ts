import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import WebSocket from 'ws';
import { createRoomServer } from '../src/server.js';
import type { ServerMessage } from '../src/protocol.js';

const connect = async (url: string): Promise<WebSocket> => {
  const socket = new WebSocket(url);
  await once(socket, 'open');
  return socket;
};

const waitForMessage = <T extends ServerMessage['type']>(
  socket: WebSocket,
  type: T,
): Promise<Extract<ServerMessage, { type: T }>> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.off('message', onMessage);
      reject(new Error(`Timed out waiting for ${type}`));
    }, 3_000);

    const onMessage = (data: WebSocket.RawData) => {
      const message = JSON.parse(data.toString()) as ServerMessage;
      if (message.type === type) {
        clearTimeout(timeout);
        socket.off('message', onMessage);
        resolve(message as Extract<ServerMessage, { type: T }>);
      }
    };

    socket.on('message', onMessage);
  });

const send = (socket: WebSocket, message: unknown): void => {
  socket.send(JSON.stringify(message));
};

test('rooms track peers, broadcast scene updates, hydrate snapshots, and release empty rooms', async (context) => {
  const server = await createRoomServer({ host: '127.0.0.1', port: 0, logger: { info() {}, warn() {}, error() {} } });
  context.after(async () => server.close());

  const url = `ws://127.0.0.1:${server.port}`;
  const first = await connect(url);
  context.after(() => first.terminate());

  const firstJoinedPromise = waitForMessage(first, 'room:joined');
  send(first, { type: 'room:join', roomId: 'activity-instance-1' });
  const firstJoined = await firstJoinedPromise;
  assert.equal(firstJoined.peers.length, 0);
  assert.equal(firstJoined.revision, 0);
  assert.equal(firstJoined.scene, null);

  const second = await connect(url);
  context.after(() => second.terminate());
  const peerJoinedPromise = waitForMessage(first, 'room:peer-joined');
  const secondJoinedPromise = waitForMessage(second, 'room:joined');
  send(second, { type: 'room:join', roomId: 'activity-instance-1' });

  const [peerJoined, secondJoined] = await Promise.all([peerJoinedPromise, secondJoinedPromise]);
  assert.equal(secondJoined.peers[0], firstJoined.clientId);
  assert.equal(peerJoined.clientId, secondJoined.clientId);
  assert.equal(server.roomCount, 1);

  const scene = {
    elements: [{ id: 'element-1', type: 'rectangle' }],
    appState: { viewBackgroundColor: '#ffffff' },
    files: {},
  };
  const updatePromise = waitForMessage(second, 'board:update');
  send(first, { type: 'board:update', scene });
  const update = await updatePromise;
  assert.equal(update.clientId, firstJoined.clientId);
  assert.equal(update.revision, 1);
  assert.deepEqual(update.scene, scene);

  const third = await connect(url);
  context.after(() => third.terminate());
  const thirdJoinedPromise = waitForMessage(third, 'room:joined');
  send(third, { type: 'room:join', roomId: 'activity-instance-1' });
  const thirdJoined = await thirdJoinedPromise;
  assert.equal(thirdJoined.revision, 1);
  assert.deepEqual(thirdJoined.scene, scene);
  assert.equal(thirdJoined.peers.length, 2);

  const peerLeftPromise = waitForMessage(second, 'room:peer-left');
  first.close();
  const peerLeft = await peerLeftPromise;
  assert.equal(peerLeft.clientId, firstJoined.clientId);

  second.close();
  third.close();
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(server.roomCount, 0);
});

test('server answers pings and rejects board changes until the client joins a room', async (context) => {
  const server = await createRoomServer({ host: '127.0.0.1', port: 0, logger: { info() {}, warn() {}, error() {} } });
  context.after(async () => server.close());

  const socket = await connect(`ws://127.0.0.1:${server.port}`);
  context.after(() => socket.terminate());

  const pongPromise = waitForMessage(socket, 'pong');
  send(socket, { type: 'ping' });
  assert.equal((await pongPromise).type, 'pong');

  const errorPromise = waitForMessage(socket, 'error');
  send(socket, {
    type: 'board:update',
    scene: { elements: [], appState: {}, files: {} },
  });
  const error = await errorPromise;
  assert.equal(error.code, 'join_required');
});