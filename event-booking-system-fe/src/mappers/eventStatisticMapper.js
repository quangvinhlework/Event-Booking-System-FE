export const mapEventStatisticResponse = (eventStatistic) => ({
  eventId: eventStatistic.eventId,
  totalTicketsSold: eventStatistic.totalTicketsSold,
  totalRevenue: eventStatistic.totalRevenue,
  totalViews: eventStatistic.totalViews,
  lastUpdated: eventStatistic.lastUpdated,
  createdAt: eventStatistic.createdAt,
  event: eventStatistic.event
    ? {
        id: eventStatistic.event.id,
        name: eventStatistic.event.name,
        description: eventStatistic.event.description,
      }
    : null,
});
