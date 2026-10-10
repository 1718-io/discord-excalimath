import '../src/index.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'discord-dark',
      values: [
        { name: 'discord-dark', value: '#090b10' },
        { name: 'whiteboard', value: '#0b1020' },
      ],
    },
  },
};

export default preview;
