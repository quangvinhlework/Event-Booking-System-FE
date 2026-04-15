import React, { useState } from 'react';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';

const EventManagement = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Sự kiện 1', date: '2023-10-01', status: 'Active' },
    { id: 2, name: 'Sự kiện 2', date: '2023-10-15', status: 'Inactive' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '' });

  const handleAddEvent = () => {
    setEvents([...events, { id: events.length + 1, ...newEvent, status: 'Active' }]);
    setNewEvent({ name: '', date: '' });
    setShowModal(false);
  };

  return (
    <Container className="mt-4">
      <h1>Quản lý sự kiện</h1>
      <Button onClick={() => setShowModal(true)} className="mb-3">Thêm sự kiện</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sự kiện</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.status}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">Sửa</Button>
                <Button variant="danger" size="sm">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sự kiện mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sự kiện</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleAddEvent}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventManagement;