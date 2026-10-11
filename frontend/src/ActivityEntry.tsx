import { useEffect, useState } from 'react';
import App from './App';

type ActivityState =
  | { status: 'connecting' }
  | { status: 'ready'; instanceId: string; channelId: string | null; guildId: string | null }
  | { status: 'unavailable'; reason: string };

type SettledActivityState = Exclude<ActivityState, { status: 'connecting' }>;

let discordInitialization: Promise<SettledActivityState> | undefined;

const initializeDiscordActivity = (): Promise<SettledActivityState> => {
  discordInitialization ??= (async () => {
    if (window.self === window.top) {
      return {
        status: 'unavailable',
        reason: 'Open /discord from a Discord Activity to connect. The standalone app is available at /.',
      };
    }

    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    if (!clientId) {
      return {
        status: 'unavailable',
        reason: 'Discord Activity setup is incomplete: configure VITE_DISCORD_CLIENT_ID.',
      };
    }

    try {
      console.log('[Activity] Loading Discord SDK');

      const { DiscordSDK } = await import('@discord/embedded-app-sdk');

      console.log('[Activity] SDK imported');

      const discordSdk = new DiscordSDK(clientId);

      console.log('[Activity] Waiting for SDK ready');

      // const { DiscordSDK } = await import('@discord/embedded-app-sdk');
      // const discordSdk = new DiscordSDK(clientId);
      await discordSdk.ready();

      return {
        status: 'ready',
        instanceId: discordSdk.instanceId,
        channelId: discordSdk.channelId,
        guildId: discordSdk.guildId,
      };
    } catch (error) {
      return {
        status: 'unavailable',
        reason:
          error instanceof Error
            ? `Discord connection failed: ${error.message}`
            : 'Discord connection failed. Open this route from a Discord Activity.',
      };
    }
  })();

  return discordInitialization;
};

export default function ActivityEntry() {
  const [activity, setActivity] = useState<ActivityState>({ status: 'connecting' });

  useEffect(() => {
    let cancelled = false;

    void initializeDiscordActivity().then((result) => {
      if (!cancelled) {
        setActivity(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (activity.status === 'ready') {
    return (
      <App
        activityStatus="ready"
        roomId={activity.instanceId}
        roomServerUrl={import.meta.env.VITE_ROOM_SERVER_URL}
        activityContext={{
          instanceId: activity.instanceId,
          channelId: activity.channelId,
          guildId: activity.guildId,
        }}
      />
    );
  }

  return (
    <App
      activityStatus={activity.status}
      activityMessage={activity.status === 'unavailable' ? activity.reason : undefined}
    />
  );
}
