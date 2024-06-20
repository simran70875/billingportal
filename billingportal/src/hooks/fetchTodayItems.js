import { useCallback, useEffect, useState } from "react";
import path from "../config/config";
import { getWithToken } from "../services/get";
import { useSelector } from "react-redux";
import moment from "moment";

const FetchTodayItems = () => {
  const token = useSelector((state) => state.auth.token);
  const [itemsTodayData, setItemsData] = useState([]);
  const Items = useCallback(async () => {
    const url = path.getTodayItems;
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

  return itemsTodayData;
};

export default FetchTodayItems;
