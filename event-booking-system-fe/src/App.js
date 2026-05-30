import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/theme.css';

import { AuthProvider } from './contexts/AuthContext';
import { APP_ROUTES } from './config/routes';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import OrganizerRoute from './routes/OrganizerRoute';
import ToastNotification from './components/ToastNotification';

const ROUTE_GUARDS = {
  public: PublicRoute,
  protected: ProtectedRoute,
  organizer: OrganizerRoute,
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App app-shell">
          <ToastNotification />
          <Header />
          <Routes>
            {APP_ROUTES.map(({ path, page: Page, guard }) => {
              const Guard = ROUTE_GUARDS[guard];
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Guard>
                      <Page />
                    </Guard>
                  }
                />
              );
            })}
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
