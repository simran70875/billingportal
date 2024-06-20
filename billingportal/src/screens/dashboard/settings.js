import React, { useEffect, useState } from "react";
import { BiSolidSave } from "react-icons/bi";
import { Link } from "react-router-dom";
import path from "../../config/config";
import { useSelector } from "react-redux";
import { postWithToken } from "../../services/post";
import { toast } from "react-toastify";
import FetchSettings from "../../hooks/fetchSettings";

const SettingsScreen = () => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const { userSettings, Settings } = FetchSettings();

  const [activeTab, setActiveTab] = useState("setTax");
  const styles = {
    container: {
      padding: 30,
    },
    tabsContainer: {
      display: "flex",
      marginBottom: 20,
    },
    tab: {
      padding: "10px 20px",
      cursor: "pointer",
      marginRight: 10,
      borderBottom: "2px solid transparent",
      backgroundColor: "#f8f9fa", // Light grey background
    },
    active: {
      borderBottom: "2px solid #007bff",
      color: "#007bff",
      backgroundColor: "aliceblue", // Active background color
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      marginRight: 10,
    },
    input: {
      width: "300px",
      padding: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "5px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
    taxDisplay: {
      marginTop: 20,
      border: "2px solid #007bff",
      borderRadius: "5px",
      padding: "10px",
      textAlign: "center",
      width: 400,
    },
    taxLabel: {
      marginBottom: 15,
      fontWeight: "bold",
    },
    taxAmount: {
      fontSize: 18,
      fontWeight: "bold",
    },
  };

  useEffect(() => {
    if (userSettings) {
      setTaxPercentage(userSettings.tax);
      setShopName(userSettings.shopName);
      setPhone(userSettings.phone);
      setAddress(userSettings.address);
      setEmail(userSettings.email);
      setcopyright(userSettings.copyright);
    }
  }, [userSettings]);

  const [taxPercentage, setTaxPercentage] = useState();
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [copyright, setcopyright] = useState("");
  const [logo, setLogo] = useState(null);

  const postSettings = async () => {
    try {

      const url = path.addSettings;
      const formData = new FormData();
      taxPercentage && formData.append("tax", taxPercentage);
      shopName && formData.append("shopName", shopName);
      phone && formData.append("phone", phone);
      address && formData.append("address", address);
      email && formData.append("email", email);
      copyright && formData.append("copyright", copyright);
      logo && formData.append("file", logo);
      console.log("formData ==> ", ...formData);

      const response = await postWithToken(url, token, formData);
      console.log("post settings ==> ", response);
      toast.success(response.message);
      Settings();
    } catch (error) {
      console.log("post settings error ==> ", error);
    }
  };

  const handleSave = async () => {
    // Send API request to save tax percentage
    console.log("Tax Percentage Saved:", taxPercentage);
    await postSettings();
  };

  return (
    <>
      <div style={styles.container}>
        <div className="my-3 d-flex justify-content-between">
          <h4
            style={{
              fontWeight: 800,
              borderBottom: "2px solid rgb(29 126 210)",
              display: "inline-block",
            }}
          >
            Settings
          </h4>
          <Link
            onClick={handleSave}
            className="d-flex me-3 justify-content-center align-items-center shadow py-2 px-3 btsi"
            variant="primary"
            style={{
              background: "#d9edff",
              color: "#186bb6",
              fontWeight: "900",
              borderColor: "#186bb6",
              border: "1px solid",
              borderRadius: 6,
              width: 100,
            }}
          >
            <BiSolidSave className="me-1" style={{ fontSize: 20 }} />
            Save
          </Link>
        </div>
        <div style={styles.tabsContainer}>
          <div
            onClick={() => setActiveTab("setTax")}
            style={
              activeTab === "setTax"
                ? { ...styles.tab, ...styles.active }
                : styles.tab
            }
          >
            Set Tax
          </div>
          {role === "operator" || role ==="admin" ? (
            <></>
          ) : (
            <>
              <div
                onClick={() => setActiveTab("editPdfHeader")}
                style={
                  activeTab === "editPdfHeader"
                    ? { ...styles.tab, ...styles.active }
                    : styles.tab
                }
              >
                Set Bill Pdf Header
              </div>
              <div
                onClick={() => setActiveTab("editPdfFooter")}
                style={
                  activeTab === "editPdfFooter"
                    ? { ...styles.tab, ...styles.active }
                    : styles.tab
                }
              >
                Set Bill Pdf Footer
              </div>
            </>
          )}
        </div>

        {activeTab === "setTax" && (
          <div className="row">
            <div className="col-6">
              <h4 className="py-3">Set Tax</h4>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Tax Percentage:</label>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => {
                    const { value } = e.target;
                    setTaxPercentage(value);
                  }}
                  style={styles.input}
                />
              </div>
            </div>
            <div className="col-6" style={styles.taxDisplay}>
              <p style={styles.taxLabel}>Saved Information</p>
              <p style={styles.taxAmount}>
                {userSettings && userSettings.tax}%
              </p>
            </div>
          </div>
        )}

        {role === "operator" || role === "admin" ? (
          <></>
        ) : (
          <>
            {activeTab === "editPdfHeader" && (
              <div className="row">
                <div className="col-6">
                  <h4 className="py-3">Pdf Header</h4>
                  <div style={styles.inputContainer}>
                    <label style={styles.label}>Add Logo:</label>
                    <input
                      style={styles.input}
                      type="file"
                      name="file"
                      onChange={(e) => setLogo(e.target.files[0])}
                    />
                  </div>
                  <div style={styles.inputContainer}>
                    <label style={styles.label}>Shop Name:</label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <h4 className="py-3">Contact Info</h4>
                  <div style={styles.inputContainer}>
                    <label style={styles.label}>Phone No.:</label>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputContainer}>
                    <label style={styles.label}>Address:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputContainer}>
                    <label style={styles.label}>Set Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>
                <div className="col-6" style={styles.taxDisplay}>
                  <p style={styles.taxLabel}>Saved Information</p>
                  {userSettings && (
                    <img
                      src={path.image_url + userSettings.logo}
                      style={{ objectFit: "contain", width: 100, height: 100 }}
                      alt="Preview"
                    />
                  )}

                  <div className="d-flex align-items-center pb-1">
                    <b>Shop Name: </b>
                    <p className="mb-0">
                      {" "}
                      {userSettings && userSettings.shopName}{" "}
                    </p>
                  </div>
                  <div className="d-flex align-items-center pb-1">
                    <b>Address: </b>
                    <p className="mb-0">
                      {" "}
                      {userSettings && userSettings.address}{" "}
                    </p>
                  </div>
                  <div className="d-flex align-items-center pb-1">
                    <b>Phone Number: </b>
                    <p className="mb-0">
                      {" "}
                      {userSettings && userSettings.phone}{" "}
                    </p>
                  </div>
                  <div className="d-flex align-items-center pb-1">
                    <b>Email: </b>
                    <p className="mb-0">
                      {" "}
                      {userSettings && userSettings.email}{" "}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "editPdfFooter" && (
              <div className="row">
                <div className="col-6">
                  <h4 className="py-3">Pdf Footer</h4>

                  <div
                    style={{
                      ...styles.inputContainer,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <label style={styles.label}>Copyright Text</label>

                    <textarea
                      style={styles.input}
                      value={copyright}
                      onChange={(e) => setcopyright(e.target.value)}
                      rows="4"
                      cols="10"
                    ></textarea>
                  </div>
                </div>
                <div className="col-6" style={styles.taxDisplay}>
                  <p style={styles.taxLabel}>Saved Information</p>
                  <p>{userSettings && userSettings.copyright}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SettingsScreen;
