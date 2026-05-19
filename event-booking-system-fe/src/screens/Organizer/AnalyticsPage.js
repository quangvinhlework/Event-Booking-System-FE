import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Analytics = () => {
  return (
    <Container className="app-page">
      <div className="section-heading">
        <div className="section-eyebrow">Báo cáo</div>
        <h1 className="section-title">Phân tích</h1>
        <p className="section-subtitle">
          Các chỉ số trực quan giúp nhà tổ chức theo dõi doanh thu và lượng vé bán.
        </p>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="p-4">
              <Card.Title>Biểu đồ doanh thu</Card.Title>
              <Card.Text className="text-muted">
                Doanh thu theo tháng từ các sự kiện đã phát hành.
              </Card.Text>
              <div className="chart-placeholder">
                <span>Doanh thu</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="p-4">
              <Card.Title>Biểu đồ vé bán</Card.Title>
              <Card.Text className="text-muted">
                Số lượng vé bán theo từng sự kiện.
              </Card.Text>
              <div className="chart-placeholder chart-placeholder-accent">
                <span>Vé bán</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
