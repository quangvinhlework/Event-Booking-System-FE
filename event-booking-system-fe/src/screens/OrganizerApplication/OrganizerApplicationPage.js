import React, { useMemo, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormField, LoadingOverlay } from '../../components';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
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

  const buildApplicationFormData = () => {
    const formData = new FormData();
    formData.append("company", application.organizationName)
    return formData;
  };

  const validateApplication = () => {
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateApplication();
    if (validationError) {
      showErrorToast(validationError);
      return;
    }

    setLoading(true);
    const response = await submitOrganizerApplication(buildApplicationFormData());
    setLoading(false);

    if (!response.success) {
      return;
    }

    showSuccessToast('Hồ sơ đăng ký organizer đã được gửi.');
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
