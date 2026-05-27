import { TICKET_STATUS } from '../constants/statuses/ticketStatus';

export const deriveTicketStatus = (ticket) =>
  ticket?.checkInTime ? TICKET_STATUS.CHECKED_IN : TICKET_STATUS.PAID;

export const mapTicketResponse = (ticket) => ({
  id: ticket.id,
  orderId: ticket.orderId,
  eventId: ticket.eventId,
  attendeeEmail: ticket.attendeeEmail,
  ticketCode: ticket.ticketCode,
  checkInTime: ticket.checkInTime,
  status: deriveTicketStatus(ticket),
  isCheckedIn: Boolean(ticket.checkInTime),
});
