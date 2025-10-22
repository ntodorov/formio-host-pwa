import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

const domain = "uat-login.aer.ca";
const clientId = "atDvYwnvwlsJAapr32avLarQoyZde6nx";
const redirectUri = window.location.origin;
const audience = "https://graph.onestopuat.aer.ca";

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: redirectUri,
      audience: audience,
    }}
  >
    <App />
  </Auth0Provider>
);
