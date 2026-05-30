export const removeEmptyValues = (obj = {}) => {
  if (obj == null || typeof obj !== 'object') return {};

  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    result[key] = value;
  }
  return result;
};

export const combineFilters = (...filters) => {
  return filters.reduce((acc, f) => ({ ...acc, ...(f || {}) }), {});
};

export const buildQuery = (filters = {}) => removeEmptyValues(filters);

