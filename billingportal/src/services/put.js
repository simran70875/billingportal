import axios from "axios";

export const putWithoutToken = (url,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url,data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
