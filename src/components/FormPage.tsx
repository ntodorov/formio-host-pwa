import { useEffect, useState } from 'react';
import { Form, FormioProvider } from '@formio/react';
import { Formio } from '@formio/js';
import { useApp } from './useApp';
import Header from './Header';
import { UserType } from '../utilities/constants';
import SubmissionList from './SubmissionList';
import '../App.css';
import '../FormioAERStyles.css';

const FormPage = () => {
  const { logout, isAuthenticated, getAccessTokenSilently, userType } =
    useApp();
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
    <>
      <Header handleLogout={handleLogout} />
      <FormioProvider Formio={Formio} baseUrl={baseUrl} projectUrl={projectUrl}>
        <div className='app-container'>
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
          </main>
          {UserType.External === userType && (
            <main className='app-main'>
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
            <main className='app-main'>
              <div className='submission-list-container'>
                <SubmissionList formUrl={formUrl} />
              </div>
            </main>
          )}
        </div>
      </FormioProvider>
    </>
  );
};

export default FormPage;
