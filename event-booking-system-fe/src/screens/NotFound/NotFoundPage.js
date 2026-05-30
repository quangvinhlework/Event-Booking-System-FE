import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ROUTES } from '../../config/routes';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page page-shell">
      <Container className="not-found-content">
        <div className="not-found-errorCode">404</div>
        <h1 className="not-found-title page-title-lg">Trang Không Tồn Tại</h1>
        <p className="not-found-desc text-muted">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại, đã bị xóa, hoặc tạm thời không khả dụng. 
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>
        <div className="not-found-action">
          <button 
            type="button" 
            className="btn-primary-accent" 
            onClick={() => navigate(ROUTES.HOME)}
          >
            Về Trang Chủ
          </button>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
