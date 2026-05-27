import EVENT_EDITABLE_FIELDS from '../constants/policies/eventUpdatePolicy';
import { dateToTimestamp, timestampToDateForUpdateModal } from './dateConvert';

export const EMPTY_EVENT_FORM = {
  id: null,
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  location: '',
  totalTickets: '',
  ticketPrice: '',
  category: '',
  existingImageUrls: [],
  existingVideoUrls: [],
  newImages: [],
  newVideos: [],
  deletedMediaUrls: [],
};

export const getEditableFields = (status) => EVENT_EDITABLE_FIELDS[status] || [];

const getMediaUrls = (eventMedias, mediaType) =>
  eventMedias
    ?.filter((media) => media.mediaType === mediaType)
    .map((media) => media.mediaUrl) ?? [];

/** Chuyển event API → state hiển thị trên form (đủ mọi field). */
export const eventToFormState = (event) => ({
  id: event.id,
  name: event.name || '',
  description: event.description || '',
  startTime: timestampToDateForUpdateModal(event.startTime),
  endTime: timestampToDateForUpdateModal(event.endTime),
  location: event.location || '',
  totalTickets: event.totalTickets ?? '',
  ticketPrice: event.ticketPrice ?? '',
  category: event.category || '',
  existingImageUrls: getMediaUrls(event.eventMedias, 'IMAGE'),
  existingVideoUrls: getMediaUrls(event.eventMedias, 'VIDEO'),
  newImages: [],
  newVideos: [],
  deletedMediaUrls: [],
});

const toPayloadValue = (field, value) => {
  if (field === 'startTime' || field === 'endTime') {
    return value ? dateToTimestamp(value) : null;
  }
  if (field === 'totalTickets' || field === 'ticketPrice') {
    return value ? Number(value) : 0;
  }
  return value;
};

/** Chỉ lấy field được policy cho phép gửi lên API. */
export const formStateToUpdatePayload = (formState, status) => {
  const payload = { id: formState.id };

  getEditableFields(status).forEach((field) => {
    payload[field] = toPayloadValue(field, formState[field]);
  });

  return payload;
};
