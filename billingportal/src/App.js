import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from "./components/style/Global";
import { ThemeProvider } from "styled-components";
import { light } from "./components/style/Theme.styled";
import Login from "./screens/auth/login";
import Dashboard from "./screens/dashboard/dashboard";
import Items from "./screens/dashboard/handleItems/items";
import Clients from "./screens/dashboard/clients";
import Bills from "./screens/dashboard/handleBills/bills";
import Layout from "./screens/dashboard/layout";
import Operators from "./screens/dashboard/handleOpeator/operators";
import Sales from "./screens/dashboard/sales";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/actions/authActions";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SettingsScreen from "./screens/dashboard/settings";
import BillDetails from "./screens/dashboard/handleBills/billDetails";
import DecodeJWT from "./hooks/decodeJWT";

export default function App() {
  const dispatch = useDispatch();
  const decodeJWT = DecodeJWT();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const userid = localStorage.getItem("userid");
    if (token) {
      dispatch(loginSuccess(id, token, role, userid));
    }
    decodeJWT(token);
  }, [dispatch, decodeJWT]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  console.log(isLoggedIn, role);
  return (
    <ThemeProvider theme={light}>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />

        {isLoggedIn ? (
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="items" element={<Items />} />
            {role === "admin" || role === "superAdmin" ? (
              <Route path="operators" element={<Operators />} />
            ) : (
              <Route
                path="operators"
                element={<Navigate to="/dashboard" replace />}
              />
            )}
            <Route path="clients" element={<Clients />} />
            <Route path="bills" element={<Bills />} />
            <Route path="/bill-details/:id" element={<BillDetails />} />
            <Route path="sales" element={<Sales />} />
            <Route path="settings" element={<SettingsScreen />} />
          </Route>
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
      <ToastContainer />
    </ThemeProvider>
  );
}
