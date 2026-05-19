import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { uploadToCloudinary } from '../../../configs/CloudinaryConfig';
import { FormField } from '../../../components';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    avatarUrl: '',
  });
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: null,
      avatarUrl: '',
    }));
    setPreview('');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.avatar) {
      setIsUploading(true);
      try {
        const avatarUrl = await uploadToCloudinary(formData.avatar);
        setFormData((prev) => ({
          ...prev,
          avatarUrl,
        }));
        setSuccess('Avatar đã được tải lên thành công');
      } catch (err) {
        setError(err.message || 'Không thể tải lên avatar');
      } finally {
        setIsUploading(false);
      }
    } else {
      setSuccess('Đăng ký thành công!');
    }
  };

  return (
    <Container className="auth-page justify-content-center">
      <div className="auth-card">
        <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormField
            className="mb-3"
            controlId="fullName"
            label="Họ và tên:"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            required
          />

          <FormField
            className="mb-3"
            controlId="email"
            label="Email:"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
          />

          <FormField
            className="mb-3"
            controlId="password"
            label="Mật khẩu:"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
          />

          <FormField
            className="mb-3"
            controlId="confirmPassword"
            label="Xác nhận mật khẩu:"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            required
          />

          <FormField
            className="mb-3"
            controlId="avatar"
            label="Tải ảnh đại diện (Avatar):"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploading}
          >
            <Form.Text className="text-muted">
              Định dạng: JPG, PNG, GIF (Tối đa 5MB)
            </Form.Text>

            {preview && (
              <div className="mt-3">
                <div className="text-center">
                  <img
                    src={preview}
                    alt="Avatar preview"
                    style={{
                      maxWidth: '150px',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="w-100 mt-2"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                >
                  Xóa ảnh
                </Button>
              </div>
            )}
          </FormField>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isUploading}
          >
            {isUploading ? 'Đang tải ảnh...' : 'Đăng ký'}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Đã có tài khoản?{' '}
          <Button variant="link" onClick={handleLogin}>
            Đăng nhập ngay
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default RegisterPage;
