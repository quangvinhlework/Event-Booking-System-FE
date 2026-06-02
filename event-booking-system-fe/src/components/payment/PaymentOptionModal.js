import React from 'react';
import { Modal } from 'react-bootstrap';
import './PaymentOptionModal.css';

const PaymentOptionModal = ({ show, onHide, onSelectOnline, onSelectCounter, ordering }) => {
  return (
    <Modal show={show} onHide={onHide} centered className="payment-modal">
      <Modal.Header closeButton className="payment-modal__header">
        <Modal.Title className="payment-modal__title">
          Chọn phương thức mua vé
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="payment-modal__body">
        <p className="payment-modal__desc">
          Vui lòng chọn hình thức thanh toán phù hợp với bạn để hoàn tất việc mua vé.
        </p>

        <div className="payment-modal__options">
          <button
            className="payment-option-card"
            onClick={onSelectOnline}
            disabled={ordering}
          >
            <div className="payment-option-card__icon payment-option-card__icon--online">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div className="payment-option-card__content">
              <h4>Thanh toán online</h4>
              <p>Thanh toán trực tuyến thông qua Paypal</p>
            </div>
            <div className="payment-option-card__arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>

          <button
            className="payment-option-card"
            onClick={onSelectCounter}
            disabled={ordering}
          >
            <div className="payment-option-card__icon payment-option-card__icon--counter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="payment-option-card__content">
              <h4>Thanh toán tại quầy</h4>
              <p>Mua vé và thanh toán trực tiếp tại quầy sự kiện</p>
            </div>
            <div className="payment-option-card__arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentOptionModal;
