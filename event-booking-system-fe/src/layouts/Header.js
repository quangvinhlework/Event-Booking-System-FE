import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOrganizerArea = location.pathname.startsWith('/organizer');
  const isLuxuryTheme =
    isOrganizerArea ||
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/event/');

  const handleLogoutClick = () => {
    logout();
  };

  const goHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate('/');
  };

  return (
    <Navbar
      expand="lg"
      className={`navbar-app sticky-top${isLuxuryTheme ? ' navbar-app--luxury' : ''}`}
    >
      <Container>
        <Navbar.Brand
          onClick={() =>
            navigate(user?.role === 'ORGANIZER' ? '/organizer/dashboard' : '/')
          }
          className="fw-bold navbar-brand-luxury"
        >
          Event Booking
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {user?.role === 'ORGANIZER' && !isOrganizerArea ? (
              <>
                <Nav.Link onClick={() => navigate('/organizer/dashboard')}>
                  Bảng điều khiển
                </Nav.Link>
              </>
            ) : user?.role !== 'ORGANIZER' ? (
              <>
                <Nav.Link onClick={goHome} className={isLuxuryTheme ? 'nav-link-luxury' : ''}>
                  Trang chủ
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/about')} className={isLuxuryTheme ? 'nav-link-luxury' : ''}>
                  Giới thiệu
                </Nav.Link>
              </>
            ) : null}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'USER' && (
                  <Button
                    variant={isLuxuryTheme ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    className={isLuxuryTheme ? 'btn-luxury-outline' : ''}
                    onClick={() => navigate('/become-organizer')}
                  >
                    Trở thành tổ chức viên
                  </Button>
                )}
                <Navbar.Text className={isLuxuryTheme ? 'text-luxury-muted' : 'text-muted'}>
                  Xin chào, {user?.fullName}
                </Navbar.Text>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLogoutClick}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={isLuxuryTheme ? 'outline-light' : 'outline-primary'}
                  size="sm"
                  className={isLuxuryTheme ? 'btn-luxury-outline' : ''}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant={isLuxuryTheme ? 'warning' : 'primary'}
                  size="sm"
                  className={isLuxuryTheme ? 'btn-luxury-gold' : ''}
                  onClick={() => navigate('/register')}
                >
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
