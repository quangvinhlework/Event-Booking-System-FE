import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container className="h-100">
          <Row className="align-items-center h-100">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="hero-title">Chào mừng đến Event Booking System</h1>
              <p className="hero-subtitle">Đặt vé sự kiện dễ dàng và nhanh chóng với trải nghiệm tuyệt vời</p>
              <div className="hero-buttons">
                <Button onClick={handleLogin} variant="light" size="lg" className="me-3">Đăng nhập</Button>
                <Button onClick={handleRegister} variant="outline-light" size="lg">Đăng ký</Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Event" className="img-fluid rounded shadow" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Events Carousel */}
      <section className="featured-events py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Sự kiện nổi bật</h2>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>Concert Rock 2024</h3>
                <p>Trải nghiệm âm nhạc đỉnh cao với các nghệ sĩ hàng đầu.</p>
                <Button variant="primary">Đặt vé ngay</Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>Hội thảo Công nghệ</h3>
                <p>Cập nhật xu hướng công nghệ mới nhất.</p>
                <Button variant="primary">Đăng ký tham gia</Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images.unsplash.com/photo-1460661411084-41d2db419c91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>Triển lãm Nghệ thuật</h3>
                <p>Khám phá thế giới nghệ thuật đương đại.</p>
                <Button variant="primary">Xem chi tiết</Button>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">Tính năng nổi bật</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-ticket-alt fa-3x text-primary"></i>
                  </div>
                  <Card.Title className="h5">Đặt vé dễ dàng</Card.Title>
                  <Card.Text>Chỉ với vài bước đơn giản, bạn có thể đặt vé cho sự kiện yêu thích.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-calendar-alt fa-3x text-success"></i>
                  </div>
                  <Card.Title className="h5">Sự kiện đa dạng</Card.Title>
                  <Card.Text>Âm nhạc, thể thao, hội thảo, triển lãm - mọi loại sự kiện đều có.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-shield-alt fa-3x text-warning"></i>
                  </div>
                  <Card.Title className="h5">Thanh toán an toàn</Card.Title>
                  <Card.Text>Bảo mật thông tin tối đa với công nghệ mã hóa tiên tiến.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;