import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import { AuthProvider } from './contexts/AuthContext';

import HomePage from './screens/Home/HomePage';
import LoginPage from './screens/Authentication/Login/LoginPage';
import RegisterPage from './screens/Authentication/Register/RegisterPage';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import PublicRoute from './routes/PublicRoute';
import OrganizerRoute from './routes/OrganizerRoute';
import EventPage from './screens/Event/EventPage';
import Dashboard from './screens/Organizer/Dashboard';
import EventManagement from './screens/Organizer/EventManagement';
import Analytics from './screens/Organizer/Analytics';
import TicketManagement from './screens/Organizer/TicketManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container fluid className="App">
          <Header />
          <Routes>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/events" element={<PublicRoute><EventPage /></PublicRoute>} />
            <Route path="/organizer/dashboard" element={<OrganizerRoute><Dashboard /></OrganizerRoute>} />
            <Route path="/organizer/events" element={<OrganizerRoute><EventManagement /></OrganizerRoute>} />
            <Route path="/organizer/analytics" element={<OrganizerRoute><Analytics /></OrganizerRoute>} />
            <Route path="/organizer/tickets" element={<OrganizerRoute><TicketManagement /></OrganizerRoute>} />
            <Route path="*" element={<PublicRoute><HomePage /></PublicRoute>} />
          </Routes>
          <Footer />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
