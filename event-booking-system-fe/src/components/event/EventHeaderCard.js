const EventHeaderCard = ({ event, isBestPrice }) => {
    return (
        <div className="card h-100 border-0 shadow-sm position-relative p-3 text-start" style={{ borderRadius: '12px', minHeight: '180px' }}>
            {isBestPrice && (
                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-light text-primary border border-primary px-3 py-1" style={{ fontSize: '12px', fontWeight: '600' }}>
                    ☆ Giá tốt nhất
                </span>
            )}

            {/* Khung ảnh / Icon minh họa đại diện */}
            <div className="d-flex align-items-center justify-content-center bg-light rounded-3 mb-3 text-primary" style={{ height: '100px', backgroundColor: '#f0f2ff' }}>
                {event.representative_image ? (
                    <img src={event.representative_image} alt={event.name} className="w-100 h-100 object-fit-cover rounded-3" />
                ) : (
                    <i className="bi bi-music-note-beamed fs-1">🎵</i>
                )}
            </div>

            <h6 className="fw-bold text-dark text-truncate-2 mb-2" style={{ minHeight: '44px', lineHeight: '1.4' }}>
                {event.name}
            </h6>

            <div className="d-flex align-items-center gap-2 mt-auto">
                {event.organizer?.avatar_url ? (
                    <img src={event.organizer.avatar_url} alt="avatar" className="rounded-circle" style={{ width: '28px', height: '28px', objectFit: 'cover' }} />
                ) : (
                    <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                        {event.organizer?.full_name?.substring(0, 2) || 'TC'}
                    </div>
                )}
                <span className="text-muted small text-truncate" style={{ maxWidth: '150px' }}>
                    {event.organizer?.full_name}
                </span>
            </div>
        </div>
    );
};

export default EventHeaderCard;