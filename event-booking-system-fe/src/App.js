import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';

import HomePage from './screens/Home/HomePage';
import LoginPage from './screens/Authentication/Login/LoginPage';
import RegisterPage from './screens/Authentication/Register/RegisterPage';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import PublicRoute from './routes/PublicRoute';
import OrganizerRoute from './routes/OrganizerRoute';
import EventPage from './screens/Event/EventPage';
import EventDetailPage from './screens/Event/EventDetailPage';
import Dashboard from './screens/Organizer/Dashboard';
import EventManagement from './screens/Organizer/EventManagementPage';
import Analytics from './screens/Organizer/AnalyticsPage';
import TicketManagement from './screens/Organizer/TicketManagementPage';
import EventComparison from './screens/Event/EventComparison';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App app-shell">
          <Header />
          <Routes>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/events" element={<PublicRoute><EventPage /></PublicRoute>} />
            <Route path="/events/comparison" element={<PublicRoute><EventComparison /></PublicRoute>} />
            <Route path="/event/:id" element={<PublicRoute><EventDetailPage /></PublicRoute>} />
            <Route path="/events/:id" element={<PublicRoute><EventDetailPage /></PublicRoute>} />
            <Route path="/organizer/dashboard" element={<OrganizerRoute><Dashboard /></OrganizerRoute>} />
            <Route path="/organizer/events" element={<OrganizerRoute><EventManagement /></OrganizerRoute>} />
            <Route path="/organizer/analytics" element={<OrganizerRoute><Analytics /></OrganizerRoute>} />
            <Route path="/organizer/tickets" element={<OrganizerRoute><TicketManagement /></OrganizerRoute>} />
            <Route path="*" element={<PublicRoute><HomePage /></PublicRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
