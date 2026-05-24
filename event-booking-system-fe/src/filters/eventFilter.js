export const EVENT_FILTER_FIELDS = {
  name: 'name',
  cateId: 'cateId',
  page: 'page',
  status: 'status',
  startDate: 'startTime',
  endDate: 'endTime',
  location: 'location',
  fromPrice: 'fromPrice',
  toPrice: 'toPrice',
  sortBy: 'sortBy',
  sortDirection: 'sortDir',
};

const removeEmptyValues = (filters) => {
  return Object.entries(filters).reduce((query, [field, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[field] = value;
    }

    return query;
  }, {});
};

export const eventFilters = {
  byName: (name) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.name]: name,
    }),

  byCategory: (cateId) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.cateId]: cateId,
    }),

  byPage: (page) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.page]: page,
    }),

  byStatus: (status) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.status]: status,
    }),

  byDateRange: (startDate, endDate) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.startDate]: startDate,
      [EVENT_FILTER_FIELDS.endDate]: endDate,
    }),

  byLocation: (location) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.location]: location,
    }),

  byPriceRange: (fromPrice, toPrice) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.fromPrice]: fromPrice,
      [EVENT_FILTER_FIELDS.toPrice]: toPrice,
    }),

  bySort: (sortBy, sortDirection) =>
    removeEmptyValues({
      [EVENT_FILTER_FIELDS.sortBy]: sortBy,
      [EVENT_FILTER_FIELDS.sortDirection]: sortDirection,
    }),

  combine: (...filters) =>
    removeEmptyValues(
      filters.reduce((result, filter) => ({ ...result, ...filter }), {})
    ),
};

export const buildEventQuery = (filters = {}) => {
  return removeEmptyValues(filters);
};
