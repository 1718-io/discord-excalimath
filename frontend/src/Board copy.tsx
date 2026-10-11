import { useCallback, useEffect, useRef, useState } from 'react';
import { CaptureUpdateAction, Excalidraw } from '@excalidraw/excalidraw';
import type {
  AppState,
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
} from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import { ExcaliMath } from "@excalimath/core";

type BoardTheme = 'day' | 'night';
export type BoardSyncStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error';
type SceneElements = Parameters<NonNullable<ExcalidrawProps['onChange']>>[0];

type SceneSnapshot = {
  elements: SceneElements;
  appState: Pick<AppState, 'viewBackgroundColor'>;
  files: BinaryFiles;
};

type ServerMessage =
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
  | { type: 'error'; code: string; message: string }
  | { type: 'unexpected' };

type BoardProps = {
  mode: BoardTheme;
  roomId?: string;
  serverUrl?: string;
  onSyncStateChange?: (status: BoardSyncStatus, message?: string) => void;
};

const MAX_MESSAGE_BYTES = 8 * 1024 * 1024;

const serializeScene = (
  elements: SceneElements,
  appState: AppState,
  files: BinaryFiles,
): SceneSnapshot => ({
  elements,
  appState: { viewBackgroundColor: appState.viewBackgroundColor },
  files,
});

const fingerprint = (scene: SceneSnapshot): string => JSON.stringify(scene);

const normalizeRoomId = (roomId: string): string => roomId.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 128);

const getRoomServerUrl = (configuredUrl?: string): string | null => {
  if (configuredUrl || import.meta.env.VITE_ROOM_SERVER_URL) {
    return configuredUrl ?? import.meta.env.VITE_ROOM_SERVER_URL ?? null;
  }

  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'ws://127.0.0.1:8080';
  }

  return null;
};

const isSceneSnapshot = (value: unknown): value is SceneSnapshot => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const scene = value as Record<string, unknown>;
  return (
    Array.isArray(scene.elements) &&
    typeof scene.appState === 'object' &&
    scene.appState !== null &&
    typeof scene.files === 'object' &&
    scene.files !== null
  );
};

const getSceneFiles = (scene: SceneSnapshot): BinaryFileData[] =>
  Object.values(scene.files).filter(
    (file): file is BinaryFileData =>
      typeof file === 'object' && file !== null && 'id' in file && 'dataURL' in file && 'mimeType' in file,
  );

