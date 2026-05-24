import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { FormField } from '../../../components';
import AuthBrandPanel from '../AuthBrandPanel';
import '../AuthPage.css';
import LoadingState from '../../../components/feedback/LoadingState';
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '3', // 3: USER, 2: ORGANIZER, 1: ADMIN
    avatar: null
  });
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, register, registerLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (registerLoading) {
    return (
      <div className="page-shell auth-layout d-flex align-items-center justify-content-center">
        <LoadingState text="Đang đăng ký tài khoản..." />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setFormData((prev) => ({ ...prev, avatar: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setError('');
    console.log(formData);
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setPreview('');
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
    try {
      const response = await register(formData);
      if (!response) {
        setError('Đăng ký thất bại');
        return;
      }
      setSuccess('Đăng ký thành công!');
      navigate('/login'); 
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="page-shell auth-layout">
      <AuthBrandPanel
        title="Gia nhập"
        titleEmphasis="cộng đồng"
        description="Tạo tài khoản để khám phá và đặt vé những sự kiện được tuyển chọn."
      />

      <div className="auth-layout__form-side">
        <div className="auth-layout__card">
          <span className="auth-layout__mobile-eyebrow">Event Booking</span>
          <h2 className="auth-layout__card-title">Đăng ký</h2>
          <p className="auth-layout__card-subtitle">Tạo tài khoản mới của bạn</p>

          {error && <div className="auth-layout__alert auth-layout__alert--danger">{error}</div>}
          {success && <div className="auth-layout__alert auth-layout__alert--success">{success}</div>}

          <Form onSubmit={handleSubmit}>
            <FormField
              className="mb-3 auth-layout__field"
              controlId="fullName"
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
            />

            <FormField
              className="mb-3 auth-layout__field"
              controlId="email"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
              required
            />

            <FormField
              className="mb-3 auth-layout__field"
              controlId="password"
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              required
            />

            <FormField
              className="mb-3 auth-layout__field"
              controlId="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
            />

            <FormField
              className="mb-3 auth-layout__field"
              controlId="avatar"
              label="Ảnh đại diện"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={registerLoading}
            >
              <Form.Text>JPG, PNG, GIF — tối đa 5MB</Form.Text>

              {preview && (
                <div className="auth-layout__avatar-preview">
                  <img src={preview} alt="Xem trước avatar" />
                  <button
                    type="button"
                    className="auth-layout__avatar-remove"
                    onClick={handleRemoveAvatar}
                    disabled={registerLoading}
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </FormField>

            <button
              type="submit"
              className="btn-primary-accent auth-layout__submit"
              disabled={registerLoading}
            >
              {registerLoading ? 'Đang tải ảnh...' : 'Tạo tài khoản'}
            </button>
          </Form>

          <p className="auth-layout__footer">
            Đã có tài khoản?
            <button type="button" className="auth-layout__link" onClick={() => navigate('/login')}>
              Đăng nhập ngay
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

export default RegisterPage;
