import { buildQuery, combineFilters, removeEmptyValues } from '../utils/queryFilter';

export const EVENT_STATISTIC_FILTER_FIELDS = {
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

export const eventStatisticFilters = {
  byMonth: (month) =>
    removeEmptyValues({ [EVENT_STATISTIC_FILTER_FIELDS.month]: month }),

  byQuarter: (quarter) =>
    removeEmptyValues({ [EVENT_STATISTIC_FILTER_FIELDS.quarter]: quarter }),

  byYear: (year) =>
    removeEmptyValues({ [EVENT_STATISTIC_FILTER_FIELDS.year]: year }),

  combine: combineFilters,
};

export const buildEventStatisticQuery = buildQuery;

