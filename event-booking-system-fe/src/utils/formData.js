export const buildEventFormData = (eventData) => {
  const formData = new FormData();

  Object.entries(eventData).forEach(([key, value]) => {

    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
      return;
    }

    formData.append(key, value);
  });

  return formData;
};