import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { uploadToCloudinary } from '../../../configs/CloudinaryConfig';
import { FormField } from '../../../components';
import AuthBrandPanel from '../AuthBrandPanel';
import '../AuthPage.css';

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
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null, avatarUrl: '' }));
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

    if (formData.avatar) {
      setIsUploading(true);
      try {
        const avatarUrl = await uploadToCloudinary(formData.avatar);
        setFormData((prev) => ({ ...prev, avatarUrl }));
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
    <div className="lux-page auth-luxury">
      <AuthBrandPanel
        title="Gia nhập"
        titleEmphasis="cộng đồng"
        description="Tạo tài khoản để khám phá và đặt vé những sự kiện được tuyển chọn."
      />

      <div className="auth-luxury__form-side">
        <div className="auth-luxury__card">
          <span className="auth-luxury__mobile-eyebrow">Event Booking</span>
          <h2 className="auth-luxury__card-title">Đăng ký</h2>
          <p className="auth-luxury__card-subtitle">Tạo tài khoản mới của bạn</p>

          {error && <div className="auth-luxury__alert auth-luxury__alert--danger">{error}</div>}
          {success && <div className="auth-luxury__alert auth-luxury__alert--success">{success}</div>}

          <Form onSubmit={handleSubmit}>
            <FormField
              className="mb-3 auth-luxury__field"
              controlId="fullName"
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
            />

            <FormField
              className="mb-3 auth-luxury__field"
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
              className="mb-3 auth-luxury__field"
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
              className="mb-3 auth-luxury__field"
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
              className="mb-3 auth-luxury__field"
              controlId="avatar"
              label="Ảnh đại diện"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploading}
            >
              <Form.Text>JPG, PNG, GIF — tối đa 5MB</Form.Text>

              {preview && (
                <div className="auth-luxury__avatar-preview">
                  <img src={preview} alt="Xem trước avatar" />
                  <button
                    type="button"
                    className="auth-luxury__avatar-remove"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </FormField>

            <button
              type="submit"
              className="lux-btn-primary auth-luxury__submit"
              disabled={isUploading}
            >
              {isUploading ? 'Đang tải ảnh...' : 'Tạo tài khoản'}
            </button>
          </Form>

          <p className="auth-luxury__footer">
            Đã có tài khoản?
            <button type="button" className="auth-luxury__link" onClick={() => navigate('/login')}>
              Đăng nhập ngay
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

export default RegisterPage;
