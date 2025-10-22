import React, { useState, useEffect } from 'react';
import { Form, FormioProvider } from '@formio/react';
import { Formio } from '@formio/js';
import './App.css';

function AppWithApiKey() {
  const projectUrl = 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';

  // If you have an API key, you can set it here
  // Get this from your Form.io project settings
  const API_KEY = ''; // Add your API key here if you have one

  const [formUrl, setFormUrl] = useState(`${projectUrl}/publicaerform1`);

  useEffect(() => {
    // Set API key if available
    if (API_KEY) {
      Formio.setToken(API_KEY);
    }
  }, []);

  return (
    <FormioProvider
      baseUrl="https://formio-api-dev.azurewebsites.net"
      projectUrl={projectUrl}
    >
      <div className="App">
        <header className="App-header">
          <h1>Formio PWA</h1>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Form Path (relative to project):
                <input
                  type="text"
                  value={formUrl.replace(projectUrl + '/', '')}
                  onChange={(e) =>
                    setFormUrl(`${projectUrl}/${e.target.value}`)
                  }
                  placeholder="e.g., publicaerform1"
                  style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
                />
              </label>
            </div>
            <div>
              <strong>Full URL:</strong> {formUrl}
            </div>
          </div>
          <Form
            key={formUrl}
            src={formUrl}
            onSubmit={(submission) =>
              console.log('Form submitted:', submission)
            }
            onError={(error) => console.error('Form error:', error)}
            onFormReady={(form) => console.log('Form ready:', form)}
          />
        </header>
      </div>
    </FormioProvider>
  );
}

export default AppWithApiKey;
