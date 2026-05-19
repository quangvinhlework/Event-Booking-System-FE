import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../hooks/event/useEvent.js';
import { useCategory } from '../../hooks/useCategory';
import {
  EmptyState,
  EventCard,
  FormField,
  LoadingState,
} from '../../components';

const EventPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { events, loading, error } = useEvent(searchTerm, selectedCategory);
  const { categories } = useCategory();

  const categoryOptions = [
    {
      label: 'Tất cả danh mục',
      value: '',
    },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('name', searchTerm);
    if (selectedCategory) params.set('cateId', selectedCategory);
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchTerm, selectedCategory, navigate]);

  const getCategoryColor = (category) => {
    const colors = {
      music: 'danger',
      sports: 'success',
      workshop: 'info',
      exhibition: 'warning',
    };
    return colors[category] || 'secondary';
  };

  const getCategoryName = (categoryId) => {
    return categories.find((category) => category.id === categoryId)?.name || categoryId;
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <Container className="app-page">
      <Row className="section-heading">
        <Col>
          <div className="section-eyebrow">Khám phá</div>
          <h1 className="display-5 fw-bold mb-2">Sự kiện sắp diễn ra</h1>
          <p className="section-subtitle">
            Khám phá và đặt vé cho những sự kiện của bạn
          </p>
        </Col>
      </Row>

      <Row className="surface-card p-3 p-md-4 mb-4 g-3">
        <Col md={6}>
          <FormField
            labelClassName="fw-bold"
            label="Tìm kiếm sự kiện"
            name="searchTerm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nhập tên sự kiện..."
          />
        </Col>

        <Col md={6}>
          <FormField
            labelClassName="fw-bold"
            label="Danh mục"
            name="selectedCategory"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            options={categoryOptions}
          />
        </Col>
      </Row>

      <Row className="mb-5">
        {loading ? (
          <Col xs={12}>
            <LoadingState text="Đang tải sự kiện..." />
          </Col>
        ) : error ? (
          <Col xs={12}>
            <EmptyState description={`Lỗi: ${error}`} />
          </Col>
        ) : events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} md={6} lg={4} className="mb-4">
              <EventCard
                event={event}
                categoryName={getCategoryName(event.category)}
                categoryVariant={getCategoryColor(event.category)}
                detailsLabel="Xem chi tiết"
                ticketsLeftLabel="Vé còn lại"
                currencyLabel="đ"
                onViewDetails={handleViewDetails}
              />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <EmptyState description="Không tìm thấy sự kiện phù hợp" />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default EventPage;
