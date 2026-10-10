import type { WebSocket } from 'ws';
import type { SceneSnapshot, ServerMessage } from './protocol.js';

type RoomPeer = {
  clientId: string;
  socket: WebSocket;
};

type Room = {
  peers: Map<string, RoomPeer>;
  revision: number;
  scene: SceneSnapshot | null;
};

export class RoomRegistry {
  private readonly rooms = new Map<string, Room>();

  join(roomId: string, peer: RoomPeer): { peers: string[]; revision: number; scene: SceneSnapshot | null } {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = { peers: new Map(), revision: 0, scene: null };
      this.rooms.set(roomId, room);
    }

    const existingPeers = [...room.peers.keys()];
    room.peers.set(peer.clientId, peer);
    this.broadcast(room, { type: 'room:peer-joined', clientId: peer.clientId }, peer.clientId);

    return {
      peers: existingPeers,
      revision: room.revision,
      scene: room.scene,
    };
  }

  leave(roomId: string, clientId: string): void {
    const room = this.rooms.get(roomId);
    if (!room || !room.peers.delete(clientId)) {
      return;
    }

    this.broadcast(room, { type: 'room:peer-left', clientId });
    if (room.peers.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  update(roomId: string, clientId: string, scene: SceneSnapshot): number | null {
    const room = this.rooms.get(roomId);
    if (!room || !room.peers.has(clientId)) {
      return null;
    }

    room.scene = scene;
    room.revision += 1;
    this.broadcast(room, {
      type: 'board:update',
      clientId,
      revision: room.revision,
      scene,
    }, clientId);

    return room.revision;
  }

  get roomCount(): number {
    return this.rooms.size;
  }

  private broadcast(room: Room, message: ServerMessage, exceptClientId?: string): void {
    const encoded = JSON.stringify(message);
    for (const peer of room.peers.values()) {
      if (peer.clientId !== exceptClientId && peer.socket.readyState === peer.socket.OPEN) {
        peer.socket.send(encoded);
      }
    }
  }
}