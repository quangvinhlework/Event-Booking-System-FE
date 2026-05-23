import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { FormField } from '../../../components';
import AuthBrandPanel from '../AuthBrandPanel';
import '../AuthPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Đăng nhập thất bại:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
    }
  };

  return (
    <div className="lux-page auth-luxury">
      <AuthBrandPanel
        title="Trải nghiệm"
        titleEmphasis="đẳng cấp"
        description="Đăng nhập để đặt vé sự kiện yêu thích và quản lý hành trình của bạn."
      />

      <div className="auth-luxury__form-side">
        <div className="auth-luxury__card">
          <span className="auth-luxury__mobile-eyebrow">Event Booking</span>
          <h2 className="auth-luxury__card-title">Đăng nhập</h2>
          <p className="auth-luxury__card-subtitle">Chào mừng bạn quay trở lại</p>

          {error && <div className="auth-luxury__alert auth-luxury__alert--danger">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <FormField
              className="mb-3 auth-luxury__field"
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
              className="mb-4 auth-luxury__field"
              controlId="password"
              label="Mật khẩu"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button type="submit" className="lux-btn-primary auth-luxury__submit">
              Đăng nhập
            </button>
          </Form>

          <p className="auth-luxury__footer">
            Chưa có tài khoản?
            <button type="button" className="auth-luxury__link" onClick={() => navigate('/register')}>
              Đăng ký ngay
            </button>
          </p>

          <div className="auth-luxury__back-home">
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
