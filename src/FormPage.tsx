import { useEffect, useState } from 'react';
import { Form, FormioProvider } from '@formio/react';
import { Formio } from '@formio/js';
import { useApp } from './useApp';
import getFormioUserInfo from './utilities/getFormioUserInfo';
import { UserType } from './utilities/constants';
import './App.css';
import './FormioAERStyles.css';

const FormPage = () => {
  const { logout, isAuthenticated, getAccessTokenSilently, userType } =
    useApp();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const baseUrl = 'https://formio-api-dev.azurewebsites.net';
  const projectUrl = 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';
  const [formUrl, setFormUrl] = useState(`${projectUrl}/publicaerform1`);

  const handleLogout = (): void => {
    Formio.logout(); //formio logout
    logout(); //auth0 logout
  };

  useEffect(() => {
    const getAndSetToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: 'https://graph.onestopuat.aer.ca',
              scope: 'read:data write:data',
            },
          });
          setAccessToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    getAndSetToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  var header = new Formio.Headers();
  header.set('Authorization', `Bearer ${accessToken}`);

  Formio.setBaseUrl(baseUrl);
  Formio.setProjectUrl(projectUrl);

  var formio = new Formio(projectUrl);
  formio.currentUser({
    external: true,
    header: header,
  });

  //console.log('Auth0 Token:', accessToken);
  //console.log('Formio Token:', formio.getToken());

  return (
    <FormioProvider Formio={Formio} baseUrl={baseUrl} projectUrl={projectUrl}>
      <div className='app-container'>
        <header className='app-header'>
          <div className='header-content'>
            <h1 className='app-title'>AER Form Portal</h1>
            <p className='app-subtitle'>
              Alberta Energy Regulator - Dynamic Form Renderer
            </p>
          </div>
          <div className='app-subtitle '>{getFormioUserInfo()?.userName}</div>
          <div className='header-actions'>
            <button className='btn btn-secondary' onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </header>
        {UserType.External === userType && (
          <main className='app-main'>
            <div className='form-selector'>
              <label className='input-label'>
                Form Path
                <input
                  type='text'
                  className='form-input'
                  value={formUrl.replace(projectUrl + '/', '')}
                  onChange={(e) =>
                    setFormUrl(`${projectUrl}/${e.target.value}`)
                  }
                  placeholder='e.g., publicaerform1'
                />
              </label>
              <div className='url-display'>
                <span className='url-label'>API Endpoint:</span>
                <code className='url-code'>{formUrl}</code>
              </div>
            </div>

            <div className='form-container'>
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
        )}
        {UserType.Internal === userType && (
          <div className='container'>
            <div className='centered-text'>AER internal user is logged in!</div>
          </div>
        )}
      </div>
    </FormioProvider>
  );
};

export default FormPage;
