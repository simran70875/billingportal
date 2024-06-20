import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AiFillPlusCircle } from "react-icons/ai";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getWithToken } from "../../../services/get";
import path from "../../../config/config";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Actions from "./actions";

export default function Bills() {
  const columnDefs = [
    {
      field: "billNumber",
      flex: 1,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
    {
      headerName: "Created Date",
      field: "createdAt",
      flex: 1,
      filter: true,
      sortable: false,
      floatingFilter: true,
    },
    {
      headerName: "Client ID",
      field: "clientInfo.clientID",
      flex: 1,
      filter: true,
      sortable: false,
      floatingFilter: true,
    },
    {
      headerName: "Phone",
      field: "clientInfo.clientPhone",
      flex: 1,
      filter: true,
      sortable: false,
      floatingFilter: true,
    },

    {
      field: "totalPrice",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(0)}`,
    },
    {
      headerName: "Tax Amount",
      field: "tax",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(0)}`,
    },
    {
      field: "grandTotal",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(0)}`,
    },
    {
      field: "status",
      flex: 1,
      cellRenderer: (params) => (
        <Actions value={params.data} reload={getBills} />
      ),
    },
  ];
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

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
        setRowData(dataAfterFormattedDate);
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

  
  return (
    <>
      <div className="container py-3">
        <div className="my-3 d-flex justify-content-between">
          <h4
            style={{
              fontWeight: 800,
              borderBottom: "2px solid rgb(29 126 210)",
              display: "inline-block",
            }}
          >
            All Bills
          </h4>
          <Link
            to="/"
            className="d-flex  me-3 justify-content-end align-items-center shadow py-2 px-3 btsi "
            variant="primary"
            style={{
              background: "#d9edff",
              color: "#186bb6",
              fontWeight: "900",
              borderColor: "#186bb6",
              border: "1px solid",
              borderRadius: 6,
            }}
          >
            <AiFillPlusCircle className="me-1" style={{ fontSize: 20 }} />
            Add new bill
          </Link>
        </div>

        <div className="ag-theme-quartz">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            enableRangeSelection={false}
            enableFillHandle={false}
            onCellClicked={(event) => {
              if (event.column.colId === "billNumber") {
                navigate(`/bill-details/${event.data._id}`);
              }
            }}
            gridOptions={{ pagination: true, paginationPageSize: 7 }}
          />
        </div>
      </div>
    </>
  );
}
