import React, { useState, useEffect } from 'react';
import { Form, FormioProvider } from '@formio/react';
import { Formio } from '@formio/js';
import './App.css';

function AppWithAuth() {
  const projectUrl = 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';

  const [formUrl, setFormUrl] = useState(`${projectUrl}/publicaerform1`);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('formioToken');
    if (token) {
      Formio.setToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const formio = new Formio(`${projectUrl}/user/login`);
      const response = await formio.saveSubmission({
        data: {
          email: username,
          password: password,
        },
      });

      // Store the token
      if (response.headers && response.headers['x-jwt-token']) {
        const token = response.headers['x-jwt-token'];
        localStorage.setItem('formioToken', token);
        Formio.setToken(token);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('formioToken');
    Formio.setToken('');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Formio PWA - Login</h1>
          <form
            onSubmit={handleLogin}
            style={{ maxWidth: '400px', margin: '20px auto' }}
          >
            {authError && (
              <div style={{ color: 'red', marginBottom: '10px' }}>
                {authError}
              </div>
            )}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            >
              Login
            </button>
          </form>
        </header>
      </div>
    );
  }

  return (
    <FormioProvider
      baseUrl="https://formio-api-dev.azurewebsites.net"
      projectUrl={projectUrl}
    >
      <div className="App">
        <header className="App-header">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h1>Formio PWA</h1>
            <button onClick={handleLogout} style={{ padding: '5px 15px' }}>
              Logout
            </button>
          </div>
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

export default AppWithAuth;
