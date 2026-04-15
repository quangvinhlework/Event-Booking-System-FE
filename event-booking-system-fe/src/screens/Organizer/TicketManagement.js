import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([
    { id: 1, event: 'Sự kiện 1', buyer: 'Nguyễn Văn A', status: 'Đã bán' },
    { id: 2, event: 'Sự kiện 2', buyer: 'Trần Thị B', status: 'Đã hủy' },
  ]);

  return (
    <Container className="mt-4">
      <h1>Quản lý vé</h1>
      <Table striped bordered hover>
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
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.event}</td>
              <td>{ticket.buyer}</td>
              <td>{ticket.status}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">Xem chi tiết</Button>
                <Button variant="danger" size="sm">Hủy vé</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TicketManagement;