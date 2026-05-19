import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { FormField } from '../../../components';

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
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container className="auth-page justify-content-center">
      <div className="auth-card">
        <h2 className="text-center mb-4">Đăng nhập</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormField
            className="mb-3"
            controlId="email"
            label="Email:"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
          />

          <FormField
            className="mb-3"
            controlId="password"
            label="Mật khẩu:"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />

          <Button type="submit" variant="primary" className="w-100">
            Đăng nhập
          </Button>
        </Form>

        <p className="text-center mt-3">
          Chưa có tài khoản?{' '}
          <Button variant="link" onClick={handleRegister}>
            Đăng ký ngay
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
