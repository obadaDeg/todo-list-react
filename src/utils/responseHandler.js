export const handleResponse = async (
  operation,
  successMessage,
  errorMessage,
) => {
  try {
    await operation();
    return { status: "success", message: successMessage };
  } catch (error) {
    return {
      status: "error",
      message: error.message || errorMessage,
    };
  }
};
