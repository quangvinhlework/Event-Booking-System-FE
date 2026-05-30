import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOrganizerArea = location.pathname.startsWith('/organizer');
  const isDarkTheme =
    isOrganizerArea ||
    location.pathname.startsWith('/') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/account' ||
    location.pathname === '/become-organizer' ||
    location.pathname.startsWith('/event/') ||
    location.pathname.startsWith('/events/');

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
      className={`navbar-app sticky-top${isDarkTheme ? ' navbar-app--dark' : ''}`}
    >
      <Container>
        <Navbar.Brand
          onClick={() =>
            navigate(user?.roleName === 'ROLE_ORGANIZER' || user?.role === 'ROLE_ORGANIZER' ? '/organizer/dashboard' : '/')
          }
          className="fw-bold navbar-brand-dark"
        >
          Event Booking
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {(user?.roleName === 'ROLE_ORGANIZER' || user?.role === 'ROLE_ORGANIZER') && !isOrganizerArea ? (
              <>
                <Nav.Link onClick={() => navigate('/organizer/dashboard')}>
                  Bảng điều khiển
                </Nav.Link>
              </>
            ) : user?.roleName !== 'ROLE_ORGANIZER' && user?.role !== 'ROLE_ORGANIZER' ? (
              <>
                <Nav.Link onClick={goHome} className={isDarkTheme ? 'nav-link-dark' : ''}>
                  Trang chủ
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/about')} className={isDarkTheme ? 'nav-link-dark' : ''}>
                  Giới thiệu
                </Nav.Link>
              </>
            ) : null}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                {(user?.roleName === 'ROLE_USER' || user?.role === 'ROLE_USER') && (
                  <Button
                    variant={isDarkTheme ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    className={isDarkTheme ? 'btn-nav-outline' : ''}
                    onClick={() => navigate('/become-organizer')}
                  >
                    Trở thành tổ chức viên
                  </Button>
                )}
                <Button
                  variant={isDarkTheme ? 'outline-light' : 'outline-secondary'}
                  size="sm"
                  className={isDarkTheme ? 'btn-nav-outline' : ''}
                  onClick={() => navigate('/account')}
                >
                  Tài khoản
                </Button>
                <Navbar.Text className={isDarkTheme ? 'text-nav-muted' : 'text-muted'}>
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
                  variant={isDarkTheme ? 'outline-light' : 'outline-primary'}
                  size="sm"
                  className={isDarkTheme ? 'btn-nav-outline' : ''}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant={isDarkTheme ? 'warning' : 'primary'}
                  size="sm"
                  className={isDarkTheme ? 'btn-nav-accent' : ''}
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
