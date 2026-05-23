import React from 'react';
import { formatTimestamp } from '../../utils/dateConvert';

const LuxuryFeaturedEvent = ({ event, categoryName, onViewDetails }) => {
  if (!event) return null;

  const imageUrl =
    event.eventMedias?.find((media) => media.mediaType === 'IMAGE')?.mediaUrl ||
    event.eventMedias?.[0]?.mediaUrl ||
    event.image ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
  const price = Number(event.price || event.ticketPrice || 0).toLocaleString('vi-VN');
  const views = Number(event.views) || 0;

  return (
    <article className="luxury-spotlight">
      <div className="luxury-spotlight__visual">
        <img src={imageUrl} alt={event.name || event.title} />
        <div className="luxury-spotlight__visual-overlay" />
      </div>

      <div className="luxury-spotlight__content">
        <span className="luxury-spotlight__label">
          Sự kiện nổi bật{views > 0 ? ` · ${views.toLocaleString('vi-VN')} lượt xem` : ''}
        </span>
        {categoryName && <span className="luxury-spotlight__category">{categoryName}</span>}
        <h2 className="luxury-spotlight__title">{event.name || event.title}</h2>
        <p className="luxury-spotlight__desc">{event.description}</p>

        <div className="luxury-spotlight__details">
          <div>
            <small>Thời gian</small>
            <strong>{formatTimestamp(event.startTime)}</strong>
          </div>
          <div>
            <small>Địa điểm</small>
            <strong>{event.location}</strong>
          </div>
          <div>
            <small>Giá vé</small>
            <strong className="luxury-spotlight__price">{price} đ</strong>
          </div>
        </div>

        <button
          type="button"
          className="luxury-spotlight__btn"
          onClick={() => onViewDetails?.(event.id)}
        >
          Đặt vé ngay
        </button>
      </div>
    </article>
  );
};

export default LuxuryFeaturedEvent;
