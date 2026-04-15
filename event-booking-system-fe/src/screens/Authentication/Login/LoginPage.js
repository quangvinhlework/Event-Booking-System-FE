import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      console.log('Đăng nhập với:', { email, password });
      login(email, password);
    } else {
      setError('Vui lòng nhập đầy đủ thông tin');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Đăng nhập</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mật khẩu:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Đăng nhập
          </Button>
        </Form>
        <p className="text-center mt-3">
          Chưa có tài khoản? <Button variant="link" onClick={handleRegister}>Đăng ký ngay</Button>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
