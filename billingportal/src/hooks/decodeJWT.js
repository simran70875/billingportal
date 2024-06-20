import { useCallback } from "react";
import Logout from "./logout";

const DecodeJWT = () => {
  const handleLogout = Logout();
  const decodeJWT = useCallback((token) => {
      try {
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const expTime = new Date(decodedToken.exp * 1000).toLocaleTimeString();
          const currentTime = new Date().toLocaleTimeString();
          console.log("Decoded exp token:", expTime);
          if (currentTime > expTime) {
            handleLogout();
          }
        } else {
          console.log("token not available");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    },
    [handleLogout]
  );
  return decodeJWT;
};

export default DecodeJWT;
