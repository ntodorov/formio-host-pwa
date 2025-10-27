# Formio PWA

A Progressive Web App (PWA) built with React and TypeScript that hosts Form.io forms with comprehensive offline capabilities, Auth0 authentication, and role-based access control.

## Features

### Core Functionality

- **Progressive Web App (PWA)**: Installable on mobile and desktop with full offline support
- **Auth0 Authentication**: Secure authentication with AER's UAT Auth0 instance
- **Role-Based Access**: Different experiences for internal and external users
- **Form.io Premium Integration**: Advanced form features with offline plugin support
- **Offline-First Architecture**: Queue submissions when offline, auto-sync when online

### User Types

#### External Users

- Submit new form data through interactive Form.io forms
- Multiple submissions supported (form resets after each submission)
- Offline submission queuing with automatic sync
- Real-time online/offline status indicator

#### Internal Users

- View all form submissions in a card-based grid layout
- Detailed submission viewer with modal display
- Cached submissions for offline viewing
- Submission count and statistics

### Offline Capabilities

- **Form Caching**: Forms are pre-cached for offline access
- **Submission Queuing**: Failed submissions are queued automatically
- **Auto-Sync**: Queue syncs automatically when connection is restored
- **Manual Sync**: Manual sync option for queued submissions
- **Error Handling**: Retry or skip failed submissions
- **Queue Management**: View and manage pending submissions

## Setup

1. **Install Dependencies**:

   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment Variables**:

   Create a `.env` file in the root directory (optional for premium features):

   ```env
   VITE_FORMIO_PREMIUM_LICENSE_KEY=your_license_key_here
   ```

3. **Run Development Server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

4. **Build for Production**:

   ```bash
   npm run build
   ```

   Builds the app for production to the `dist` folder.

## Architecture

### Authentication Flow

1. App redirects to Auth0 login (uat-login.aer.ca)
2. After successful authentication, tokens are stored in localStorage
3. User type is determined from Auth0 claims (`https://schema.aer.ca/userType`)
4. For external users, BA (Business Associate) membership is extracted and cached
5. Token expiration is monitored with automatic timeout handling

### Component Structure

- **App.tsx**: Main app wrapper with authentication guards
- **useApp.tsx**: Custom hook managing Auth0 integration and user state
- **FormPage.tsx**: Main page component with offline plugin initialization
- **Header.tsx**: Navigation header with logout and status indicators
- **SubmissionList.tsx**: Grid view of all submissions (internal users)
- **SubmissionCard.tsx**: Individual submission card component
- **SubmissionDetailModal.tsx**: Modal for viewing submission details
- **OfflineSubmissionQueue.tsx**: Queue management UI component

### Offline Plugin Integration

- Initializes with project URL and custom offline storage key
- Listens to events: `offline.queue`, `offline.dequeue`, `offline.formSubmission`, `offline.formError`, `offline.queueEmpty`
- Handles automatic and manual synchronization
- Provides error recovery with retry/skip options

## Docker

### Build Docker Image

Build the Docker image:

```bash
docker build -t formio-pwa .
```

### Run Docker Container

Run the container, mapping port 3000 on your host to port 80 in the container:

```bash
docker run -p 3000:80 formio-pwa
```

