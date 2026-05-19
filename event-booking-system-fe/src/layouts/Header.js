import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <Navbar expand="lg" className="navbar-app sticky-top">
      <Container>
        <Navbar.Brand
          onClick={() =>
            navigate(user?.role === 'ORGANIZER' ? '/organizer/dashboard' : '/')
          }
          className="fw-bold"
        >
          Event Booking
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {user?.role === 'ORGANIZER' ? (
              <>
                <Nav.Link onClick={() => navigate('/organizer/dashboard')}>
                  Tổng quan
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/organizer/events')}>
                  Sự kiện
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/organizer/tickets')}>
                  Vé
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/organizer/analytics')}>
                  Phân tích
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/')}>Trang chủ</Nav.Link>
                <Nav.Link onClick={() => navigate('/events')}>Sự kiện</Nav.Link>
                <Nav.Link onClick={() => navigate('/about')}>Giới thiệu</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'USER' && (
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate('/become-organizer')}
                  >
                    Trở thành tổ chức viên
                  </Button>
                )}
                <Navbar.Text className="text-muted">
                  Xin chào, {user?.fullName}
                </Navbar.Text>
                <Button variant="danger" onClick={handleLogoutClick}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
                <Button variant="primary" onClick={() => navigate('/register')}>
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
