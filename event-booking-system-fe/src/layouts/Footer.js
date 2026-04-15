import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h3>Giới thiệu</h3>
            <p>Hệ thống đặt vé sự kiện trực tuyến tiện lợi và nhanh chóng.</p>
          </Col>
          <Col md={4} className="mb-3">
            <h3>Liên kết</h3>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Trang chủ</a></li>
              <li><a href="/events" className="text-white text-decoration-none">Sự kiện</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Liên hệ</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h3>Liên hệ</h3>
            <p>Email: info@eventbooking.com</p>
            <p>Điện thoại: 0889100888</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p>&copy; 2026 Event Booking System. Tất cả quyền được bảo lưu.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
