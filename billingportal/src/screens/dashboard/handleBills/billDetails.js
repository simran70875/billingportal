import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import path from "../../../config/config";
import { AiFillPrinter } from "react-icons/ai";
import { putWithoutToken } from "../../../services/put";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import PdfView from "./pdfView";

const BillDetails = () => {
  const { id } = useParams();
  const componentRef = useRef();
  const printBill = useReactToPrint({
    content: () => componentRef.current,
  });
  const updateStatus = async () => {
    const data = { status: "printed" };
    await putWithoutToken(`${path.updateBillStatus}/${id}`, data)
      .then((response) => {
        console.log("PUT request successful:", response.data);
        toast.success("Bill Printed Successfully");
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });
  };

  return (
    <div className="container py-3">
      <div className="my-3 d-flex justify-content-between">
        <h4
          style={{
            fontWeight: 800,
            borderBottom: "2px solid rgb(29 126 210)",
            display: "inline-block",
          }}
        >
          Bill Details
        </h4>
        <Link
          onClick={() => {
            printBill();
            updateStatus();
          }}
          className="d-flex me-3 justify-content-end align-items-center shadow py-2 px-3 btsi"
          variant="primary"
          style={{
            background: "#e2ffe4",
            color: "#388e3c",
            fontWeight: "900",
            borderColor: "#388e3c",
            border: "1px solid",
            borderRadius: 6,
          }}
        >
          <AiFillPrinter className="me-1" style={{ fontSize: 20 }} />
          Print Bill
        </Link>
      </div>
      <div className="row my-3">
        <div ref={componentRef} className="col-md-12">
          <PdfView />
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
