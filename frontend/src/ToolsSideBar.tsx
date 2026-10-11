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

type ToolsSideBarTheme = 'day' | 'night';
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

type ToolsSideBarProps = {
  mode: ToolsSideBarTheme;
  toolbarItems: string[];
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

export default function ToolsSideBar({ mode = 'day', toolbarItems }: ToolsSideBarProps) {
  const toolsSideBarRef = useRef<HTMLDivElement>(null);
  const theme = (mode === 'day' ? 'light' : 'dark');
  // const toolbarItems = ['Pen', 'Text', 'Shapes', 'Math', 'Erase'];
  // const toolbarItems = ['Pen', 'Text', 'Shapes', 'Math', 'Erase'];
  return (
    <>
    <aside 
        
        className="w-full shrink-0 rounded-2xl border border-black/10 bg-[var(--panel-bg)] p-3 shadow-2xl shadow-black/10 backdrop-blur-sm md:w-[220px]">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] md:mb-3">
              <span>Tools</span>
              <span>12</span>
            </div>

            <div className="flex flex-row flex-wrap gap-2 max-[359px]:gap-1 md:flex-col">
              {toolbarItems.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  className="flex min-w-0 flex-1 items-center justify-between rounded-xl border border-black/10 bg-[var(--tool-bg)] px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-border)] hover:text-[var(--text-primary)] max-[420px]:justify-center max-[420px]:px-1 max-[420px]:text-xs md:flex-initial md:min-w-0 md:justify-between md:px-3 md:text-sm"
                >
                  <span className="max-[420px]:hidden md:inline">{tool}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{tool[0]}</span>
                </button>
              ))}
            </div>
          </aside>
    </>

  );
}