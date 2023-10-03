export const requestWithTokenRefresh = async (
  requestCallback: () => Promise<any>
) => {
  try {
    const response = await requestCallback();
    return response;
  } catch (error: any) {
    if (error.response && error.response.data.accessToken) {
      const newToken = error.response.data.accessToken;
      localStorage.setItem("accessToken", newToken);

      return requestCallback();
    } else {
      throw error;
    }
  }
};
