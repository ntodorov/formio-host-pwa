import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.tsx';

const domain = 'uat-login.aer.ca';
const clientId = 'atDvYwnvwlsJAapr32avLarQoyZde6nx';
const redirectUri = window.location.origin;
//const audience = "https://graph.onestopuat.aer.ca"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
