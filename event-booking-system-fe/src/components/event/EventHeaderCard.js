const EventHeaderCard = ({ event, isBestPrice }) => {
    return (
        <div 
            className="surface-panel h-100 position-relative p-3 text-start" 
            style={{ 
                borderRadius: '12px', 
                minHeight: '180px', 
                backgroundColor: 'var(--theme-surface-elevated)',
                borderColor: 'var(--theme-border)'
            }}
        >
            {isBestPrice && (
                <span 
                    className="position-absolute top-0 start-50 translate-middle badge rounded-pill px-3 py-1" 
                    style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        backgroundColor: 'var(--theme-accent-dim)', 
                        color: 'var(--theme-accent-light)', 
                        border: '1px solid var(--theme-accent)' 
                    }}
                >
                    ☆ GIÁ TỐT NHẤT
                </span>
            )}

            {/* Khung ảnh / Icon minh họa đại diện */}
            <div 
                className="d-flex align-items-center justify-content-center rounded-3 mb-3" 
                style={{ 
                    height: '100px', 
                    backgroundColor: 'var(--theme-ink)', 
                    border: '1px solid var(--theme-border)',
                    overflow: 'hidden'
                }}
            >
                {event.representative_image ? (
                    <img src={event.representative_image} alt={event.name} className="w-100 h-100 object-fit-cover rounded-3" />
                ) : (
                    <span className="fs-1" style={{ color: 'var(--theme-accent)' }}>🎵</span>
                )}
            </div>

            <h6 
                className="fw-bold text-truncate-2 mb-2" 
                style={{ 
                    minHeight: '44px', 
                    lineHeight: '1.4',
                    color: 'var(--theme-text)'
                }}
            >
                {event.name}
            </h6>

            <div className="d-flex align-items-center gap-2 mt-auto">
                {event.organizer?.avatar_url ? (
                    <img src={event.organizer.avatar_url} alt="avatar" className="rounded-circle" style={{ width: '28px', height: '28px', objectFit: 'cover' }} />
                ) : (
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" 
                        style={{ 
                            width: '28px', 
                            height: '28px', 
                            fontSize: '11px',
                            backgroundColor: 'var(--theme-accent-dim)',
                            color: 'var(--theme-accent-light)',
                            border: '1px solid var(--theme-accent)'
                        }}
                    >
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