import { useEffect, useState } from "react";
import path from "../config/config";
import { getWithToken } from "../services/get";
import { useSelector } from "react-redux";

const FetchBills = () => {
  const token = useSelector((state) => state.auth.token);
  const [BillData, setBillData] = useState([]);

  const getBills = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const clientId = queryParams.get("clientId");
      const url = clientId
        ? `${path.getBills}?clientId=${clientId}`
        : path.getBills;
      const res = await getWithToken(url, token);
      console.log("bills ===> ", res);
      if (res && res.success === true) {
        const dataAfterFormattedDate = res.data.map((item) => ({
          ...item,
          createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
        }));
        setBillData(dataAfterFormattedDate);
      } else {
        // Handle unsuccessful response or undefined 'res'
        console.error("Failed to fetch bills:", res);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      // Handle fetch error
    }
  };

  useEffect(() => {
    getBills();
  }, [location.search]);

  return { BillData, getBills };
};

export default FetchBills;
