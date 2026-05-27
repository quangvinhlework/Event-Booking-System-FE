export const removeEmptyValues = (obj = {}) => {
  if (obj == null || typeof obj !== 'object') return {};

  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    })
  );
};

export const combineFilters = (...filters) => {
  return filters.reduce((acc, f) => ({ ...acc, ...(f || {}) }), {});
};

export const buildQuery = (filters = {}) => removeEmptyValues(filters);

