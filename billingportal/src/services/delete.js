import axios from "axios";

export const deleteWithoutToken = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


