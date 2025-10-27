import FormPage from './components/FormPage';
import { useApp } from './components/useApp';

const App: React.FC = () => {
  const { isLoading, isTokenParsed, error, isAuthenticated } = useApp();

  if (isLoading) return <h3>Loading...</h3>;
  if (!isTokenParsed) return <h3>Logging in, please wait...</h3>;
  if (error) return <h3>Ow Snap! Close this tab and retry</h3>;
  if (!isAuthenticated) return <h3>Not logged in</h3>;

  return (
    <FormPage />
  );
};

export default App;
