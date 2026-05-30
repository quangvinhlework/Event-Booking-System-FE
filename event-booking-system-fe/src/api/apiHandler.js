export const handleApi = async (apiCall) => {

  try {

    const response = await apiCall();

    return {
      success: true,
      message: response.data.message || "Success",
      data: response.data.data,
    };

  } catch (error) {
    let errorMessage = "Something went wrong";
    let status = null;

    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
      status = error.response.data.statusCode;
    } else if (error.request) {
      errorMessage = "Cannot connect to server";
    } else {
      errorMessage = error.message;
    }

    window.dispatchEvent(new CustomEvent('api_error', { detail: { message: errorMessage, status } }));

    return {
      success: false,
      status: status,
      message: errorMessage,
    };
  }
};