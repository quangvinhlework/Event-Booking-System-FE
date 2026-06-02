import React from 'react';
import { Modal } from 'react-bootstrap';
import './CounterInstructionModal.css';

const CounterInstructionModal = ({ show, onHide, event }) => {
  if (!event) return null;

  return (
    <Modal show={show} onHide={onHide} centered className="counter-modal">
      <div className="counter-modal__header-bg">
        <div className="counter-modal__icon-wrapper">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
      </div>
      
      <Modal.Body className="counter-modal__body">
        <h3 className="counter-modal__title">Hướng dẫn mua vé tại quầy</h3>
        <p className="counter-modal__subtitle">
          Vui lòng làm theo các bước dưới đây để hoàn tất việc mua vé cho sự kiện <br />
          <strong style={{ color: 'var(--theme-text)' }}>{event.name}</strong>.
        </p>

        <div className="counter-modal__steps">
          <div className="counter-modal__step">
            <div className="counter-modal__step-number">1</div>
            <div className="counter-modal__step-content">
              <h4>Đến địa điểm sự kiện</h4>
              <p>{event.location || 'Địa điểm tổ chức sự kiện'}</p>
            </div>
          </div>
          <div className="counter-modal__step">
            <div className="counter-modal__step-number">2</div>
            <div className="counter-modal__step-content">
              <h4>Gặp nhân viên hỗ trợ</h4>
              <p>Đến quầy Check-in / Bán vé và yêu cầu mua vé trực tiếp.</p>
            </div>
          </div>
          <div className="counter-modal__step">
            <div className="counter-modal__step-number">3</div>
            <div className="counter-modal__step-content">
              <h4>Thanh toán & Nhận vé</h4>
              <p>Thanh toán bằng tiền mặt hoặc quét mã QR do nhân viên cung cấp để nhận vé cứng/vé điện tử.</p>
            </div>
          </div>
        </div>

        <div className="counter-modal__warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>Lưu ý quan trọng:</strong>
            <p>Hệ thống không giữ chỗ trước. Vé có thể hết nếu số lượng người mua trực tiếp vượt quá số lượng vé còn lại.</p>
          </div>
        </div>

        <button className="counter-modal__btn" onClick={onHide}>
          Tôi đã hiểu, đóng
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default CounterInstructionModal;
