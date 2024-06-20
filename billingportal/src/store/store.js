import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer/root";
import {
  LoginMiddleware,
  LogoutMiddleware,
} from "./middleware/localStorageMiddleware";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginMiddleware, LogoutMiddleware),
});

export default store;
