import { useCallback, useEffect, useState } from "react";
import path from "../config/config";
import { getWithToken } from "../services/get";
import { useSelector } from "react-redux";

const FetchItemSales = () => {
  const token = useSelector((state) => state.auth.token);
  const [allItemssale, setItemsData] = useState([]);
  const Items = useCallback(async () => {
    const url = path.getSaleItems;
    const response = await getWithToken(url, token);
    console.log("response ==> ", response.data);
    try {
      setItemsData(response.data);
    } catch (error) {
      console.log("error ===> ", error);
    }
  }, [token]);

  useEffect(() => {
    Items();
  }, [Items]);

  return allItemssale;
};

export default FetchItemSales;
