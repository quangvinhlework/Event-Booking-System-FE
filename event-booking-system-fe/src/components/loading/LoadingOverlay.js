import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingOverlay = ({
  loading,
  text = 'Đang xử lý...',
}) => {

  if (!loading) return null;

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
      style={{
        zIndex: 9999,
      }}
    >
      <div
        className="
          bg-white
          rounded
          shadow
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
};

export default LoadingOverlay;