import { useEffect, useState, useRef } from 'react';
import { Form, FormioProvider } from '@formio/react';
import { Formio } from '@formio/js';
import { OfflinePlugin } from '@formio/offline-plugin';
import type { OfflinePluginInstance } from '@formio/offline-plugin';
import { useApp } from './useApp';
import Header from './Header';
import { UserType } from '../utilities/constants';
import SubmissionList from './SubmissionList';
import OfflineSubmissionQueue from './OfflineSubmissionQueue';
import '../App.css';
import '../FormioAERStyles.css';
import premium from '@formio/premium';

Formio.license = import.meta.env.VITE_FORMIO_PREMIUM_LICENSE_KEY || '';

const FormPage = () => {
  Formio.use(premium);
  const { logout, isAuthenticated, getAccessTokenSilently, userType } =
    useApp();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [offlinePlugin, setOfflinePlugin] =
    useState<OfflinePluginInstance | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queueLength, setQueueLength] = useState<number>(0);
  const [offlineError, setOfflineError] = useState<unknown>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);

  const baseUrl = 'https://formio-api-dev.azurewebsites.net';
  const projectUrl = 'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu';
  const [formUrl, setFormUrl] = useState(`${projectUrl}/publicaerform1`);

  const handleLogout = (): void => {
    Formio.logout(); //formio logout
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    }); //auth0 logout
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

  const header = new Formio.Headers();
  header.set('Authorization', `Bearer ${accessToken}`);

  Formio.setBaseUrl(baseUrl);
  Formio.setProjectUrl(projectUrl);

  // Initialize Offline Plugin
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      Formio.use(
        OfflinePlugin('aer-formio-offline', projectUrl, '', {
          notToShowDeletedOfflineSubmissions: true,
        })
      );

      const plugin = Formio.getPlugin('aer-formio-offline');
      setOfflinePlugin(plugin);

      // Update queue length
      if (plugin) {
        setQueueLength(plugin.submissionQueueLength());
      }
    } catch (error) {
      console.error('Error initializing offline plugin:', error);
    }
  }, [projectUrl]);

  // Pre-cache form when online (Phase 4.1)
  useEffect(() => {
    if (navigator.onLine && formUrl) {
      const formio = new Formio(formUrl);
      formio
        .loadForm()
        .then(() => {
          console.log('Form cached for offline use:', formUrl);
        })
        .catch((error: unknown) => {
          console.error('Error caching form:', error);
        });
    }
  }, [formUrl]);

  // Pre-cache submissions for internal users (Phase 4.2)
  useEffect(() => {
    if (navigator.onLine && formUrl && userType === UserType.Internal) {
      const formio = new Formio(formUrl);
      formio
        .loadSubmissions()
        .then(() => {
          console.log('Submissions cached for offline use:', formUrl);
        })
        .catch((error: unknown) => {
          console.error('Error caching submissions:', error);
        });
    }
  }, [formUrl, userType]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Application is online');
      // Attempt to sync queued submissions
      if (offlinePlugin) {
        offlinePlugin.dequeueSubmissions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Application is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlinePlugin]);

  // Listen to offline plugin events
  useEffect(() => {
    const handleQueue = (event: unknown) => {
      console.log('Submission queued:', event);
      if (offlinePlugin) {
        setQueueLength(offlinePlugin.submissionQueueLength());
      }
    };

    const handleDequeue = (event: unknown) => {
      console.log('Submission being processed:', event);
    };

    const handleFormSubmission = (event: unknown) => {
      console.log('Queued submission succeeded:', event);
      if (offlinePlugin) {
        setQueueLength(offlinePlugin.submissionQueueLength());
      }
    };

    const handleFormError = (event: unknown) => {
      console.error('Queued submission failed:', event);
      setOfflineError(event);
      // Queue is automatically stopped, waiting for user intervention
    };

    const handleQueueEmpty = () => {
      console.log('All submissions synced!');
      setQueueLength(0);
      setOfflineError(null);
    };

    Formio.events.on('offline.queue', handleQueue);
    Formio.events.on('offline.dequeue', handleDequeue);
    Formio.events.on('offline.formSubmission', handleFormSubmission);
    Formio.events.on('offline.formError', handleFormError);
    Formio.events.on('offline.queueEmpty', handleQueueEmpty);

    return () => {
      Formio.events.off('offline.queue', handleQueue);
      Formio.events.off('offline.dequeue', handleDequeue);
      Formio.events.off('offline.formSubmission', handleFormSubmission);
      Formio.events.off('offline.formError', handleFormError);
      Formio.events.off('offline.queueEmpty', handleQueueEmpty);
    };
  }, [offlinePlugin]);

  // Handle offline error resolution
  const handleSkipError = () => {
    if (offlinePlugin) {
      offlinePlugin.skipNextQueuedSubmission();
      offlinePlugin.dequeueSubmissions();
      setOfflineError(null);
    }
  };

  const handleRetryError = () => {
    if (offlinePlugin) {
      offlinePlugin.dequeueSubmissions();
    }
  };

  const formio = new Formio(projectUrl);
  formio.currentUser({
    external: true,
    header: header,
  });

  //console.log('Auth0 Token:', accessToken);
  //console.log('Formio Token:', formio.getToken());

  // Handle form submission for external users (Phase 4.3)
  const handleFormSubmit = (submission: unknown) => {
    console.log('Form submitted:', submission);

    // Reset form submission to allow multiple new submissions
    // instead of updating the same submission
    if (formRef.current && userType === UserType.External) {
      setTimeout(() => {
        formRef.current.submission = { data: {} };
      }, 100);
    }
  };

  return (
    <>
      <Header
        handleLogout={handleLogout}
        isOnline={isOnline}
        queueLength={queueLength}
      />

      {/* Offline Error Modal */}
      {offlineError && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <h2>Submission Error</h2>
            <p>
              A queued submission failed to sync. Please resolve the error to
              continue.
            </p>
            <div className="error-details">
              <strong>Error:</strong>
              <pre>{JSON.stringify(offlineError, null, 2)}</pre>
            </div>
            <div className="error-actions">
              <button className="btn btn-primary" onClick={handleRetryError}>
                Retry
              </button>
              <button className="btn btn-secondary" onClick={handleSkipError}>
                Skip & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <FormioProvider Formio={Formio} baseUrl={baseUrl} projectUrl={projectUrl}>
        <div className="app-container">
          {/* Offline Queue Component */}
          <OfflineSubmissionQueue
            offlinePlugin={offlinePlugin}
            queueLength={queueLength}
            isOnline={isOnline}
          />

          <main className="app-main">
            <div className="form-selector">
              <label className="input-label">
                Form Path
                <input
                  type="text"
                  className="form-input"
                  value={formUrl.replace(projectUrl + '/', '')}
                  onChange={(e) =>
                    setFormUrl(`${projectUrl}/${e.target.value}`)
                  }
                  placeholder="e.g., publicaerform1"
                />
              </label>
              <div className="url-display">
                <span className="url-label">API Endpoint:</span>
                <code className="url-code">{formUrl}</code>
              </div>
            </div>
          </main>
          {UserType.External === userType && (
            <main className="app-main">
              <div className="form-container">
                <Form
                  key={formUrl}
                  src={formUrl}
                  onSubmit={handleFormSubmit}
                  onError={(error) => console.error('Form error:', error)}
                  onFormReady={(form) => {
                    console.log('Form ready:', form);
                    formRef.current = form;
                  }}
                />
              </div>
            </main>
          )}
          {UserType.Internal === userType && (
            <main className="app-main">
              <div className="submission-list-container">
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
