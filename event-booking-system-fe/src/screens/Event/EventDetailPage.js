import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, LoadingState } from '../../components';
import ChatBox from '../../components/chat/chatBox';
import { useEvent } from '../../hooks/event/useEvent';
import { useOrder } from '../../hooks/order/useOrder';
import { formatTimestamp } from '../../utils/dateConvert';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { event, loading, error } = useEvent(id);
  const [quantity, setQuantity] = useState(1);
  const { createOrder, loading: ordering, error: orderError } = useOrder(id);

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
    if (normalized.includes('onsale') || normalized.includes('open')) return 'badge-tag--success';
    if (normalized.includes('soldout')) return 'badge-tag--warning';
    if (normalized.includes('cancel') || normalized.includes('close')) return 'badge-tag--danger';
    return '';
  };

  const handleOrder = async () => {
    if (availableTickets <= 0 || ordering) return;

    try {
      await createOrder(quantity);
    } catch (err) {
      if (err.message === 'Vui lòng đăng nhập để đặt vé') {
        navigate('/login', { state: { from: `/event/${id}` } });
        return;
      }
      // Thông báo đơn giản, có thể thay bằng toast sau này
      // eslint-disable-next-line no-alert
      alert(err.message || 'Đặt vé thất bại');
    }
  };

  if (loading) {
    return (
      <div className="page-shell event-detail">
        <Container>
          <div className="event-detail__loading">
            <LoadingState text="Đang tải chi tiết sự kiện..." />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-shell event-detail">
        <Container>
          <EmptyState description={error || 'Không tìm thấy sự kiện'} className="empty-section" />
          <div className="text-center mt-3">
            <button type="button" className="btn-back" onClick={() => navigate('/')}>
              ← Quay lại trang chủ
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-shell event-detail">
      <Container>
        <header className="event-detail__top">
          <nav className="event-detail__breadcrumb" aria-label="Đường dẫn">
            <button type="button" onClick={() => navigate('/')}>Trang chủ</button>
            <span>/</span>
            <span>Sự kiện</span>
            <span>/</span>
            <span aria-current="page">{event.name}</span>
          </nav>
          <button type="button" className="btn-back" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Quay lại danh sách
          </button>
        </header>

        <div className="event-detail__layout">
          <div>
            <div className="event-detail__gallery surface-panel">
              {mainMedia?.mediaType === 'VIDEO' ? (
                <video
                  className="event-detail__main-media"
                  src={mainMedia.mediaUrl}
                  controls
                  poster={imageMedias[0]?.mediaUrl}
                />
              ) : (
                <img
                  className="event-detail__main-media"
                  src={mainMedia?.mediaUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'}
                  alt={event.name}
                />
              )}

              {allMedias.length > 1 && (
                <div className="event-detail__thumbs">
                  {allMedias.map((media, index) => (
                    <button
                      key={`${media.mediaUrl}-${index}`}
                      type="button"
                      className={`event-detail__thumb${
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

            <section className="event-detail__about surface-panel">
              <p className="page-eyebrow">Thông tin chi tiết</p>
              <h2>Về sự kiện</h2>
              <p>{event.description || 'Sự kiện chưa có mô tả chi tiết.'}</p>

              <div className="event-detail__divider" />

              <div className="event-detail__highlights">
                <div className="event-detail__highlight">
                  <strong>{soldTickets}</strong>
                  <span>Vé đã bán</span>
                </div>
                <div className="event-detail__highlight">
                  <strong>{availableTickets}</strong>
                  <span>Vé còn lại</span>
                </div>
                <div className="event-detail__highlight">
                  <strong>{totalTickets}</strong>
                  <span>Tổng vé</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="event-detail__panel surface-panel">
            <div className="event-detail__badges">
              <span className="badge-tag">{event.category || 'Sự kiện'}</span>
              <span className={`badge-tag ${getStatusClass(event.status)}`}>
                {event.status || 'Đang cập nhật'}
              </span>
            </div>

            <h1 className="event-detail__title page-title-lg">{event.name}</h1>

            <p className="event-detail__location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
              {event.location || 'Đang cập nhật địa điểm'}
            </p>

            <div className="event-detail__stats">
              <div className="event-detail__stat">
                <span>Bắt đầu</span>
                <strong>{formatTimestamp(event.startTime) || '—'}</strong>
              </div>
              <div className="event-detail__stat">
                <span>Kết thúc</span>
                <strong>{formatTimestamp(event.endTime) || '—'}</strong>
              </div>
              <div className="event-detail__stat event-detail__stat--price">
                <span>Giá vé</span>
                <strong>{formattedPrice} đ</strong>
              </div>
              <div className="event-detail__stat">
                <span>Đã bán</span>
                <strong>{soldTickets} vé</strong>
              </div>
            </div>

            <div className="event-detail__tickets">
              <div className="event-detail__tickets-header">
                <span>Tình trạng vé</span>
                <strong>
                  {availableTickets} / {totalTickets}
                </strong>
              </div>
              <div className="event-detail__progress">
                <div
                  className="event-detail__progress-fill"
                  style={{ width: `${ticketPercent}%` }}
                />
              </div>
            </div>

            <div className="event-detail__quantity">
              <div className="event-detail__quantity-header">
                <span>Số lượng vé</span>
                <strong>Tối đa: {availableTickets}</strong>
              </div>
              <div className="event-detail__quantity-control" role="group" aria-label="Chọn số lượng vé">
                <button
                  type="button"
                  className="event-detail__quantity-btn"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={ordering || quantity <= 1}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <input
                  className="event-detail__quantity-input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={availableTickets || 1}
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value) || 1;
                    const clamped = Math.max(1, Math.min(availableTickets || 1, value));
                    setQuantity(clamped);
                  }}
                  disabled={ordering || availableTickets <= 0}
                  aria-label="Số lượng vé"
                />
                <button
                  type="button"
                  className="event-detail__quantity-btn"
                  onClick={() => setQuantity((prev) => Math.min(availableTickets || 1, prev + 1))}
                  disabled={ordering || quantity >= (availableTickets || 1)}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            {orderError && (
              <p className="event-detail__error">
                {orderError}
              </p>
            )}

            <button
              type="button"
              className="btn-primary-accent"
              disabled={availableTickets <= 0 || ordering}
              onClick={handleOrder}
            >
              {availableTickets > 0 ? (ordering ? 'Đang xử lý...' : 'Đặt vé ngay') : 'Hết vé'}
            </button>

            <p className="event-detail__note">
              {availableTickets > 0
                ? 'Xác nhận đặt vé an toàn · Hỗ trợ khách hàng 24/7'
                : 'Sự kiện hiện đã hết vé. Vui lòng quay lại sau.'}
            </p>
          </aside>
        </div>
      </Container>

      {/* Chat widget — fixed bottom-right */}
      <ChatBox eventId={id} eventName={event.name} />
    </div>
  );
};

export default EventDetailPage;
