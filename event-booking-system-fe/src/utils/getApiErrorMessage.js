export const getApiErrorMessage = (err, fallback = 'Đã có lỗi xảy ra') => {
  const responseData = err?.response?.data;
  const messageFromResponse = responseData?.message || responseData?.error || err?.message;

  if (typeof messageFromResponse === 'string' && messageFromResponse.trim()) {
    return messageFromResponse;
  }

  return fallback;
};

