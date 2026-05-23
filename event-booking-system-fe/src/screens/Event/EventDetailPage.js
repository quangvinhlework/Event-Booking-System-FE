import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, LoadingState } from '../../components';
import { useEvent } from '../../hooks/event/useEvent';
import { formatTimestamp } from '../../utils/dateConvert';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { event, loading, error } = useEvent(id);

  useEffect(() => {
    setSelectedMedia(event?.eventMedias?.[0] || null);
  }, [event]);

  const imageMedias = useMemo(
    () => event?.eventMedias?.filter((media) => media.mediaType === 'IMAGE') || [],
    [event]
  );

  const videoMedias = useMemo(
    () => event?.eventMedias?.filter((media) => media.mediaType === 'VIDEO') || [],
    [event]
  );

  const allMedias = useMemo(
    () => [...imageMedias, ...videoMedias],
    [imageMedias, videoMedias]
  );

  const mainMedia = selectedMedia || imageMedias[0] || event?.eventMedias?.[0];
  const totalTickets = Number(event?.totalTickets || 0);
  const availableTickets = Number(event?.availableTickets || 0);
  const soldTickets = Math.max(totalTickets - availableTickets, 0);
  const ticketPercent = totalTickets > 0 ? (availableTickets / totalTickets) * 100 : 0;
  const formattedPrice = Number(event?.ticketPrice || event?.price || 0).toLocaleString('vi-VN');

  const getStatusClass = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized.includes('onsale') || normalized.includes('open')) return 'lux-badge--success';
    if (normalized.includes('soldout')) return 'lux-badge--warning';
    if (normalized.includes('cancel') || normalized.includes('close')) return 'lux-badge--danger';
    return '';
  };

  if (loading) {
    return (
      <div className="lux-page event-detail-luxury">
        <Container>
          <div className="event-detail-luxury__loading">
            <LoadingState text="Đang tải chi tiết sự kiện..." />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="lux-page event-detail-luxury">
        <Container>
          <EmptyState description={error || 'Không tìm thấy sự kiện'} className="lux-empty" />
          <div className="text-center mt-3">
            <button type="button" className="lux-btn-back" onClick={() => navigate('/')}>
              ← Quay lại trang chủ
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="lux-page event-detail-luxury">
      <Container>
        <header className="event-detail-luxury__top">
          <nav className="event-detail-luxury__breadcrumb" aria-label="Đường dẫn">
            <button type="button" onClick={() => navigate('/')}>Trang chủ</button>
            <span>/</span>
            <span>Sự kiện</span>
            <span>/</span>
            <span aria-current="page">{event.name}</span>
          </nav>
          <button type="button" className="lux-btn-back" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Quay lại danh sách
          </button>
        </header>

        <div className="event-detail-luxury__layout">
          <div>
            <div className="event-detail-luxury__gallery lux-surface">
              {mainMedia?.mediaType === 'VIDEO' ? (
                <video
                  className="event-detail-luxury__main-media"
                  src={mainMedia.mediaUrl}
                  controls
                  poster={imageMedias[0]?.mediaUrl}
                />
              ) : (
                <img
                  className="event-detail-luxury__main-media"
                  src={mainMedia?.mediaUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'}
                  alt={event.name}
                />
              )}

              {allMedias.length > 1 && (
                <div className="event-detail-luxury__thumbs">
                  {allMedias.map((media, index) => (
                    <button
                      key={`${media.mediaUrl}-${index}`}
                      type="button"
                      className={`event-detail-luxury__thumb${
                        selectedMedia?.mediaUrl === media.mediaUrl ? ' is-active' : ''
                      }`}
                      onClick={() => setSelectedMedia(media)}
                      aria-label={`Xem media ${index + 1}`}
                    >
                      {media.mediaType === 'VIDEO' ? (
                        <span>Video</span>
                      ) : (
                        <img src={media.mediaUrl} alt="" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="event-detail-luxury__about lux-surface">
              <p className="lux-eyebrow">Thông tin chi tiết</p>
              <h2>Về sự kiện</h2>
              <p>{event.description || 'Sự kiện chưa có mô tả chi tiết.'}</p>

              <div className="event-detail-luxury__divider" />

              <div className="event-detail-luxury__highlights">
                <div className="event-detail-luxury__highlight">
                  <strong>{soldTickets}</strong>
                  <span>Vé đã bán</span>
                </div>
                <div className="event-detail-luxury__highlight">
                  <strong>{availableTickets}</strong>
                  <span>Vé còn lại</span>
                </div>
                <div className="event-detail-luxury__highlight">
                  <strong>{totalTickets}</strong>
                  <span>Tổng vé</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="event-detail-luxury__panel lux-surface">
            <div className="event-detail-luxury__badges">
              <span className="lux-badge">{event.category || 'Sự kiện'}</span>
              <span className={`lux-badge ${getStatusClass(event.status)}`}>
                {event.status || 'Đang cập nhật'}
              </span>
            </div>

            <h1 className="event-detail-luxury__title lux-display-title">{event.name}</h1>

            <p className="event-detail-luxury__location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
              {event.location || 'Đang cập nhật địa điểm'}
            </p>

            <div className="event-detail-luxury__stats">
              <div className="event-detail-luxury__stat">
                <span>Bắt đầu</span>
                <strong>{formatTimestamp(event.startTime) || '—'}</strong>
              </div>
              <div className="event-detail-luxury__stat">
                <span>Kết thúc</span>
                <strong>{formatTimestamp(event.endTime) || '—'}</strong>
              </div>
              <div className="event-detail-luxury__stat event-detail-luxury__stat--price">
                <span>Giá vé</span>
                <strong>{formattedPrice} đ</strong>
              </div>
              <div className="event-detail-luxury__stat">
                <span>Đã bán</span>
                <strong>{soldTickets} vé</strong>
              </div>
            </div>

            <div className="event-detail-luxury__tickets">
              <div className="event-detail-luxury__tickets-header">
                <span>Tình trạng vé</span>
                <strong>
                  {availableTickets} / {totalTickets}
                </strong>
              </div>
              <div className="event-detail-luxury__progress">
                <div
                  className="event-detail-luxury__progress-fill"
                  style={{ width: `${ticketPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              className="lux-btn-primary"
              disabled={availableTickets <= 0}
            >
              {availableTickets > 0 ? 'Đặt vé ngay' : 'Hết vé'}
            </button>

            <p className="event-detail-luxury__note">
              {availableTickets > 0
                ? 'Xác nhận đặt vé an toàn · Hỗ trợ khách hàng 24/7'
                : 'Sự kiện hiện đã hết vé. Vui lòng quay lại sau.'}
            </p>
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default EventDetailPage;
