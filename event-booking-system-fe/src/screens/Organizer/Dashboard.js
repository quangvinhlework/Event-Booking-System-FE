import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const stats = [
  {
    title: 'Tổng số sự kiện',
    value: '10',
    hint: 'Sự kiện đang quản lý',
  },
  {
    title: 'Vé đã bán',
    value: '150',
    hint: 'Tổng vé đã phát hành',
  },
  {
    title: 'Doanh thu',
    value: '1.500.000 VND',
    hint: 'Doanh thu ghi nhận',
  },
];

const Dashboard = () => {
  return (
    <Container className="app-page">
      <div className="section-heading">
        <div className="section-eyebrow">Organizer</div>
        <h1 className="section-title">Tổng quan</h1>
        <p className="section-subtitle">
          Theo dõi nhanh tình hình vận hành sự kiện và hiệu quả bán vé.
        </p>
      </div>

      <Row className="g-4">
        {stats.map((stat) => (
          <Col md={4} key={stat.title}>
            <Card className="h-100">
              <Card.Body className="p-4">
                <Card.Title className="text-muted fs-6">{stat.title}</Card.Title>
                <div className="display-6 fw-bold text-primary mb-2">
                  {stat.value}
                </div>
                <Card.Text className="text-muted mb-0">{stat.hint}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
