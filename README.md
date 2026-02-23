# SmashRoster

Fair rotations for your paddle group.

## Overview

SmashRoster is a progressive web app designed to manage player rotations for paddle sports (badminton, pickleball, etc.). It ensures fair court time distribution among all players in your group and tracks session statistics.

## Features

- **Fair Rotation System**: Automatically manages player rotations to ensure equal court time
- **Live Session Management**: Track active games and manage player queues in real-time
- **Court Visualization**: Visual display of court assignments and player positions
- **Session Statistics**: View detailed stats at the end of each session
- **PWA Support**: Install on your device and use offline
- **URL Sharing**: Share session configurations via URL

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- PWA capabilities with offline support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/spattanaik75/smash-roster.git
cd smash-roster
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Deployment

This project is configured for GitHub Pages deployment.

To deploy:
```bash
npm run deploy
```

## Usage

1. **Setup**: Enter player names and configure court settings
2. **Start Session**: Begin your session and the app will automatically manage rotations
3. **Live Play**: Mark games as complete, and players rotate automatically
4. **End Session**: View statistics and session summary

## License

MIT

## Author

Soumya Pattanaik
