# Dictionary Application

A modern, responsive dictionary web application built with React Router and TypeScript, featuring dark mode support and integration with the Free Dictionary API.

## Features

- **Word Search**: Search for any English word and get comprehensive definitions
- **Dark Mode**: Toggle between light and dark themes with smooth transitions
- **Font Controls**: Choose between Serif, Sans, and Mono font families
- **Audio Pronunciation**: Play audio pronunciations when available
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time API**: Powered by the [Free Dictionary API](https://dictionaryapi.dev/)

## API Integration

The application integrates with the Free Dictionary API to provide:
- Word definitions with multiple meanings
- Phonetic transcriptions
- Audio pronunciations
- Synonyms and antonyms
- Word origins
- Example sentences

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **API**: Free Dictionary API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## Features in Detail

### Search Functionality
- Real-time word search with the Free Dictionary API
- Error handling for words not found
- Loading states during API calls

### Theme System
- Automatic detection of system color scheme preference
- Manual toggle between light and dark modes
- Smooth transitions between themes
- Persistent theme selection

### Typography
- Three font family options: Serif, Sans, and Mono
- Dynamic font switching for word definitions
- Optimized readability in both light and dark modes

### Audio Support
- Audio pronunciation playback when available
- Graceful fallback for words without audio
- Accessible audio controls

## API Endpoint

The application uses the Free Dictionary API:
```
https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Progressive enhancement for accessibility features

## Contributing

This is a learning project demonstrating modern React development practices with TypeScript and Tailwind CSS.
