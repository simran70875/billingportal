import React from "react";
import { putWithoutToken } from "../../../services/put";
import path from "../../../config/config";
import { FaEdit } from "react-icons/fa";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

const BillActions = ({ value, reload }) => {
  const updateStatus = async () => {
    const data = { status: "saved" };
    await putWithoutToken(`${path.updateBillStatus}/${value._id}`, data)
      .then((response) => {
        console.log("PUT request successful:", response.data);
        toast.success("Bill Saved Successfully");
        reload();
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        className="d-flex justify-content-start align-items-center"
        style={{ height: "100%" }}
      >
        <p className="mb-0" style={{textTransform:'capitalize'}}>{value.status}</p>

        {value.status === "draft" ? (
          <Link
            onClick={() => {
              updateStatus();
            }}
            className="d-flex  me-3 justify-content-end align-items-center shadow py-1 px-3 btsi "
            variant="primary"
            style={{
              background: "#d9edff",
              color: "#186bb6",
              fontWeight: "900",
              borderColor: "#186bb6",
              border: "1px solid",
              borderRadius: 6,
              height: 30,
              marginLeft: 10,
            }}
          >
            <FaEdit className="me-1" style={{ fontSize: 10 }} />
            Save
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default BillActions;
