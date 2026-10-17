import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ActivityEntry from './ActivityEntry';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';

import './index.css';
/* Add this line below to load the math styling definitions globally */
import 'katex/dist/katex.min.css';

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
const isEmbedded = window.self !== window.top;
const requestedRoomId = new URLSearchParams(window.location.search).get('room');
const standaloneRoomId = requestedRoomId?.trim()
  ? requestedRoomId.trim()
  : ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'local-development'
    : undefined;


if (currentPath === '/' && isEmbedded) {
  window.history.replaceState(
    null,
    '',
    `/discord${window.location.search}${window.location.hash}`,
    /**
     * The important change is preserving window.location.search, which contains the query parameters, including frame_id if Discord supplied it. We also preserve the URL hash.
     */
  );
}

// Determine view to render
let content = <App activityStatus="standalone" roomId={standaloneRoomId} roomServerUrl={import.meta.env.VITE_ROOM_SERVER_URL} />;

if (currentPath === '/privacy') {
  content = <PrivacyPolicy />;
} else if (currentPath === '/terms') {
  content = <TermsOfService />;
} else if (currentPath === '/discord' || (currentPath === '/' && isEmbedded)) {
  content = <ActivityEntry />;
}

const isDiscordActivityRoute = currentPath === '/discord' || (currentPath === '/' && isEmbedded);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {content}
  </React.StrictMode>,
);
