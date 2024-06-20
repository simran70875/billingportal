import { logout } from "../store/actions/authActions";
import { useDispatch } from "react-redux";
import { postsWithoutTokenAndData } from "../services/post";
import path from "../config/config";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    const response = postsWithoutTokenAndData(path.logout);
    try {
      if (response) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return handleLogout;
};

export default Logout;
