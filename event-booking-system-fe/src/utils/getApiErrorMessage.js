export const getApiErrorMessage = (err, fallback = 'Đã có lỗi xảy ra') => {
  const messageFromResponse =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message;

  if (typeof messageFromResponse === 'string' && messageFromResponse.trim()) {
    return messageFromResponse;
  }

  return fallback;
};

