import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import path from "../config/config";
import { getWithToken } from "../services/get";

const TotalRevenue = () => {
  const token = useSelector((state) => state.auth.token);
  const [totalYearRevenue, setTotalYearRevenue] = useState();
  const getTotalRevenue = async () => {
    const url = path.getTotalRevenue;
    await getWithToken(url, token).then((res) => {
      console.log(res);
      setTotalYearRevenue(res.totalRevenue);
    });
  };
  useEffect(() => {
    getTotalRevenue();
  }, [getTotalRevenue]);
  
  return totalYearRevenue;
};

export default TotalRevenue;