Then access your app at [http://localhost:3000](http://localhost:3000)

### Run with Environment Variables

If you need to pass environment variables (build-time only for Vite):

```bash
docker build --build-arg VITE_FORMIO_PREMIUM_LICENSE_KEY=your_key -t formio-pwa .
docker run -p 3000:80 formio-pwa
```

Note: Vite environment variables are compiled into the build at build-time, not runtime.

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  formio-pwa:
    build: .
    ports:
      - '3000:80'
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

## Configuration

### Form.io Settings

The app connects to Form.io API with the following default configuration:

```typescript
baseUrl: 'https://formio-api-dev.azurewebsites.net';
projectUrl: 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';
defaultForm: 'publicaerform1';
```

### Auth0 Configuration

Default Auth0 settings (in `src/main.tsx`):

```typescript
domain: 'uat-login.aer.ca';
clientId: 'atDvYwnvwlsJAapr32avLarQoyZde6nx';
audience: 'https://graph.onestopuat.aer.ca';
```

### Local Storage Keys

The app uses the following localStorage keys (defined in `src/config.ts`):

- `OneStop::Token`: ID token from Auth0
- `OneStop::BaId`: Business Associate ID (external users)
- `OneStop::RoleId`: User role ID

## PWA Installation

- **On mobile**: Use the browser's "Add to Home Screen" option
- **On desktop**: Look for the install icon in the address bar or use the browser's install prompt
- The app will work offline once installed and initial resources are cached

## Offline Behavior

### What Works Offline

- Loading previously cached forms
- Viewing cached submissions (internal users)
- Submitting new forms (queued for later sync)
- Full UI navigation and functionality

### What Requires Connection

- Initial authentication
- Token refresh
- Syncing queued submissions
- Loading new forms not previously cached
- Fetching latest submissions

### Submission Queue Management

- Submissions are automatically queued when offline
- Auto-sync occurs when connection is restored
- Manual sync button available in the queue panel
- Failed submissions can be retried or skipped
- Queue length displayed in header badge
- Clear queue option available (with confirmation)

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── FormPage.tsx              # Main form/submission page
│   ├── Header.tsx                # App header with status
│   ├── SubmissionList.tsx        # Submissions grid (internal)
│   ├── SubmissionCard.tsx        # Individual submission card
│   ├── SubmissionDetailModal.tsx # Submission details popup
│   ├── OfflineSubmissionQueue.tsx # Queue management UI
│   └── useApp.tsx                # Auth & user management hook
├── types/               # TypeScript type definitions
│   ├── formio-offline-plugin.d.ts
│   ├── formio-premium.d.ts
│   └── submission.d.ts
├── utilities/           # Helper functions
│   ├── constants.ts              # Enums and constants
│   ├── utils.ts                  # User type utilities
│   └── getFormioUserInfo.ts      # Form.io user helpers
├── App.tsx              # Root component with auth guards
├── main.tsx             # Entry point with Auth0Provider
├── config.ts            # App configuration
└── styles/              # CSS files
```

### Key Dependencies

- **React 19**: Latest React with concurrent features
- **@auth0/auth0-react**: Auth0 authentication
- **@formio/react**: Form.io React components
- **@formio/premium**: Premium Form.io features
- **@formio/offline-plugin**: Offline submission queuing
- **Vite**: Build tool and dev server
- **vite-plugin-pwa**: PWA and service worker generation
- **TypeScript**: Type safety

### Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production (outputs to dist/)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Customization

### Changing Form.io API

Edit `src/components/FormPage.tsx`:

```typescript
const baseUrl = 'https://your-formio-server.com';
const projectUrl = 'https://your-formio-server.com/your-project';
```

### Changing Auth0 Configuration

Edit `src/main.tsx`:

```typescript
const domain = 'your-auth0-domain.auth0.com';
const clientId = 'your-client-id';
const audience = 'your-api-audience';
```

### Customizing PWA Manifest

Edit `vite.config.ts` to modify PWA settings:

```typescript
manifest: {
  short_name: 'Your App',
  name: 'Your App Name',
  theme_color: '#your-color',
  // ... other settings
}
```

### Styling

- `src/App.css`: Main application styles
- `src/FormioAERStyles.css`: AER-specific Form.io customizations
- `src/index.css`: Global styles

## Troubleshooting

### Common Issues

**Authentication Loop**

- Clear localStorage and cookies
- Check Auth0 configuration matches your tenant
- Verify callback URLs are configured in Auth0 dashboard

**Forms Not Loading Offline**

- Ensure forms were accessed at least once while online
- Check browser DevTools > Application > Cache Storage
- Verify offline plugin is initialized (check console logs)

**Submissions Not Syncing**

- Check browser network tab for API errors
- Verify Form.io API endpoint is accessible
- Check offline queue panel for error details
- Use retry or skip buttons for failed submissions

**Docker Container Not Starting**

- Verify the build completed successfully
- Check that nginx is serving files from `/usr/share/nginx/html`
- Review docker logs: `docker logs <container-id>`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with PWA support

## Technologies Used

- **React 19** with TypeScript
- **Vite** for build tooling
- **Auth0** for authentication
- **Form.io** (Premium) for dynamic forms
- **Form.io Offline Plugin** for offline capabilities
- **Workbox** for service worker and caching
- **Nginx** for production serving

## Security Considerations

- Tokens are stored in localStorage (consider security implications)
- Auth0 handles secure authentication flow
- Token expiration is monitored and enforced
- HTTPS required for PWA features
- Service worker only active over HTTPS

## License

Private - Internal AER Project
