import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Analytics = () => {
  return (
    <Container className="mt-4">
      <h1>Phân tích</h1>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Biểu đồ doanh thu</Card.Title>
              <Card.Text>Đồ thị hiển thị doanh thu theo tháng.</Card.Text>
              {/* Placeholder for chart */}
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Biểu đồ doanh thu
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Biểu đồ số lượng vé bán</Card.Title>
              <Card.Text>Đồ thị hiển thị số vé bán theo sự kiện.</Card.Text>
              {/* Placeholder for chart */}
              <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Biểu đồ vé bán
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;