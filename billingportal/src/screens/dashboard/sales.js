import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { AgChartsReact } from "ag-charts-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AiFillPlusCircle } from "react-icons/ai";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AiOutlineAreaChart } from "react-icons/ai";
import { GiPieChart } from "react-icons/gi";
import FetchTodayItems from "../../hooks/fetchTodayItems";
import FetchItemSales from "../../hooks/fetchItemsSales";
import TotalRevenue from "../../hooks/totalRevenue";
import { getWithToken } from "../../services/get";
import { useSelector } from "react-redux";
import path from "../../config/config";

export default function Sales() {
  const itemsTodayData = FetchTodayItems();
  const allItemssale = FetchItemSales();
  const totalYearRevenue = TotalRevenue();
  const token = useSelector((state) => state.auth.token);
  console.log(itemsTodayData);
  const [chartOptions, setChartOptions] = useState({
    data: [],
    series: [{ type: "bar", xKey: "month", yKey: "revenue" }], // Use 'revenue' as yKey
  });

  useEffect(() => {
    const url = path.getMonthTotalRevenue; // Assuming path.getMonthTotalRevenue is defined
    const getData = async () => {
      try {
        const response = await getWithToken(url, token);
        setChartOptions({ ...chartOptions, data: response.data });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [token]);

  const columnDefs = [
    {
      headerName: "Id",
      field: "_id",
      flex: 1.5,
      filter: true,
      filter: true,
      selectable: false,
      floatingFilter: true,
    },

    {
      headerName: "Date",
      field: "createdAt",
      flex: 2,
      filter: "agDateColumnFilter", // Specify the filter type for the date field
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      floatingFilter: true, // Enable floating filter for the date field
    },
    {
      field: "productName",
      flex: 2,
      filter: true,
      selectable: false,
      floatingFilter: true,
    },
    {
      headerName: "Quantity_Sold",
      field: "totalStockAmount",
      flex: 1,
      filter: true,
    },
    {
      headerName: "Revenue",
      field: "totalAmount",
      flex: 1,
      valueFormatter: (params) => `₹${params.value.toFixed(0)}`,
    },
  ];

  const columnDefstoday = [
    { headerName: "Id", field: "_id", flex: 1, filter: true },
    { field: "productName", flex: 3, filter: true },
    {
      headerName: "Quantity_Sold",
      field: "totalStockAmount",
      flex: 2,
      filter: true,
    },
    {
      headerName: "Revenue",
      field: "totalAmount",
      flex: 2,
      valueFormatter: (params) => `₹${params.value.toFixed(0)}`,
    },
  ];

  return (
    <>
      <div className="container py-3">
        <div className="my-3 d-flex row">
          <div
            className="ag-theme-quartz col-7 mytable" // applying the grid theme
            // the grid will fill the size of the parent container
          >
            <h3
              className="d-flex"
              style={{ color: "#5d8322", fontWeight: 800 }}
            >
              {" "}
              <AiOutlineAreaChart style={{ marginRight: 10 }} />
              Today sales
            </h3>
            <AgGridReact
              rowData={itemsTodayData}
              columnDefs={columnDefstoday}
              enableRangeSelection={false}
              enableFillHandle={false}
              gridOptions={{
                pagination: true,
                paginationPageSize: 3,
                paginationPageSizeSelector: false,
              }}
            />
          </div>
          <div className="col-5 d-flex align-items-center justify-content-center">
            <div
              className="salesreveuecard d-flex justify-content-center p-3 align-items-center shadow"
              style={{ background: "#e9ffc6", width: "fit-content" }}
            >
              <GiPieChart
                style={{ fontSize: 70, marginRight: 10, color: "#5d8322" }}
              />
              <div className="d-flex justify-content-start align-items-start flex-column ">
                <h6>
                  Total revenue{" "}
                  <span style={{ fontSize: 12 }}>(this year)</span>
                </h6>
                <h1 className="mt-2"> ₹{totalYearRevenue}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5 pt-3">
          <div
            className="ag-theme-quartz col-7" // applying the grid theme
            // the grid will fill the size of the parent container
            style={{ height: 300 }}
          >
            <div className="d-flex justify-content-between mb-3">
              <h4
                className="d-flex"
                style={{ color: "#5d8322", fontWeight: 800 }}
              >
                {" "}
                <AiOutlineAreaChart style={{ marginRight: 10 }} className="" />
                view Sale (Product vise)
              </h4>
              <Link
                to="/items"
                className="d-flex  me-3 justify-content-end align-items-center shadow py-2 px-3 btsi "
                variant="primary"
                style={{
                  display: "inline-block !Important",
                  background: "#d9edff",
                  color: "#186bb6",
                  fontWeight: "900",
                  borderColor: "#186bb6",
                  border: "1px solid",
                  borderRadius: 6,
                }}
              >
                <AiFillPlusCircle className="me-1" style={{ fontSize: 20 }} />
                Add New Product
              </Link>
            </div>
            <AgGridReact
              rowData={allItemssale}
              columnDefs={columnDefs}
              enableRangeSelection={false}
              enableFillHandle={false}
              gridOptions={{
                pagination: true,
                paginationPageSize: 5,
                paginationPageSizeSelector: false,
              }}
            />
          </div>
          <div className="col-5">
            <AgChartsReact options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
}
