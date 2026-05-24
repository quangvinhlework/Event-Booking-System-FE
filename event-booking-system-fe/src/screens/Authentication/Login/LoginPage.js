import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { FormField, LoadingState } from '../../../components';
import AuthBrandPanel from '../AuthBrandPanel';
import '../AuthPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Đăng nhập thất bại:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="page-shell auth-layout d-flex align-items-center justify-content-center">
        <LoadingState text="Đang đăng nhập..." />
      </div>
    );
  }

  return (
    <div className="page-shell auth-layout">
      <AuthBrandPanel
        title="Trải nghiệm"
        titleEmphasis="đẳng cấp"
        description="Đăng nhập để đặt vé sự kiện yêu thích và quản lý hành trình của bạn."
      />

      <div className="auth-layout__form-side">
        <div className="auth-layout__card">
          <span className="auth-layout__mobile-eyebrow">Event Booking</span>
          <h2 className="auth-layout__card-title">Đăng nhập</h2>
          <p className="auth-layout__card-subtitle">Chào mừng bạn quay trở lại</p>

          {error && <div className="auth-layout__alert auth-layout__alert--danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <FormField
              className="mb-3 auth-layout__field"
              controlId="email"
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
            />

            <FormField
              className="mb-4 auth-layout__field"
              controlId="password"
              label="Mật khẩu"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button type="submit" className="btn-primary-accent auth-layout__submit" disabled={submitting}>
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </Form>

          <p className="auth-layout__footer">
            Chưa có tài khoản?
            <button type="button" className="auth-layout__link" onClick={() => navigate('/register')}>
              Đăng ký ngay
            </button>
          </p>

          <div className="auth-layout__back-home">
            <button type="button" onClick={() => navigate('/')}>
              ← Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
