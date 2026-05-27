export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  ONSALE: 'ONSALE',
  CANCELLED: 'CANCELLED',
  ENDED: 'ENDED',
};

export const EVENT_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: EVENT_STATUS.DRAFT, label: 'Bản nháp' },
  { value: EVENT_STATUS.ONSALE, label: 'Đang bán' },
  { value: EVENT_STATUS.CANCELLED, label: 'Đã hủy' },
  { value: EVENT_STATUS.ENDED, label: 'Kết thúc'}
];

export const getEventStatusLabel = (status) =>
  EVENT_STATUS_OPTIONS.find((option) => option.value === status)?.label || status;