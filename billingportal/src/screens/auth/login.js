import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import imagesPath from "../../components/other/imagePaths";
import "../../components/style/style.css";
import { postsWithoutToken } from "../../services/post";
import path from "../../config/config";
import { loginSuccess } from "../../store/actions/authActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userid: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({
      userid: "",
      password: "",
    });
  };

  const handleLogin = async () => {
    const url = path.login;
    console.log("i am in handle login", url);
    const response = await postsWithoutToken(url, formData);

    try {
      if (response.success) {
        console.log("response true ====>", response);
        const { _id, role, userid } = response.data.adminOrOperator;
        const { token } = response.data;
        console.log("token =>", token);
        dispatch(loginSuccess(_id, token, role, userid));
        navigate("/");
      } else {
        if (response.errors && Array.isArray(response.errors)) {
          const newErrors = {};
          response.errors.forEach((error) => {
            newErrors[error.path] = error.msg;
          });
          setErrors(newErrors);
        } else {
          setErrors({
            userid: response.message.includes("User not found")
              ? response.message
              : "",
            password: response.message.includes("Invalid Password")
              ? response.message
              : "",
          });
        }
      }
    } catch (error) {
      console.error("Error===>", error);
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{ background: "#a4e7f0", height: "100vh" }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div
          className="logincard  shadow"
          style={{
            position: "relative",
            zIndex: "2",
            WebkitBoxReflect:
              "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4))",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-end"
            style={{
              position: "absolute",
              height: "120%",
              width: "130%",
              left: "0",
              top: "0",
              zIndex: 0,
            }}
          >
            <img
              width={"100%"}
              height={"100%"}
              alt="blog"
              src={imagesPath.bglogin}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            className="p-lg-3 p-3 shadow"
            style={{
              background: "#fff",
              position: "relative",
              zIndex: "5",
              borderRadius: 5,
              border: "2px solid #e0fbff",
            }}
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <img width={"40px"} alt="logo" src={imagesPath.logo} />
              <h1>Logo</h1>
            </div>
            <div className="mb-2">
              <Form.Label htmlFor="userid">Login id</Form.Label>
              <Form.Control
                type="text"
                id="userid"
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                required
              />
              {errors.userid && (
                <div className="text-danger">{errors.userid}</div>
              )}
            </div>

            <div className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>
            <div className="mb-1">
              <Button
                onClick={() => handleLogin()}
                variant="primary"
                style={{ background: "#3faebc" }}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
