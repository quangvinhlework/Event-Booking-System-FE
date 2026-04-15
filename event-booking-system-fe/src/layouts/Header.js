import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleEventsClick = () => {
    navigate('/events');
  }

  const handleAboutClick = () => {
    navigate('/about');
  }

  const handleHomeClick = () => {
    navigate('/');
  }

  const handleBrandClick = () => {
    navigate('/');
  }

  return (
    <Navbar bg="light" expand="lg" className="border-bottom border-2">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user?.role === 'organizer' ? (
              <>
                <Navbar.Brand onClick={() => navigate('/organizer/dashboard')} className="fw-bold">
                  Event Booking
                </Navbar.Brand>
                <Nav.Link onClick={() => navigate('/organizer/dashboard')}>
                  Trang chủ
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/organizer/events')}>
                  Quản lý sự kiện
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/organizer/tickets')}>
                  Quản lý vé
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/organizer/analytics')}>
                  Phân tích
                </Nav.Link>
              </>
            ) : (
              <>
                <Navbar.Brand onClick={handleBrandClick} className="fw-bold">
                  Event Booking
                </Navbar.Brand>
                <Nav.Link onClick={handleHomeClick}>
                  Trang chủ
                </Nav.Link>
                <Nav.Link onClick={handleEventsClick}>
                  Sự kiện
                </Nav.Link>
                <Nav.Link onClick={handleAboutClick}>
                  Giới thiệu
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-2">
                  Xin chào, {user?.name || 'User'}!
                </Navbar.Text>
                <Button variant="outline-danger" onClick={handleLogoutClick}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" className="me-2" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
                <Button variant="primary" onClick={handleRegisterClick}>
                  Đăng ký
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
