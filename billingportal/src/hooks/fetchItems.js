import { useCallback, useEffect, useState } from "react";
import path from "../config/config";
import { getWithToken } from "../services/get";
import { useSelector } from "react-redux";
import moment from "moment";

const FetchItems = () => {
  const token = useSelector((state) => state.auth.token);
  const [itemsData, setItemsData] = useState([]);
  const [updateStock, setUpdateStock] = useState([]);
  const [priceDiscount, setPriceDiscount] = useState([]);

  const Items = useCallback(async () => {
    const url = path.getItems;
    const response = await getWithToken(url, token);
    console.log("items ==> ", response.data)
    try {
      const dataWithFormatttedDate = response.data.map((item) => ({
        ...item,
        dateCreated: moment(item.dateCreated).format("DD-MM-YYYY"),
        dateUpdated: moment(item.dateUpdated).format("DD-MM-YYYY"),
      }));
      setItemsData(dataWithFormatttedDate);
      setUpdateStock(dataWithFormatttedDate);
      setPriceDiscount(dataWithFormatttedDate);
    } catch (error) {
      console.log("error ===> ", error);
    }
  }, [token]);

  useEffect(() => {
    Items();
  }, [Items]);

  return { itemsData, updateStock, priceDiscount, Items };
};

export default FetchItems;
