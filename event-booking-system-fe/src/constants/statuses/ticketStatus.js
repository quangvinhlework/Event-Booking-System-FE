export const TICKET_STATUS = {
  PAID: 'PAID',
  CHECKED_IN: 'CHECKED_IN',
};

export const TICKET_STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: TICKET_STATUS.PAID, label: 'Chưa check-in' },
  { value: TICKET_STATUS.CHECKED_IN, label: 'Đã check-in' },
];

export const TICKET_STATUS_DISPLAY = {
  [TICKET_STATUS.PAID]: {
    label: 'Chưa check-in',
    className: 'organizer-status--warning',
    badgeClassName: 'badge-tag--warning',
  },
  [TICKET_STATUS.CHECKED_IN]: {
    label: 'Đã check-in',
    className: 'organizer-status--success',
    badgeClassName: 'badge-tag--success',
  },
};

export const getTicketStatusLabel = (status) =>
  TICKET_STATUS_OPTIONS.find((option) => option.value === status)?.label || status;

export const getTicketStatusDisplay = (status) =>
  TICKET_STATUS_DISPLAY[status] || {
    label: getTicketStatusLabel(status),
    className: 'organizer-status--muted',
    badgeClassName: '',
  };
