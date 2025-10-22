import React, { useState } from 'react';
import { Form, FormioProvider } from '@formio/react';
import './App.css';

function App() {
  // The correct API path for your Form.io Enterprise project
  const projectUrl = 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';

  const [formUrl, setFormUrl] = useState(`${projectUrl}/publicaerform1`);

  return (
    <FormioProvider
      baseUrl="https://formio-api-dev.azurewebsites.net"
      projectUrl={projectUrl}
    >
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Form.io PWA</h1>
            <p className="app-subtitle">Dynamic Form Renderer</p>
          </div>
        </header>

        <main className="app-main">
          <div className="form-selector">
            <label className="input-label">
              Form Path
              <input
                type="text"
                className="form-input"
                value={formUrl.replace(projectUrl + '/', '')}
                onChange={(e) => setFormUrl(`${projectUrl}/${e.target.value}`)}
                placeholder="e.g., publicaerform1"
              />
            </label>
            <div className="url-display">
              <span className="url-label">API Endpoint:</span>
              <code className="url-code">{formUrl}</code>
            </div>
          </div>

          <div className="form-container">
            <Form
              key={formUrl}
              src={formUrl}
              onSubmit={(submission) =>
                console.log('Form submitted:', submission)
              }
              onError={(error) => console.error('Form error:', error)}
              onFormReady={(form) => console.log('Form ready:', form)}
            />
          </div>
        </main>
      </div>
    </FormioProvider>
  );
}

export default App;
