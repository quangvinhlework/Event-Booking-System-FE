import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={8}>
              <div className="section-eyebrow text-white-50">Event Booking</div>
              <h1 className="hero-title">Đặt vé sự kiện nhanh, rõ ràng và đáng tin cậy</h1>
              <p className="hero-subtitle">
                Khám phá sự kiện nổi bật, đặt vé thuận tiện và quản lý trải
                nghiệm tham dự trong một nền tảng thống nhất.
              </p>
              <div className="hero-buttons">
                <Button variant="primary" size="lg" onClick={() => navigate('/events')}>
                  Khám phá sự kiện
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => navigate('/register')}>
                  Tạo tài khoản
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="featured-events">
        <Container>
          <div className="section-heading text-center">
            <div className="section-eyebrow">Nổi bật</div>
            <h2 className="section-title">Sự kiện đáng chú ý</h2>
            <p className="section-subtitle mx-auto">
              Những trải nghiệm được chọn lọc cho âm nhạc, hội thảo, triển lãm
              và các hoạt động cộng đồng.
            </p>
          </div>

          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2070&q=80"
                alt="Concert"
              />
              <Carousel.Caption>
                <h3>Concert mùa hè</h3>
                <p>Không gian âm nhạc sôi động với các nghệ sĩ được yêu thích.</p>
                <Button variant="primary" onClick={() => navigate('/events')}>
                  Đặt vé ngay
                </Button>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2070&q=80"
                alt="Technology conference"
              />
              <Carousel.Caption>
                <h3>Hội thảo công nghệ</h3>
                <p>Cập nhật xu hướng mới và kết nối với cộng đồng chuyên môn.</p>
                <Button variant="primary" onClick={() => navigate('/events')}>
                  Xem chi tiết
                </Button>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://images.unsplash.com/photo-1460661411084-41d2db419c91?auto=format&fit=crop&w=2070&q=80"
                alt="Art exhibition"
              />
              <Carousel.Caption>
                <h3>Triển lãm nghệ thuật</h3>
                <p>Khám phá các tác phẩm đương đại trong không gian giàu cảm hứng.</p>
                <Button variant="primary" onClick={() => navigate('/events')}>
                  Khám phá
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      <section className="features">
        <Container>
          <div className="section-heading text-center">
            <div className="section-eyebrow">Trải nghiệm</div>
            <h2 className="section-title">Tối ưu cho người tham dự và nhà tổ chức</h2>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon mb-3 text-primary fw-bold">01</div>
                  <Card.Title>Đặt vé dễ dàng</Card.Title>
                  <Card.Text className="text-muted">
                    Tìm sự kiện, xem thông tin quan trọng và hoàn tất đặt vé
                    trong vài bước.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon mb-3 text-primary fw-bold">02</div>
                  <Card.Title>Sự kiện đa dạng</Card.Title>
                  <Card.Text className="text-muted">
                    Âm nhạc, thể thao, hội thảo và triển lãm được trình bày
                    nhất quán, dễ so sánh.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon mb-3 text-primary fw-bold">03</div>
                  <Card.Title>Quản lý rõ ràng</Card.Title>
                  <Card.Text className="text-muted">
                    Nhà tổ chức có khu vực riêng để theo dõi sự kiện, vé và
                    hiệu quả vận hành.
                  </Card.Text>
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
