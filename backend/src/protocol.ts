export type SceneSnapshot = {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type ClientMessage =
  | { type: 'room:join'; roomId: string }
  | { type: 'board:update'; scene: SceneSnapshot }
  | { type: 'ping' };

export type ServerMessage =
  | {
      type: 'room:joined';
      roomId: string;
      clientId: string;
      peers: string[];
      revision: number;
      scene: SceneSnapshot | null;
    }
  | { type: 'room:peer-joined'; clientId: string }
  | { type: 'room:peer-left'; clientId: string }
  | { type: 'board:update'; clientId: string; revision: number; scene: SceneSnapshot }
  | { type: 'pong' }
  | { type: 'error'; code: string; message: string };

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const parseClientMessage = (input: unknown): ClientMessage | null => {
  if (!isRecord(input) || typeof input.type !== 'string') {
    return null;
  }

  if (input.type === 'room:join' && typeof input.roomId === 'string') {
    return { type: 'room:join', roomId: input.roomId };
  }

  if (
    input.type === 'board:update' &&
    isRecord(input.scene) &&
    Array.isArray(input.scene.elements) &&
    isRecord(input.scene.appState) &&
    isRecord(input.scene.files)
  ) {
    return {
      type: 'board:update',
      scene: {
        elements: input.scene.elements,
        appState: input.scene.appState,
        files: input.scene.files,
      },
    };
  }

  if (input.type === 'ping') {
    return { type: 'ping' };
  }

  return null;
};