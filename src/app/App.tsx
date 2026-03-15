import './App.scss';
import { Suspense } from 'react';
import { Header } from '@widgets/header';
import { Outlet } from 'react-router-dom';
import { Footer } from '@widgets/Footer';
import { GlobalProvider } from '@features/index';
import { ErrorBoundary } from '@ui/index';
import { LoaderSpinner } from '@ui/skeletons';

export const App = () => (
  <div className="App">
    <GlobalProvider>
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<LoaderSpinner />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </GlobalProvider>
    <Footer />
  </div>
);
