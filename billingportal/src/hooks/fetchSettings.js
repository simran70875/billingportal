import { useCallback, useEffect, useState } from "react";
import path from "../config/config";
import { getWithToken } from "../services/get";
import { useSelector } from "react-redux";

const FetchSettings = () => {
  const token = useSelector((state) => state.auth.token);
  const [adminSettings, setAdminSettings] = useState();
  const [userSettings, setUserSettings] = useState();
  const Settings = useCallback(async () => {
    const url = path.showSettings;
    await getWithToken(url, token)
      .then((res) => {
        console.log("settings ===> ", res);
        setAdminSettings(res.data.adminSettings);
        setUserSettings(res.data.userSettings);
      })
      .catch((error) => {
        console.log("error ==> ", error);
      });
  }, [token]);

  useEffect(() => {
    Settings();
  }, [Settings]);

  return { adminSettings, userSettings, Settings };
};

export default FetchSettings;
