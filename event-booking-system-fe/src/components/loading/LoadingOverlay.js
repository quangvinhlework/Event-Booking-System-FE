import React from 'react';
import { createPortal } from 'react-dom';
import { Spinner } from 'react-bootstrap';

const LoadingOverlay = ({
  loading,
  text = 'Đang xử lý...',
}) => {

  if (!loading) return null;

  const overlayContent = (
    <div
      className="
        position-fixed
        top-0
        start-0
        w-100
        h-100
        d-flex
        justify-content-center
        align-items-center
      "
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <div
        className="
          bg-dark
          text-white
          rounded
          shadow-lg
          p-4
          d-flex
          flex-column
          align-items-center
        "
      >
        <Spinner
          animation="border"
          role="status"
        />

        <div className="mt-3 fw-semibold">
          {text}
        </div>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};

export default LoadingOverlay;