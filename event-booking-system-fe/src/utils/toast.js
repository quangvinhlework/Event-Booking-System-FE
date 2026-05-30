export const showErrorToast = (message) => {
  window.dispatchEvent(new CustomEvent('api_error', { detail: { message } }));
};

export const showSuccessToast = (message) => {
  window.dispatchEvent(new CustomEvent('api_success', { detail: { message } }));
};
