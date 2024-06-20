import {
  setLocalStorageItem,
  removeLocalStorageItem,
} from "../utils/localStorageUtils";

export const LoginMiddleware = (store) => (next) => (action) => {
  if (action.type === "LOGIN_SUCCESS") {
    const { id, token, role, userid } = action.payload;
    setLocalStorageItem("isLoggedIn", true);
    setLocalStorageItem("id", id);
    setLocalStorageItem("token", token);
    setLocalStorageItem("role", role);
    setLocalStorageItem("userid", userid);
  }
  return next(action);
};

export const LogoutMiddleware = (store) => (next) => (action) => {
  if (action.type === "LOGOUT") {
    removeLocalStorageItem("isLoggedIn");
    removeLocalStorageItem("id");
    removeLocalStorageItem("token");
    removeLocalStorageItem("role");
    removeLocalStorageItem("userid");
  }
  return next(action);
};
