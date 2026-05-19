export const EVENT_STATISTIC_FILTER_FIELDS = {
  eventId: 'eventId',
  fromRevenue: 'fromRevenue',
  toRevenue: 'toRevenue',
  fromViews: 'fromViews',
  toViews: 'toViews',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

const removeEmptyValues = (filters) => {
  return Object.entries(filters).reduce((query, [field, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[field] = value;
    }

    return query;
  }, {});
};

export const eventStatisticFilters = {
  byEventId: (eventId) =>
    removeEmptyValues({
      [EVENT_STATISTIC_FILTER_FIELDS.eventId]: eventId,
    }),

  byRevenueRange: (fromRevenue, toRevenue) =>
    removeEmptyValues({
      [EVENT_STATISTIC_FILTER_FIELDS.fromRevenue]: fromRevenue,
      [EVENT_STATISTIC_FILTER_FIELDS.toRevenue]: toRevenue,
    }),

  byViewsRange: (fromViews, toViews) =>
    removeEmptyValues({
      [EVENT_STATISTIC_FILTER_FIELDS.fromViews]: fromViews,
      [EVENT_STATISTIC_FILTER_FIELDS.toViews]: toViews,
    }),

  byMonth: (month, year) =>
    removeEmptyValues({
      [EVENT_STATISTIC_FILTER_FIELDS.month]: month,
      [EVENT_STATISTIC_FILTER_FIELDS.year]: year,
    }),

  byQuarter: (quarter, year) =>
    removeEmptyValues({
      [EVENT_STATISTIC_FILTER_FIELDS.quarter]: quarter,
      [EVENT_STATISTIC_FILTER_FIELDS.year]: year,
    }),

  byYear: (year) =>
    removeEmptyValues({
      [EVENT_STATISTIC_FILTER_FIELDS.year]: year,
    }),

  combine: (...filters) =>
    removeEmptyValues(
      filters.reduce((result, filter) => ({ ...result, ...filter }), {})
    ),
};

export const buildEventStatisticQuery = (filters = {}) => {
  return removeEmptyValues(filters);
};
