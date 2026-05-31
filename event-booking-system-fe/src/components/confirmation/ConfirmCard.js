import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmCard = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      contentClassName="bg-dark text-light border-secondary"
      data-bs-theme="dark"
      style={{
        zIndex: 9999,
      }}
    >
      <Modal.Header closeButton className="border-secondary">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-secondary">
        <Button variant="outline-light" onClick={onCancel}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmCard;
