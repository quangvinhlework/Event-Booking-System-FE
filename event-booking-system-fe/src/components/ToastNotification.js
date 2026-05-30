import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './ToastNotification.css';

const ToastNotification = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleApiError = (event) => {
      const { message, status } = event.detail;
      const id = new Date().getTime() + Math.random();
      setToasts((prev) => [...prev, { id, message, status, type: 'error' }]);
    };
    
    // apiHandler.js only dispatches api_error globally. 
    // We keep success toast available for manual dispatches if needed, 
    // but the main focus is aligning with apiHandler's error structure.
    const handleApiSuccess = (event) => {
      const { message } = event.detail;
      const id = new Date().getTime() + Math.random();
      setToasts((prev) => [...prev, { id, message, type: 'success' }]);
    };

    window.addEventListener('api_error', handleApiError);
    window.addEventListener('api_success', handleApiSuccess);
    return () => {
      window.removeEventListener('api_error', handleApiError);
      window.removeEventListener('api_success', handleApiSuccess);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ position: 'fixed', zIndex: 9999 }}>
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          onClose={() => removeToast(toast.id)} 
          delay={5000} 
          autohide 
          className={`custom-toast custom-toast-${toast.type}`}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.type === 'error' 
                ? `Lỗi ${toast.status ? `(${toast.status})` : ''}` 
                : 'Thành công'}
            </strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastNotification;
