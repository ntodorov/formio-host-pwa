# Formio PWA

A Progressive Web App (PWA) built with React that hosts a Form.io form with offline capabilities.

## Features

- **Progressive Web App (PWA)**: Installable on mobile and desktop, works offline.
- **Form.io Integration**: Renders interactive forms using Form.io components.
- **Offline Support**: Service worker caches resources for offline functionality.
- **TypeScript**: Built with TypeScript for better development experience.

## Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3. **Build for Production**:

   ```bash
   npm run build
   ```

   Builds the app for production to the `build` folder.

4. **Deploy**:
   Serve the `build` folder using a static site host (e.g., Netlify, Vercel) for PWA features.

## Docker

### Build Docker Image

Build the Docker image:

```bash
docker build -t formio-pwa .
```

### Run Docker Container

Run the container on port 3000:

```bash
docker run -p 3000:80 formio-pwa
```

Then access your app at [http://localhost:3000](http://localhost:3000)

### Run with Environment Variables

If you need to pass environment variables:

```bash
docker run -p 3000:80 \
  -e REACT_APP_API_URL=your_api_url \
  -e REACT_APP_FORM_ID=your_form_id \
  formio-pwa
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

Then run:

```bash
docker-compose up
```

## PWA Installation

- On mobile: Use the browser's "Add to Home Screen" option.
- On desktop: Use the browser's install prompt.

## Offline Capabilities

The app uses a service worker to cache essential resources, allowing it to function offline. Form interactions are cached for basic offline viewing.

## Customization

- Update `public/manifest.json` for PWA metadata.
- Modify `src/App.tsx` to change the form schema or integrate with Form.io APIs.
- Edit `public/sw.js` for advanced caching strategies.

## Technologies Used

- React
- TypeScript
- Form.io React
- Service Worker API
