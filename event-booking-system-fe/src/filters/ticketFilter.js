import { buildQuery, combineFilters, removeEmptyValues } from '../utils/queryFilter';

export const EMPTY_TICKET_FILTERS = Object.freeze({});

export const TICKET_FILTER_FIELDS = {
  eventId: 'eventId',
  orderId: 'orderId',
  ticketCode: 'ticketCode',
  attendeeId: 'attendeeId',
};

export const ticketFilters = {
  byEventId: (eventId) =>
    removeEmptyValues({ [TICKET_FILTER_FIELDS.eventId]: eventId }),

  byOrderId: (orderId) =>
    removeEmptyValues({ [TICKET_FILTER_FIELDS.orderId]: orderId }),

  byTicketCode: (ticketCode) =>
    removeEmptyValues({ [TICKET_FILTER_FIELDS.ticketCode]: ticketCode }),

  byAttendeeId: (attendeeId) =>
    removeEmptyValues({ [TICKET_FILTER_FIELDS.attendeeId]: attendeeId }),

  combine: combineFilters,
};

export const buildTicketQuery = buildQuery;

export const buildOrganizerTicketQuery = (filters = {}) => {
  const query = buildTicketQuery(filters);

  if (!query[TICKET_FILTER_FIELDS.eventId]) {
    return null;
  }
  return query;
};

