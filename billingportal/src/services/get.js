import axios from "axios";

export const getWithToken = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        bp_token_header_key: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getWithToken:", error);
    throw error;
  }
};

export const getWithoutToken = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