export default function Board({ mode, roomId, serverUrl, onSyncStateChange }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const clientIdRef = useRef<string | null>(null);
  const joinedRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const lastRemoteFingerprintRef = useRef<string | null>(null);
  const lastSentFingerprintRef = useRef<string | null>(null);
  const pendingSceneRef = useRef<SceneSnapshot | null>(null);
  const sendSceneRef = useRef<(scene: SceneSnapshot) => void>(() => undefined);
  const flushTimerRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<BoardSyncStatus>(roomId ? 'connecting' : 'idle');
  const [syncMessage, setSyncMessage] = useState<string>();
  const [remoteRevision, setRemoteRevision] = useState(0);

  const updateSyncStatus = useCallback(
    (status: BoardSyncStatus, message?: string) => {
      setSyncStatus(status);
      setSyncMessage(message);
      onSyncStateChange?.(status, message);
    },
    [onSyncStateChange],
  );

  useEffect(() => {
    const boardRoot = boardRef.current;
    if (!boardRoot) {
      return;
    }

    const nameMobileMenuButton = () => {
      const menuButton = boardRoot.querySelector<HTMLButtonElement>('[data-testid="main-menu-trigger"]');
      if (menuButton && !menuButton.hasAttribute('aria-label')) {
        menuButton.setAttribute('aria-label', 'Open Excalidraw menu');
      }
    };

    nameMobileMenuButton();
    const observer = new MutationObserver(nameMobileMenuButton);
    observer.observe(boardRoot, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!roomId) {
      updateSyncStatus('idle');
      return;
    }

    const normalizedRoomId = normalizeRoomId(roomId);
    if (!normalizedRoomId) {
      updateSyncStatus('error', 'Room ID is empty or invalid.');
      return;
    }

    const endpoint = getRoomServerUrl(serverUrl);
    if (!endpoint) {
      updateSyncStatus('error', 'Set VITE_ROOM_SERVER_URL to enable remote room sync.');
      return;
    }

    let disposed = false;
    let reconnectDelay = 500;
    let hasConnectedOnce = false;

    sendSceneRef.current = (scene) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN || !joinedRef.current) {
        return;
      }

      const sceneFingerprint = fingerprint(scene);
      if (sceneFingerprint === lastSentFingerprintRef.current) {
        return;
      }

      const message = JSON.stringify({ type: 'board:update', scene });
      if (new TextEncoder().encode(message).byteLength > MAX_MESSAGE_BYTES) {
        updateSyncStatus('error', 'This board update is larger than the server message limit.');
        return;
      }

      socket.send(message);
      lastSentFingerprintRef.current = sceneFingerprint;
    };

    const applyScene = (scene: SceneSnapshot) => {
      const api = apiRef.current;
      if (!api) {
        return;
      }

      const safeScene: SceneSnapshot = {
        elements: scene.elements,
        appState: { viewBackgroundColor: scene.appState.viewBackgroundColor },
        files: scene.files,
      };
      lastRemoteFingerprintRef.current = fingerprint(safeScene);
      applyingRemoteRef.current = true;
      const files = getSceneFiles(safeScene);
      if (files.length > 0) {
        api.addFiles(files);
      }
      api.updateScene({
        elements: safeScene.elements,
        appState: safeScene.appState,
        captureUpdate: CaptureUpdateAction.NEVER,
      });
      window.setTimeout(() => {
        applyingRemoteRef.current = false;
      }, 0);
    };

    const connect = () => {
      if (disposed) {
        return;
      }

      updateSyncStatus(hasConnectedOnce ? 'reconnecting' : 'connecting');
      let socket: WebSocket;
      try {
        socket = new WebSocket(endpoint);
      } catch (error) {
        updateSyncStatus('error', error instanceof Error ? error.message : 'Invalid WebSocket URL.');
        return;
      }
      socketRef.current = socket;

      socket.addEventListener('open', () => {
        if (disposed || socket !== socketRef.current) {
          socket.close();
          return;
        }
        reconnectDelay = 500;
        socket.send(JSON.stringify({ type: 'room:join', roomId: normalizedRoomId }));
      });

      socket.addEventListener('message', (event: MessageEvent<string>) => {
        let message: ServerMessage;
        try {
          message = JSON.parse(event.data) as ServerMessage;
        } catch {
          updateSyncStatus('error', 'The room server sent an invalid message.');
          return;
        }

        if (message.type === 'room:joined') {
          joinedRef.current = true;
          clientIdRef.current = message.clientId;
          hasConnectedOnce = true;
          updateSyncStatus('connected');
          if (isSceneSnapshot(message.scene)) {
            applyScene(message.scene);
          } else {
            const api = apiRef.current;
            if (api && api.getSceneElements().length > 0) {
              sendSceneRef.current(serializeScene(api.getSceneElements(), api.getAppState(), api.getFiles()));
            }
          }
          return;
        }

        if (message.type === 'board:update' && isSceneSnapshot(message.scene)) {
          if (message.clientId !== clientIdRef.current) {
            applyScene(message.scene);
            setRemoteRevision(message.revision);
          }
          return;
        }

        if (message.type === 'error') {
          updateSyncStatus('error', message.message);
        }
      });

      socket.addEventListener('close', () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
        joinedRef.current = false;
        clientIdRef.current = null;
        if (!disposed) {
          updateSyncStatus(hasConnectedOnce ? 'reconnecting' : 'error', 'Room server disconnected. Retrying…');
          reconnectTimerRef.current = window.setTimeout(connect, reconnectDelay);
          reconnectDelay = Math.min(reconnectDelay * 2, 8_000);
        }
      });

      socket.addEventListener('error', () => {
        if (!disposed && !hasConnectedOnce) {
          updateSyncStatus('error', 'Could not connect to the room server. Retrying…');
        }
      });
    };

    connect();

    return () => {
      disposed = true;
      joinedRef.current = false;
      clientIdRef.current = null;
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
      }
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      socketRef.current?.close(1000, 'Board unmounted');
      socketRef.current = null;
    };
  }, [roomId, serverUrl, updateSyncStatus]);

  const handleChange = useCallback(
    (elements: SceneElements, appState: AppState, files: BinaryFiles) => {
      if (applyingRemoteRef.current) {
        return;
      }

      const scene = serializeScene(elements, appState, files);
      const sceneFingerprint = fingerprint(scene);
      if (sceneFingerprint === lastRemoteFingerprintRef.current) {
        lastRemoteFingerprintRef.current = null;
        lastSentFingerprintRef.current = sceneFingerprint;
        return;
      }

      pendingSceneRef.current = scene;
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
      }
      flushTimerRef.current = window.setTimeout(() => {
        if (pendingSceneRef.current) {
          sendSceneRef.current(pendingSceneRef.current);
          pendingSceneRef.current = null;
        }
        flushTimerRef.current = null;
      }, 80);
    },
    [],
  );

  return (
    <div
      ref={boardRef}
      className="h-full w-full overflow-hidden"
      data-testid="excalidraw-board"
      data-sync-status={syncStatus}
      data-remote-revision={remoteRevision}
      title={syncMessage}
    >
      <Excalidraw
        theme={mode === 'day' ? 'light' : 'dark'}
        name="ExcaliMath board"
        autoFocus={false}
        excalidrawAPI={(api) => {
          apiRef.current = api;
        }}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
          },
        }}
        // renderTopRightUI
        gridModeEnabled={true}
        isCollaborating={roomId !== undefined}
        
        renderTopRightUI={(isMobile = true) => {
          const api = apiRef.current;
          return (api ? (
            <ExcaliMath
              excalidrawAPI={api}
              enabledPlugins={["equation", "graph", "library"]}
              theme="auto"
              onSave={(data) => console.log("Saved:", data)}


            />
          ) : null) }
        }
      />
    </div>
  );
}