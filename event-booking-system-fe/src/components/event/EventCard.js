import React from 'react';
import { formatTimestamp } from '../../utils/dateConvert';

const EventCard = ({
  event,
  categoryName,
  onViewDetails,
  index = 0,
}) => {
  const totalTickets = Number(event.totalTickets || 0);
  const availableTickets = Number(event.availableTickets || 0);
  const ticketPercent = totalTickets > 0 ? (availableTickets / totalTickets) * 100 : 0;
  const imageUrl =
    event.eventMedias?.find((media) => media.mediaType === 'IMAGE')?.mediaUrl ||
    event.eventMedias?.[0]?.mediaUrl ||
    event.image ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';
  const price = Number(event.price || event.ticketPrice || 0).toLocaleString('vi-VN');

  const handleOpen = () => onViewDetails?.(event.id);

  return (
    <article
      className="event-card"
      style={{ animationDelay: `${Math.min(index, 10) * 70}ms` }}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      <div className="event-card__media">
        <img src={imageUrl} alt={event.name || event.title} loading="lazy" />
        <div className="event-card__overlay" />
        {categoryName && <span className="event-card__tag">{categoryName}</span>}
      </div>

      <div className="event-card__body">
        <h3 className="event-card__title">{event.name || event.title}</h3>
        <p className="event-card__desc">{event.description}</p>

        <ul className="event-card__meta">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formatTimestamp(event.startTime)}
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
            <span>{event.location}</span>
          </li>
        </ul>

        <div className="event-card__availability">
          <span>
            Vé còn <strong>{availableTickets}</strong> / {totalTickets}
          </span>
          <div className="event-card__bar">
            <div className="event-card__bar-fill" style={{ width: `${ticketPercent}%` }} />
          </div>
        </div>

        <div className="event-card__footer">
          <div className="event-card__price">
            <small>Từ</small>
            <span>{price} đ</span>
          </div>
          <span className="event-card__cta" aria-hidden="true">
            Chi tiết
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
