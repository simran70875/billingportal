import { useCallback, useEffect, useState } from "react";
import path from "../config/config";
import { getWithToken } from "../services/get";
import { useSelector } from "react-redux";

const FetchClients = () => {
  const token = useSelector((state) => state.auth.token);
  const [clientData, setData] = useState([]);

  const Clients = useCallback(async () => {
    const url = path.getClients; // Assuming path.getClients is defined
    try {
      const res = await getWithToken(url, token);
      console.log("clients ===> ",res)
      if (res && res.success === true) {
        setData(res.data);
      } else {
        console.error("Invalid response or success flag is not true.");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, [token]);

  useEffect(() => {
    Clients();
  }, [Clients]);

  return { clientData, Clients };
};

export default FetchClients;
