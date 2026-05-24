import React, { useMemo, useState } from 'react';
import { Form, InputGroup, Modal, ProgressBar } from 'react-bootstrap';
import EmptyState from '../../components/feedback/EmptyState';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import OrganizerLayout, { OrganizerStatCard } from './layouts/OrganizerLayout';

const initialTickets = [
  {
    id: 'TCK-24001',
    eventId: 'EVT-001',
    eventName: 'Đêm nhạc Acoustic Rooftop',
    buyerName: 'Nguyễn Văn An',
    buyerEmail: 'an.nguyen@example.com',
    buyerPhone: '0901 234 567',
    quantity: 2,
    unitPrice: 350000,
    status: 'PAID',
    paymentMethod: 'Ví điện tử',
    seatType: 'Standard',
    orderDate: '2026-05-12 19:34',
    checkedInAt: '',
    note: 'Khách cần xuất hóa đơn sau sự kiện.',
  },
  {
    id: 'TCK-24002',
    eventId: 'EVT-001',
    eventName: 'Đêm nhạc Acoustic Rooftop',
    buyerName: 'Trần Thị Bình',
    buyerEmail: 'binh.tran@example.com',
    buyerPhone: '0918 222 444',
    quantity: 1,
    unitPrice: 350000,
    status: 'CHECKED_IN',
    paymentMethod: 'Thẻ ngân hàng',
    seatType: 'VIP',
    orderDate: '2026-05-13 09:15',
    checkedInAt: '2026-05-20 18:47',
    note: '',
  },
  {
    id: 'TCK-24003',
    eventId: 'EVT-002',
    eventName: 'Workshop UI/UX cho Startup',
    buyerName: 'Lê Minh Quân',
    buyerEmail: 'quan.le@example.com',
    buyerPhone: '0933 876 111',
    quantity: 3,
    unitPrice: 180000,
    status: 'PENDING',
    paymentMethod: 'Chuyển khoản',
    seatType: 'Early Bird',
    orderDate: '2026-05-14 11:02',
    checkedInAt: '',
    note: 'Đang chờ đối soát chuyển khoản.',
  },
  {
    id: 'TCK-24004',
    eventId: 'EVT-003',
    eventName: 'Food Fair Cuối Tuần',
    buyerName: 'Phạm Gia Hân',
    buyerEmail: 'han.pham@example.com',
    buyerPhone: '0987 111 909',
    quantity: 4,
    unitPrice: 120000,
    status: 'CANCELLED',
    paymentMethod: 'Ví điện tử',
    seatType: 'Family',
    orderDate: '2026-05-10 16:20',
    checkedInAt: '',
    note: 'Khách yêu cầu hủy do đổi lịch cá nhân.',
  },
  {
    id: 'TCK-24005',
    eventId: 'EVT-004',
    eventName: 'Tech Meetup: AI Product',
    buyerName: 'Hoàng Hải Nam',
    buyerEmail: 'nam.hoang@example.com',
    buyerPhone: '0909 456 123',
    quantity: 1,
    unitPrice: 250000,
    status: 'REFUNDED',
    paymentMethod: 'Thẻ ngân hàng',
    seatType: 'Standard',
    orderDate: '2026-05-09 08:45',
    checkedInAt: '',
    note: 'Đã hoàn tiền theo chính sách hủy trước 48 giờ.',
  },
  {
    id: 'TCK-24006',
    eventId: 'EVT-004',
    eventName: 'Tech Meetup: AI Product',
    buyerName: 'Đỗ Khánh Linh',
    buyerEmail: 'linh.do@example.com',
    buyerPhone: '0922 776 889',
    quantity: 2,
    unitPrice: 250000,
    status: 'PAID',
    paymentMethod: 'Ví điện tử',
    seatType: 'Standard',
    orderDate: '2026-05-15 20:10',
    checkedInAt: '',
    note: '',
  },
];

const statusOptions = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'CHECKED_IN', label: 'Đã check-in' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

const statusConfig = {
  PAID: { label: 'Đã thanh toán', className: 'organizer-status--success' },
  PENDING: { label: 'Chờ thanh toán', className: 'organizer-status--warning' },
  CHECKED_IN: { label: 'Đã check-in', className: 'organizer-status--success' },
  CANCELLED: { label: 'Đã hủy', className: 'organizer-status--muted' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'organizer-status--muted' },
};

const getStatusMeta = (status) =>
  statusConfig[status] || { label: status, className: 'organizer-status--muted' };

const getTicketTotal = (ticket) => ticket.quantity * ticket.unitPrice;

