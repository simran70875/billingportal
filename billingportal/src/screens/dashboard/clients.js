import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FetchClients from "../../hooks/fetchClients";

export default function Clients() {
  const { clientData } = FetchClients();
  const columnDefs = [
    { field: "clientID", flex: 1 },
    { field: "clientPhone", flex: 1 },
    {
      field: "clientName",
      flex: 1,
      valueFormatter: (params) => params.value || "NA",
    },
    {
      field: "address",
      flex: 2,
      valueFormatter: (params) => params.value || "NA",
    },
    { field: "totalBills", flex: 1 },
    {
      field: "totalSales",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(0)}`,
    },
  ];
  const handleRowClicked = (event) => {
    const clientId = event.data.clientID;
    window.location.href = `/bills?clientId=${clientId}`;
  };

  return (
    <>
      <div className="container py-3">
        <div className="my-2">
          <h4
            style={{
              fontWeight: 800,
              borderBottom: "2px solid rgb(29 126 210)",
              display: "inline-block",
            }}
          >
            All Clients
          </h4>
        </div>
        <div className="ag-theme-quartz" style={{ height: "400px" }}>
          <AgGridReact
            rowData={clientData}
            columnDefs={columnDefs}
            enableRangeSelection={false}
            enableFillHandle={false}
            onRowClicked={handleRowClicked}
            gridOptions={{ pagination: true, paginationPageSize: 7 }}
          />
        </div>
      </div>
    </>
  );
}
