import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import FormPage from './FormPage';

function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return <FormPage />;
}

export default App;