const TicketManagement = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notice, setNotice] = useState('');

  const eventOptions = useMemo(() => {
    const uniqueEvents = Array.from(
      new Map(tickets.map((ticket) => [ticket.eventId, ticket.eventName])).entries()
    );
    return [
      { value: 'ALL', label: 'Tất cả sự kiện' },
      ...uniqueEvents.map(([value, label]) => ({ value, label })),
    ];
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
      const matchesEvent = eventFilter === 'ALL' || ticket.eventId === eventFilter;
      const matchesKeyword =
        !keyword ||
        [ticket.id, ticket.eventName, ticket.buyerName, ticket.buyerEmail, ticket.buyerPhone]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      return matchesStatus && matchesEvent && matchesKeyword;
    });
  }, [eventFilter, searchTerm, statusFilter, tickets]);

  const summary = useMemo(() => {
    const activeTickets = tickets.filter((ticket) => ticket.status !== 'CANCELLED');
    const paidTickets = tickets.filter((ticket) => ['PAID', 'CHECKED_IN'].includes(ticket.status));
    const checkedInTickets = tickets.filter((ticket) => ticket.status === 'CHECKED_IN');
    const revenue = paidTickets.reduce((total, ticket) => total + getTicketTotal(ticket), 0);
    const soldQuantity = paidTickets.reduce((total, ticket) => total + ticket.quantity, 0);
    const checkInQuantity = checkedInTickets.reduce((total, ticket) => total + ticket.quantity, 0);
    const checkInRate = soldQuantity > 0 ? Math.round((checkInQuantity / soldQuantity) * 100) : 0;

    return {
      activeOrders: activeTickets.length,
      soldQuantity,
      revenue,
      pendingOrders: tickets.filter((ticket) => ticket.status === 'PENDING').length,
      checkInRate,
    };
  }, [tickets]);

  const updateTicketStatus = (ticketId, nextStatus, successMessage) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket
      )
    );
    setSelectedTicket((currentTicket) =>
      currentTicket?.id === ticketId ? { ...currentTicket, status: nextStatus } : currentTicket
    );
    setNotice(successMessage);
  };

  const handleCancelTicket = (ticketId) => {
    updateTicketStatus(ticketId, 'CANCELLED', `Đã hủy vé ${ticketId} trên dữ liệu mock.`);
  };

  const handleMarkPaid = (ticketId) => {
    updateTicketStatus(ticketId, 'PAID', `Đã xác nhận thanh toán cho vé ${ticketId}.`);
  };

  const handleCheckIn = (ticketId) => {
    updateTicketStatus(ticketId, 'CHECKED_IN', `Đã check-in vé ${ticketId}.`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setEventFilter('ALL');
  };

  return (
    <OrganizerLayout
      eyebrow="Quản lý"
      title="Vé"
      subtitle="Theo dõi đơn vé, thanh toán, check-in và hỗ trợ khách (dữ liệu mock)."
      actions={
        <>
          <button type="button" className="organizer-btn-outline" onClick={resetFilters}>
            Xóa bộ lọc
          </button>
          <button
            type="button"
            className="organizer-btn-primary"
            onClick={() => setNotice('Tính năng xuất file sẽ được gắn API sau.')}
          >
            Xuất danh sách
          </button>
        </>
      }
    >
      {notice && (
        <div className="organizer-alert organizer-alert--success organizer-alert--dismiss">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Đóng">
            ×
          </button>
        </div>
      )}

      <div className="organizer-stat-grid">
        <OrganizerStatCard
          label="Đơn hợp lệ"
          value={formatNumber(summary.activeOrders)}
          hint="Không tính đơn đã hủy"
        />
        <OrganizerStatCard label="Vé đã bán" value={formatNumber(summary.soldQuantity)} />
        <OrganizerStatCard
          label="Doanh thu tạm tính"
          value={formatCurrency(summary.revenue)}
          variant="gold"
        />
        <div className="organizer-stat-card organizer-stat-card--gold">
          <span className="organizer-stat-card__label">Tỷ lệ check-in</span>
          <strong className="organizer-stat-card__value">{summary.checkInRate}%</strong>
          <ProgressBar now={summary.checkInRate} className="mt-2" style={{ height: 4 }} />
          <p className="organizer-stat-card__hint">{summary.pendingOrders} đơn chờ thanh toán</p>
        </div>
      </div>

      <div className="organizer-filters">
        <div className="row g-3 align-items-end">
          <div className="col-lg-5">
            <Form.Label>Tìm kiếm</Form.Label>
            <InputGroup>
              <InputGroup.Text>⌕</InputGroup.Text>
              <Form.Control
                value={searchTerm}
                placeholder="Mã vé, tên, email, SĐT..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-md-6 col-lg-3">
            <Form.Label>Sự kiện</Form.Label>
            <Form.Select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
              {eventOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-6 col-lg-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </div>

      <div className="organizer-table-wrap">
        <table className="organizer-table">
          <thead>
            <tr>
              <th>Mã vé</th>
              <th>Sự kiện</th>
              <th>Người mua</th>
              <th>Loại vé</th>
              <th>SL</th>
              <th>Thành tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="organizer-table__empty">
                  <EmptyState
                    title="Không tìm thấy vé"
                    description="Thử đổi từ khóa hoặc bộ lọc."
                    className="py-4"
                  />
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => {
                const statusMeta = getStatusMeta(ticket.status);
                return (
                  <tr key={ticket.id}>
                    <td className="fw-bold">{ticket.id}</td>
                    <td>
                      <div className="fw-semibold">{ticket.eventName}</div>
                      <small style={{ color: 'var(--theme-muted)' }}>{ticket.eventId}</small>
                    </td>
                    <td>
                      <div className="fw-semibold">{ticket.buyerName}</div>
                      <small style={{ color: 'var(--theme-muted)' }}>{ticket.buyerEmail}</small>
                    </td>
                    <td>{ticket.seatType}</td>
                    <td>{formatNumber(ticket.quantity)}</td>
                    <td className="fw-semibold">{formatCurrency(getTicketTotal(ticket))}</td>
                    <td>
                      <span className={`organizer-status ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td>{ticket.orderDate}</td>
                    <td>
                      <div className="organizer-row-actions">
                        <button
                          type="button"
                          className="organizer-btn-sm organizer-btn-sm--gold"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Chi tiết
                        </button>
                        {ticket.status === 'PENDING' && (
                          <button
                            type="button"
                            className="organizer-btn-sm organizer-btn-sm--success"
                            onClick={() => handleMarkPaid(ticket.id)}
                          >
                            Xác nhận
                          </button>
                        )}
                        {ticket.status === 'PAID' && (
                          <button
                            type="button"
                            className="organizer-btn-sm organizer-btn-sm--gold"
                            onClick={() => handleCheckIn(ticket.id)}
                          >
                            Check-in
                          </button>
                        )}
                        {!['CANCELLED', 'REFUNDED', 'CHECKED_IN'].includes(ticket.status) && (
                          <button
                            type="button"
                            className="organizer-btn-sm organizer-btn-sm--danger"
                            onClick={() => handleCancelTicket(ticket.id)}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
              <Modal.Title>Chi tiết vé {selectedTicket.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row g-4">
                <div className="col-md-7">
                  <div className="ticket-detail-block" style={{ background: 'var(--theme-ink-soft)', borderColor: 'var(--theme-border)' }}>
                    <h3 style={{ color: 'var(--theme-accent-light)' }}>Thông tin đơn</h3>
                    <dl>
                      <dt>Sự kiện</dt>
                      <dd>{selectedTicket.eventName}</dd>
                      <dt>Loại vé</dt>
                      <dd>{selectedTicket.seatType}</dd>
                      <dt>Số lượng</dt>
                      <dd>{formatNumber(selectedTicket.quantity)}</dd>
                      <dt>Thành tiền</dt>
                      <dd className="fw-bold">{formatCurrency(getTicketTotal(selectedTicket))}</dd>
                      <dt>Thanh toán</dt>
                      <dd>{selectedTicket.paymentMethod}</dd>
                    </dl>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="ticket-detail-block" style={{ background: 'var(--theme-ink-soft)', borderColor: 'var(--theme-border)' }}>
                    <h3 style={{ color: 'var(--theme-accent-light)' }}>Người mua</h3>
                    <dl>
                      <dt>Họ tên</dt>
                      <dd>{selectedTicket.buyerName}</dd>
                      <dt>Email</dt>
                      <dd>{selectedTicket.buyerEmail}</dd>
                      <dt>SĐT</dt>
                      <dd>{selectedTicket.buyerPhone}</dd>
                      <dt>Check-in</dt>
                      <dd>{selectedTicket.checkedInAt || 'Chưa check-in'}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              {selectedTicket.note && (
                <div className="ticket-note mt-4" style={{ background: 'var(--theme-ink-soft)', borderColor: 'var(--theme-border)' }}>
                  <span>Ghi chú</span>
                  <p style={{ color: 'var(--theme-text)' }}>{selectedTicket.note}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <span className={`organizer-status ${getStatusMeta(selectedTicket.status).className} me-auto`}>
                {getStatusMeta(selectedTicket.status).label}
              </span>
              <button type="button" className="organizer-btn-outline" onClick={() => setSelectedTicket(null)}>
                Đóng
              </button>
              {selectedTicket.status === 'PENDING' && (
                <button type="button" className="organizer-btn-primary" onClick={() => handleMarkPaid(selectedTicket.id)}>
                  Xác nhận thanh toán
                </button>
              )}
              {selectedTicket.status === 'PAID' && (
                <button type="button" className="organizer-btn-primary" onClick={() => handleCheckIn(selectedTicket.id)}>
                  Check-in
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </OrganizerLayout>
  );
};

export default TicketManagement;
