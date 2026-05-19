import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingState = ({
  text = 'Loading...',
  className = 'text-center py-5',
}) => {
  return (
    <div className={className}>
      <Spinner animation="border" role="status" />
      {text && <p className="mt-2 mb-0">{text}</p>}
    </div>
  );
};

export default LoadingState;
