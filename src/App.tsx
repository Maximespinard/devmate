import { BrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/shared/components/layout';
import {
  ErrorBoundary,
  LocalStorageProvider,
} from '@/shared/components/providers';
import { useAppSettings } from '@/shared/hooks/useAppSettings';
import { useURLState } from '@/shared/hooks';

function AppContent() {
  const { settings, updateSettings } = useAppSettings();
  const [activeTab, setActiveTab] = useURLState<string>('tab', {
    defaultValue: 'home',
  });

  return (
    <RootLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="glass-panel p-8 max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DevMate
          </h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Local Storage Demo</h2>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.developerMode}
                    onChange={(e) =>
                      updateSettings({ developerMode: e.target.checked })
                    }
                    className="rounded"
                  />
                  Developer Mode
                </label>
                <span className="text-muted-foreground">
                  {settings.developerMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">URL State Demo</h2>
              <div className="flex gap-2">
                {['home', 'about', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={
                      activeTab === tab ? 'button-primary' : 'button-secondary'
                    }
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Active tab: {activeTab} (check the URL)
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                All components are working: RootLayout with glassmorphism
                background, LocalStorage provider, URL state management, and
                Error Boundary wrapper.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LocalStorageProvider>
          <AppContent />
        </LocalStorageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
