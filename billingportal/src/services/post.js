import axios from "axios";

export const postsWithoutToken = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postsWithoutTokenAndData = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postWithToken = (url, token, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {
          bp_token_header_key: token,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
