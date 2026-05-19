import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer-app py-5">
      <Container>
        <Row className="g-4">
          <Col md={5}>
            <h3>Event Booking</h3>
            <p className="mb-0">
              Hệ thống đặt vé sự kiện trực tuyến dành cho người tham dự và nhà
              tổ chức.
            </p>
          </Col>

          <Col md={3}>
            <h3>Liên kết</h3>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="/" className="text-decoration-none">Trang chủ</a>
              </li>
              <li className="mb-2">
                <a href="/events" className="text-decoration-none">Sự kiện</a>
              </li>
              <li>
                <a href="/contact" className="text-decoration-none">Liên hệ</a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h3>Liên hệ</h3>
            <p className="mb-2">Email: info@eventbooking.com</p>
            <p className="mb-0">Điện thoại: 0889100888</p>
          </Col>
        </Row>

        <div className="border-top border-secondary mt-4 pt-4 text-center">
          <small>© 2026 Event Booking System. Tất cả quyền được bảo lưu.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
