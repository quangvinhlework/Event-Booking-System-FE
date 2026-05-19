export const mapEventStatisticResponse = (eventStatistic) => ({
  eventId: eventStatistic.eventId,
  totalTicketsSold: eventStatistic.totalTicketsSold,
  totalRevenue: eventStatistic.totalRevenue,
  totalViews: eventStatistic.totalViews,
  lastUpdated: eventStatistic.lastUpdated,
  createdAt: eventStatistic.createdAt,
});
