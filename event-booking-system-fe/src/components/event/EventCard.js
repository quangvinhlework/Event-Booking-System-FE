import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { formatTimestamp } from '../../utils/dateConvert';

const EventCard = ({
  event,
  categoryName,
  categoryVariant = 'secondary',
  onViewDetails,
  detailsLabel = 'View details',
  ticketsLeftLabel = 'Tickets left',
  currencyLabel = 'VND',
}) => {
  const totalTickets = Number(event.totalTickets || 0);
  const availableTickets = Number(event.availableTickets || 0);
  const ticketPercent = totalTickets > 0 ? (availableTickets / totalTickets) * 100 : 0;
  const imageUrl =
    event.eventMedias?.find((media) => media.mediaType === 'IMAGE')?.mediaUrl ||
    event.eventMedias?.[0]?.mediaUrl ||
    event.image ||
    'https://via.placeholder.com/400x200?text=No+Image';

  const handleCardClick = () => {
    onViewDetails?.(event.id);
  };

  const handleButtonClick = (clickEvent) => {
    clickEvent.stopPropagation();
    onViewDetails?.(event.id);
  };

  return (
    <Card
      className="event-card h-100"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="event-card__image-wrap">
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={event.name || event.title}
          className="event-card__image"
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg={categoryVariant} className="event-card-badge">
            {categoryName || event.category}
          </Badge>
        </div>

        <Card.Title className="fw-bold text-truncate">
          {event.name || event.title}
        </Card.Title>

        <Card.Text className="event-card-description text-muted small">
          {event.description}
        </Card.Text>

        <div className="mb-3 text-muted small">
          <div className="mb-2">
            {formatTimestamp(event.startTime)} - {formatTimestamp(event.endTime)}
          </div>
          <div className="mb-2">{event.location}</div>
        </div>

        <div className="mb-3">
          <small className="text-muted d-block mb-1">
            {ticketsLeftLabel}: <strong>{availableTickets}</strong> / {totalTickets}
          </small>
          <div className="progress" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${ticketPercent}%` }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <h5 className="mb-0 text-danger fw-bold">
            {(event.price || event.ticketPrice || 0).toLocaleString('vi-VN')} {currencyLabel}
          </h5>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleButtonClick}
          >
            {detailsLabel}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
