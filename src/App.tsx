import { ErrorBoundary, LocalStorageProvider } from '@/shared/components/providers';
import { Router } from './router/Router';

function App() {
  return (
    <ErrorBoundary>
      <LocalStorageProvider>
        <Router />
      </LocalStorageProvider>
    </ErrorBoundary>
  );
}

export default App;
