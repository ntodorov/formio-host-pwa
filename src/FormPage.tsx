import { useState } from 'react';
import { Form, FormioProvider } from '@formio/react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import './FormioAERStyles.css';

const FormPage = () => {
  const { logout } = useAuth0();

  const projectUrl = 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';
  const [formUrl, setFormUrl] = useState(`${projectUrl}/publicaerform1`);

  // if (!isAuthenticated) {loginWithRedirect()}

  /*
  useEffect(() => {
    const fetchToken = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect();
        return;
      }

      const token = await getAccessTokenSilently();

      setFormioOptions({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    fetchToken();
  }, [getAccessTokenSilently, isAuthenticated, loginWithRedirect]);
*/
  return (
    <FormioProvider
      baseUrl="https://formio-api-dev.azurewebsites.net"
      projectUrl={projectUrl}
    >
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">AER Form Portal</h1>
            <p className="app-subtitle">
              Alberta Energy Regulator - Dynamic Form Renderer
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => logout()}>
              Log Out
            </button>
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
};

export default FormPage;
