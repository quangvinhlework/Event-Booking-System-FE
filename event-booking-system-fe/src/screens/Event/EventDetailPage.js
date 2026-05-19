import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, LoadingState } from '../../components';
import { useEvent } from '../../hooks/event/useEvent';
import { formatTimestamp } from '../../utils/dateConvert';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { event, loading, error, getEventById } = useEvent(undefined, undefined, {
    autoFetch: false,
  });

  useEffect(() => {
    if (id) {
      getEventById(id);
    }
  }, [id, getEventById]);

  useEffect(() => {
    setSelectedMedia(event?.eventMedias?.[0] || null);
  }, [event]);

  const imageMedias = useMemo(() => {
    return event?.eventMedias?.filter((media) => media.mediaType === 'IMAGE') || [];
  }, [event]);

  const videoMedias = useMemo(() => {
    return event?.eventMedias?.filter((media) => media.mediaType === 'VIDEO') || [];
  }, [event]);

  const mainMedia = selectedMedia || imageMedias[0] || event?.eventMedias?.[0];
  const totalTickets = Number(event?.totalTickets || 0);
  const availableTickets = Number(event?.availableTickets || 0);
  const soldTickets = Math.max(totalTickets - availableTickets, 0);
  const ticketPercent = totalTickets > 0 ? (availableTickets / totalTickets) * 100 : 0;
  const formattedPrice = Number(event?.ticketPrice || 0).toLocaleString('vi-VN');

  const getStatusVariant = (status) => {
    const normalizedStatus = String(status || '').toLowerCase();

    if (normalizedStatus.includes('ONSALE') || normalizedStatus.includes('open')) {
      return 'success';
    }

    if (normalizedStatus.includes('SOLDOUT')) {
      return 'warning';
    }

    if (normalizedStatus.includes('CANCLLED') || normalizedStatus.includes('close')) {
      return 'danger';
    }

    return 'secondary';
  };

  if (loading) {
    return (
      <Container className="app-page">
        <LoadingState text="Đang tải chi tiết sự kiện..." />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container className="app-page">
        <EmptyState description={error || 'Không tìm thấy sự kiện'} />
        <Button className="mt-3" variant="outline-primary" onClick={() => navigate('/events')}>
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  return (
    <Container className="app-page event-detail-page">
      <Button
        className="mb-4"
        variant="outline-primary"
        onClick={() => navigate('/events')}
      >
        Quay lại danh sách
      </Button>

      <Row className="g-4 align-items-start">
        <Col lg={7}>
          <div className="event-detail-media">
            {mainMedia?.mediaType === 'VIDEO' ? (
              <video className="event-detail-main-media" src={mainMedia.mediaUrl} controls />
            ) : (
              <Image
                className="event-detail-main-media"
                src={mainMedia?.mediaUrl || 'https://via.placeholder.com/900x520?text=No+Image'}
                alt={event.name}
              />
            )}
          </div>

          {(imageMedias.length > 1 || videoMedias.length > 0) && (
            <div className="event-detail-thumbnails">
              {[...imageMedias, ...videoMedias].map((media, index) => (
                <button
                  key={`${media.mediaUrl}-${index}`}
                  type="button"
                  className={`event-detail-thumbnail ${
                    selectedMedia?.mediaUrl === media.mediaUrl ? 'active' : ''
                  }`}
                  onClick={() => setSelectedMedia(media)}
                  aria-label={`Xem media ${index + 1}`}
                >
                  {media.mediaType === 'VIDEO' ? (
                    <span>Video</span>
                  ) : (
                    <img src={media.mediaUrl} alt={`${event.name} ${index + 1}`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </Col>

        <Col lg={5}>
          <div className="surface-card event-detail-summary">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Badge bg="primary" className="event-card-badge">
                {event.category || 'Sự kiện'}
              </Badge>
              <Badge bg={getStatusVariant(event.status)} className="event-card-badge">
                {event.status || 'Đang cập nhật'}
              </Badge>
            </div>

            <h1 className="event-detail-title">{event.name}</h1>
            <p className="event-detail-location">{event.location || 'Đang cập nhật địa điểm'}</p>

            <div className="event-detail-info-grid">
              <div>
                <span>Bắt đầu</span>
                <strong>{formatTimestamp(event.startTime) || 'Đang cập nhật'}</strong>
              </div>
              <div>
                <span>Kết thúc</span>
                <strong>{formatTimestamp(event.endTime) || 'Đang cập nhật'}</strong>
              </div>
              <div>
                <span>Giá vé</span>
                <strong className="text-danger">{formattedPrice} đ</strong>
              </div>
              <div>
                <span>Đã bán</span>
                <strong>{soldTickets} vé</strong>
              </div>
            </div>

            <div className="event-detail-ticket-box">
              <div className="d-flex justify-content-between mb-2">
                <span>Vé còn lại</span>
                <strong>
                  {availableTickets} / {totalTickets}
                </strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${ticketPercent}%` }}
                />
              </div>
            </div>

            <Button
              className="w-100"
              size="lg"
              disabled={availableTickets <= 0}
            >
              {availableTickets > 0 ? 'Đặt vé ngay' : 'Hết vé'}
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={8}>
          <section className="surface-card event-detail-description">
            <div className="section-eyebrow">Thông tin</div>
            <h2 className="section-title">Mô tả sự kiện</h2>
            <p>{event.description || 'Sự kiện chưa có mô tả.'}</p>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetailPage;
