import React, { useState } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';

const TicketManagement = () => {
  const [tickets] = useState([
    { id: 1, event: 'Sự kiện 1', buyer: 'Nguyễn Văn A', status: 'Đã bán' },
    { id: 2, event: 'Sự kiện 2', buyer: 'Trần Thị B', status: 'Đã hủy' },
  ]);

  const getStatusVariant = (status) => {
    return status === 'Đã bán' ? 'success' : 'secondary';
  };

  return (
    <Container className="app-page">
      <div className="section-heading">
        <div className="section-eyebrow">Quản lý</div>
        <h1 className="section-title">Vé</h1>
        <p className="section-subtitle">
          Theo dõi người mua, trạng thái vé và thao tác hỗ trợ khách hàng.
        </p>
      </div>

      <div className="table-panel">
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sự kiện</th>
              <th>Người mua</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.event}</td>
                <td>{ticket.buyer}</td>
                <td>
                  <Badge bg={getStatusVariant(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    Xem chi tiết
                  </Button>
                  <Button variant="danger" size="sm">
                    Hủy vé
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default TicketManagement;
