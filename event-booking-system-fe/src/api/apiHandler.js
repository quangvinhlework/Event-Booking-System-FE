export const handleApi = async (apiCall) => {

  try {

    const response = await apiCall();

    return {
      success: true,
      message: response.data.message || "Success",
      data: response.data.data,
    };

  } catch (error) {

    if (error.response) {

      return {
        success: false,
        status: error.response.data.statusCode,
        message:
          error.response.data.message ||
          "Something went wrong",
      };

    }

    if (error.request) {

      return {
        success: false,
        message: "Cannot connect to server",
      };

    }

    return {
      success: false,
      message: error.message,
    };
  }
};