import React from 'react';

const ConfirmCard = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div
      className="
        position-fixed
        top-0
        start-0
        w-100
        h-100
        bg-dark
        bg-opacity-50
        d-flex
        justify-content-center
        align-items-center
      "
      style={{ zIndex: 9999 }}
    >
      <div
        className="
          bg-dark
          rounded
          shadow
          p-4
          d-flex
          flex-column
          align-items-center
        "
      >
        <h5 className="confirm-card-title">{title}</h5>
        <p className="confirm-card-message">{message}</p>
        <div className="confirm-card-buttons">
          <button type="button" className="confirm-card-button" onClick={onConfirm}>
            Confirm
          </button>
          <button type="button" className="confirm-card-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCard;
