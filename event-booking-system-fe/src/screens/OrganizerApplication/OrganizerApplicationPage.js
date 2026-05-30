import React, { useMemo, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FilePickerWithList, FormField, LoadingOverlay } from '../../components';
import { showErrorToast } from '../../utils/toast';
import { submitOrganizerApplication } from '../../services/organizerApplicationService';
import './OrganizerApplicationPage.css';

const initialApplication = {
  organizationName: '',
  representativeName: '',
  email: '',
  phoneNumber: '',
  address: '',
  website: '',
  taxCode: '',
  organizationType: 'COMPANY',
  eventExperience: '',
  expectedEventTypes: '',
  description: '',
  businessLicense: [],
  identityDocuments: [],
  portfolioFiles: [],
};

const organizationTypeOptions = [
  { label: 'Doanh nghiệp', value: 'COMPANY' },
  { label: 'Cá nhân / nhóm tổ chức', value: 'INDIVIDUAL' },
  { label: 'Tổ chức giáo dục', value: 'EDUCATION' },
  { label: 'Tổ chức cộng đồng / phi lợi nhuận', value: 'NON_PROFIT' },
];

const OrganizerApplicationPage = () => {
  const [application, setApplication] = useState(initialApplication);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const selectedFileCount = useMemo(
    () =>
      application.businessLicense.length +
      application.identityDocuments.length +
      application.portfolioFiles.length,
    [
      application.businessLicense.length,
      application.identityDocuments.length,
      application.portfolioFiles.length,
    ]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setApplication((prev) => ({
      ...prev,
      [name]: [...prev[name], ...Array.from(files)],
    }));
  };

  const removeFile = (fieldName, indexToRemove) => {
    setApplication((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove),
    }));
  };

  const buildApplicationFormData = () => {
    const formData = new FormData();

    Object.entries(application).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => formData.append(key, file));
        return;
      }

      formData.append(key, value.trim ? value.trim() : value);
    });

    return formData;
  };

  const validateApplication = () => {
    if (application.phoneNumber.trim().length < 9) {
      return 'Vui lòng nhập số điện thoại hợp lệ.';
    }

    if (!application.businessLicense.length) {
      return 'Vui lòng tải lên giấy phép kinh doanh hoặc giấy tờ chứng minh tổ chức.';
    }

    if (!application.identityDocuments.length) {
      return 'Vui lòng tải lên giấy tờ định danh của người đại diện.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess('');

    const validationError = validateApplication();
    if (validationError) {
      showErrorToast(validationError);
      return;
    }

    setLoading(true);
    const response = await submitOrganizerApplication(buildApplicationFormData());
    setLoading(false);

    if (!response.success) {
      // apiHandler already dispatched error toast
      return;
    }

    setSuccess(response.message || 'Hồ sơ đăng ký organizer đã được gửi.');
    setApplication(initialApplication);
  };

  return (
    <main className="page-shell app-page organizer-application-page">
      <LoadingOverlay loading={loading} text="Đang gửi hồ sơ..." />

      <Container>
        <div className="section-heading">
          <p className="section-eyebrow page-eyebrow">Organizer Application</p>
          <h1 className="section-title page-title-lg h2">Đăng ký trở thành tổ chức viên</h1>
          <p className="section-subtitle">
            Cung cấp thông tin về đơn vị, người đại diện và tài liệu xác minh để
            đội ngũ quản trị xét duyệt quyền tạo sự kiện.
          </p>
        </div>

        <Row className="g-4 align-items-start">
          <Col lg={8}>
            <div className="organizer-application-form">
              {success && (
                <div className="organizer-application-alert organizer-application-alert--success">
                  <span>{success}</span>
                  <button type="button" onClick={() => setSuccess('')} aria-label="Đóng">
                    ×
                  </button>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <section className="application-section">
                  <h2>Thông tin tổ chức</h2>
                  <Row className="g-3">
                    <Col md={8}>
                      <FormField
                        controlId="organizationName"
                        label="Tên tổ chức"
                        name="organizationName"
                        value={application.organizationName}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Công ty TNHH Event Hub"
                        required
                      />
                    </Col>

                    <Col md={4}>
                      <FormField
                        controlId="organizationType"
                        label="Loại hình"
                        name="organizationType"
                        value={application.organizationType}
                        onChange={handleInputChange}
                        options={organizationTypeOptions}
                        required
                      />
                    </Col>

                    <Col md={6}>
                      <FormField
                        controlId="taxCode"
                        label="Mã số thuế / mã định danh"
                        name="taxCode"
                        value={application.taxCode}
                        onChange={handleInputChange}
                        placeholder="Nhập mã số thuế nếu có"
                      />
                    </Col>

                    <Col md={6}>
                      <FormField
                        controlId="website"
                        label="Website / fanpage"
                        name="website"
                        value={application.website}
                        onChange={handleInputChange}
                        placeholder="https://..."
                      />
                    </Col>

                    <Col md={12}>
                      <FormField
                        controlId="address"
                        label="Địa chỉ hoạt động"
                        name="address"
                        value={application.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ văn phòng hoặc địa điểm hoạt động chính"
                        required
                      />
                    </Col>

                    <Col md={12}>
                      <FormField
                        controlId="description"
                        label="Giới thiệu ngắn"
                        as="textarea"
                        rows={4}
                        name="description"
                        value={application.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả lĩnh vực hoạt động, quy mô và lý do muốn trở thành organizer"
                        required
                      />
                    </Col>
                  </Row>
                </section>

                <section className="application-section">
                  <h2>Người đại diện</h2>
                  <Row className="g-3">
                    <Col md={4}>
                      <FormField
                        controlId="representativeName"
                        label="Họ và tên"
                        name="representativeName"
                        value={application.representativeName}
                        onChange={handleInputChange}
                        placeholder="Người chịu trách nhiệm hồ sơ"
                        required
                      />
                    </Col>

                    <Col md={4}>
                      <FormField
                        controlId="email"
                        label="Email liên hệ"
                        type="email"
                        name="email"
                        value={application.email}
                        onChange={handleInputChange}
                        placeholder="contact@example.com"
                        required
                      />
                    </Col>

                    <Col md={4}>
                      <FormField
                        controlId="phoneNumber"
                        label="Số điện thoại"
                        name="phoneNumber"
                        value={application.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="090..."
                        required
                      />
                    </Col>
                  </Row>
                </section>

                <section className="application-section">
                  <h2>Kinh nghiệm tổ chức</h2>
                  <Row className="g-3">
                    <Col md={6}>
                      <FormField
                        controlId="eventExperience"
                        label="Kinh nghiệm đã có"
                        as="textarea"
                        rows={4}
                        name="eventExperience"
                        value={application.eventExperience}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: đã tổ chức workshop, concert, webinar..."
                        required
                      />
                    </Col>

                    <Col md={6}>
                      <FormField
                        controlId="expectedEventTypes"
                        label="Loại sự kiện dự kiến tạo"
                        as="textarea"
                        rows={4}
                        name="expectedEventTypes"
                        value={application.expectedEventTypes}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: âm nhạc, giáo dục, cộng đồng, triển lãm..."
                        required
                      />
                    </Col>
                  </Row>
                </section>

                <section className="application-section">
                  <h2>Tài liệu xác minh</h2>
                  <Row className="g-3">
                    <Col md={6}>
                      <FilePickerWithList
                        label="Giấy phép / giấy tờ tổ chức"
                        name="businessLicense"
                        files={application.businessLicense}
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        onRemove={removeFile}
                        removeLabel="Xóa tài liệu"
                      />
                      <Form.Text className="text-muted">
                        Chấp nhận ảnh hoặc PDF.
                      </Form.Text>
                    </Col>

                    <Col md={6}>
                      <FilePickerWithList
                        label="Giấy tờ định danh người đại diện"
                        name="identityDocuments"
                        files={application.identityDocuments}
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        onRemove={removeFile}
                        removeLabel="Xóa tài liệu"
                      />
                      <Form.Text className="text-muted">
                        Có thể tải mặt trước và mặt sau.
                      </Form.Text>
                    </Col>

                    <Col md={12}>
                      <FilePickerWithList
                        label="Hồ sơ năng lực / hình ảnh sự kiện đã tổ chức (tùy chọn)"
                        name="portfolioFiles"
                        files={application.portfolioFiles}
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        onRemove={removeFile}
                        removeLabel="Xóa tài liệu"
                      />
                    </Col>
                  </Row>
                </section>

                <div className="organizer-application-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary-accent" style={{ width: 'auto' }} disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi hồ sơ xét duyệt'}
                  </button>
                </div>
              </Form>
            </div>
          </Col>

          <Col lg={4}>
            <aside className="organizer-application-summary">
              <h2>Hồ sơ nên có</h2>
              <ul>
                <li>Thông tin tổ chức rõ ràng và có thể liên hệ.</li>
                <li>Tài liệu xác minh còn hiệu lực.</li>
                <li>Mô tả kinh nghiệm tổ chức sự kiện thực tế.</li>
                <li>Loại sự kiện dự kiến phù hợp với nền tảng.</li>
              </ul>

              <div className="application-file-counter">
                <span>Tài liệu đã chọn</span>
                <strong>{selectedFileCount}</strong>
              </div>
            </aside>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default OrganizerApplicationPage;
