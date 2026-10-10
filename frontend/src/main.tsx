import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ActivityEntry from './ActivityEntry';
import './index.css';

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isEmbedded = window.self !== window.top;
const requestedRoomId = new URLSearchParams(window.location.search).get('room');
const standaloneRoomId = requestedRoomId?.trim()
  ? requestedRoomId.trim()
  : ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'local-development'
    : undefined;

if (currentPath === '/' && isEmbedded) {
  window.history.replaceState(null, '', '/discord');
}

const isDiscordActivityRoute = currentPath === '/discord' || (currentPath === '/' && isEmbedded);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isDiscordActivityRoute ? (
      <ActivityEntry />
    ) : (
      <App
        activityStatus="standalone"
        roomId={standaloneRoomId}
        roomServerUrl={import.meta.env.VITE_ROOM_SERVER_URL}
      />
    )}
  </React.StrictMode>,
);
