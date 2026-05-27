import React, { useEffect, useMemo, useState } from 'react';
import { Form, InputGroup, Modal, ProgressBar } from 'react-bootstrap';
import { EmptyState, LoadingState } from '../../components';
import {
  TICKET_STATUS,
  TICKET_STATUS_OPTIONS,
  getTicketStatusDisplay,
} from '../../constants/statuses/ticketStatus';
import { EMPTY_EVENT_FILTERS } from '../../filters/eventFilter';
import { ticketFilters } from '../../filters/ticketFilter';
import { useOrganizerEvent } from '../../hooks/event/useOrganizerEvent';
import { useOrganizerTickets } from '../../hooks/ticket/useOrganizerTickets';
import { formatNumber } from '../../utils/formatCurrency';
import { formatTimestamp } from '../../utils/dateConvert';
import OrganizerLayout, { OrganizerStatCard } from './layouts/OrganizerLayout';

const TicketManagement = () => {
  const { events, loading: eventsLoading } = useOrganizerEvent(EMPTY_EVENT_FILTERS, {
    autoFetch: true,
  });
  const [selectedEventId, setSelectedEventId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const ticketQueryFilters = useMemo(
    () => ticketFilters.byEventId(selectedEventId),
    [selectedEventId]
  );

  const {
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
    fetchTickets,
  } = useOrganizerTickets(ticketQueryFilters, { autoFetch: Boolean(selectedEventId) });

  const firstEventId = events[0]?.id;

  useEffect(() => {
    if (selectedEventId || firstEventId == null) return;
    setSelectedEventId(String(firstEventId));
  }, [firstEventId, selectedEventId]);

  const selectedEvent = useMemo(
    () => events.find((event) => String(event.id) === String(selectedEventId)),
    [events, selectedEventId]
  );

  const filteredTickets = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesKeyword =
        !keyword ||
        [ticket.id, ticket.ticketCode, ticket.orderId, ticket.attendeeEmail, ticket.eventId]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      return matchesStatus && matchesKeyword;
    });
  }, [searchTerm, statusFilter, tickets]);

  const summary = useMemo(() => {
    const checkedInTickets = tickets.filter((ticket) => ticket.status === TICKET_STATUS.CHECKED_IN);
    const checkInRate =
      tickets.length > 0 ? Math.round((checkedInTickets.length / tickets.length) * 100) : 0;

    return {
      totalTickets: tickets.length,
      checkedInCount: checkedInTickets.length,
      pendingCheckIn: tickets.filter((ticket) => ticket.status === TICKET_STATUS.PAID).length,
      checkInRate,
    };
  }, [tickets]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  const isLoading = eventsLoading || (selectedEventId && ticketsLoading);

  return (
    <OrganizerLayout
      eyebrow="Quản lý"
      title="Vé"
      subtitle="Theo dõi vé theo từng sự kiện bạn quản lý."
      actions={
        <>
          <button type="button" className="organizer-btn-outline" onClick={resetFilters}>
            Xóa bộ lọc
          </button>
          <button
            type="button"
            className="organizer-btn-primary"
            disabled={!selectedEventId}
            onClick={() => fetchTickets()}
          >
            Tải lại
          </button>
        </>
      }
    >
      {ticketsError && (
        <div className="organizer-alert organizer-alert--danger organizer-alert--dismiss">
          <span>{ticketsError}</span>
        </div>
      )}

      <div className="organizer-stat-grid">
        <OrganizerStatCard
          label="Tổng vé"
          value={formatNumber(summary.totalTickets)}
          hint={selectedEvent ? selectedEvent.name : 'Chọn sự kiện'}
        />
        <OrganizerStatCard label="Đã check-in" value={formatNumber(summary.checkedInCount)} />
        <OrganizerStatCard
          label="Chưa check-in"
          value={formatNumber(summary.pendingCheckIn)}
          variant="gold"
        />
        <div className="organizer-stat-card organizer-stat-card--gold">
          <span className="organizer-stat-card__label">Tỷ lệ check-in</span>
          <strong className="organizer-stat-card__value">{summary.checkInRate}%</strong>
          <ProgressBar now={summary.checkInRate} className="mt-2" style={{ height: 4 }} />
          <p className="organizer-stat-card__hint">
            {selectedEvent ? `Sự kiện: ${selectedEvent.name}` : 'Chưa chọn sự kiện'}
          </p>
        </div>
      </div>

      <div className="organizer-filters">
        <div className="row g-3 align-items-end">
          <div className="col-lg-4">
            <Form.Label>Sự kiện *</Form.Label>
            <Form.Select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              disabled={eventsLoading || events.length === 0}
            >
              {events.length === 0 ? (
                <option value="">Chưa có sự kiện</option>
              ) : (
                events.map((event) => (
                  <option key={event.id} value={String(event.id)}>
                    {event.name}
                  </option>
                ))
              )}
            </Form.Select>
          </div>
          <div className="col-lg-4">
            <Form.Label>Tìm kiếm</Form.Label>
            <InputGroup>
              <InputGroup.Text>⌕</InputGroup.Text>
              <Form.Control
                value={searchTerm}
                placeholder="Mã vé, mã đơn, attendee..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-lg-4">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {TICKET_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState text="Đang tải danh sách vé..." />
      ) : !selectedEventId ? (
        <EmptyState
          title="Chưa chọn sự kiện"
          description="Tạo hoặc chọn một sự kiện để xem vé."
          className="py-5"
        />
      ) : (
        <div className="organizer-table-wrap">
          <table className="organizer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã vé</th>
                <th>Mã đơn</th>
                <th>Người tham dự</th>
                <th>Trạng thái</th>
                <th>Check-in</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="organizer-table__empty">
                    <EmptyState
                      title="Không tìm thấy vé"
                      description="Thử đổi từ khóa hoặc bộ lọc."
                      className="py-4"
                    />
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const statusMeta = getTicketStatusDisplay(ticket.status);
                  return (
                    <tr key={ticket.id}>
                      <td className="fw-bold">{ticket.id}</td>
                      <td>{ticket.ticketCode}</td>
                      <td>#{ticket.orderId}</td>
                      <td>{ticket.attendeeEmail}</td>
                      <td>
                        <span className={`organizer-status ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td>
                        {ticket.checkInTime
                          ? formatTimestamp(ticket.checkInTime)
                          : 'Chưa check-in'}
                      </td>
                      <td>
                        <div className="organizer-row-actions">
                          <button
                            type="button"
                            className="organizer-btn-sm organizer-btn-sm--gold"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            Chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        show={Boolean(selectedTicket)}
        onHide={() => setSelectedTicket(null)}
        centered
        size="lg"
        className="organizer-modal-root"
        dialogClassName="organizer-modal"
      >
        {selectedTicket && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Chi tiết vé #{selectedTicket.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="ticket-detail-block" style={{ background: 'var(--theme-ink-soft)', borderColor: 'var(--theme-border)' }}>
                <h3 style={{ color: 'var(--theme-accent-light)' }}>Thông tin vé</h3>
                <dl>
                  <dt>Sự kiện</dt>
                  <dd style={{ color: 'var(--theme-accent-light)' }}>{selectedEvent?.name || `#${selectedTicket.eventId}`}</dd>
                  <dt>Mã vé</dt>
                  <dd style={{ color: 'var(--theme-accent-light)' }}>{selectedTicket.ticketCode}</dd>
                  <dt>Mã đơn</dt>
                  <dd style={{ color: 'var(--theme-accent-light)' }}>#{selectedTicket.orderId}</dd>
                  <dt>Người tham dự</dt>
                  <dd style={{ color: 'var(--theme-accent-light)' }}>{selectedTicket.attendeeEmail}</dd>
                  <dt>Check-in</dt>
                  <dd style={{ color: 'var(--theme-accent-light)' }}>
                    {selectedTicket.checkInTime
                      ? formatTimestamp(selectedTicket.checkInTime)
                      : 'Chưa check-in'}
                  </dd>
                </dl>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <span className={`organizer-status ${getTicketStatusDisplay(selectedTicket.status).className} me-auto`}>
                {getTicketStatusDisplay(selectedTicket.status).label}
              </span>
              <button type="button" className="organizer-btn-outline" onClick={() => setSelectedTicket(null)}>
                Đóng
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </OrganizerLayout>
  );
};

export default TicketManagement;
