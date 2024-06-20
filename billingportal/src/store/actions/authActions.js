// authActions.js
import { LOGIN_SUCCESS, LOGOUT } from "./actionTypes";

export const loginSuccess = (id, token, role, userid) => ({
  type: LOGIN_SUCCESS,
  payload: { id, token, role, userid },
});

export const logout = () => ({
  type: LOGOUT,
});
