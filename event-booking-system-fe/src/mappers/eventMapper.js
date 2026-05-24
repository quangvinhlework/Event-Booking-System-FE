export const mapEventResponse = (event) => ({
  id: event.id,
  name: event.name,
  description: event.description,
  eventMedias: event.eventMedias?.map(media => ({
    mediaType: media.mediaType,
    mediaUrl: media.mediaUrl
  })) || [],
  startTime: event.startTime,
  endTime: event.endTime,
  location: event.location,
  totalTickets: event.totalTickets,
  ticketPrice: event.ticketPrice,
  availableTickets: event.availableTickets,
  status: event.status,
  category: event.category,
  views: event.views,
});