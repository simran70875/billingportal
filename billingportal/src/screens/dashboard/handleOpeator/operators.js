import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from "react-bootstrap/Modal";
import path from "../../../config/config";
import { getWithToken } from "../../../services/get";
import moment from "moment";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { AiFillPlusCircle } from "react-icons/ai";
import Actions from "./actions";
import { postWithToken } from "../../../services/post";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function Operators() {
  const token = useSelector((state) => state.auth.token);

  //NOTE - ==================> table fields and data <====================
  const columnDefs = [
    {
      field: "createdDate",
      flex: 1,
      filter: true,
      selectable: false,
      floatingFilter: true,
    },
    { field: "role", flex: 1 },
    {
      field: "name",
      flex: 1,
      filter: true,
      selectable: false,
      floatingFilter: true,
    },
    {
      field: "userid",
      flex: 1,
      filter: true,
      selectable: false,
      floatingFilter: true,
    },
    { field: "password", flex: 1 },
    {
      field: "status",
      flex: 1,
      cellRenderer: (params) => (
        <Actions value={params.data} reload={get_operators} />
      ),
    },
  ];
  const [rowData, setRowData] = useState([]);

  //NOTE - ===============> add new operator <===============
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    userid: "",
    password: "",
  });
  const add_operator = async () => {
    const url = path.createOperator;
    const data = await postWithToken(url, token, formData);
    try {
      if (data.success) {
        toast.success(data.message);
        console.log("Operator added successfully!", data);
        get_operators();
        setFormData({
          name: "",
          userid: "",
          password: "",
        });
        setShow(false);
      } else {
        toast.error(data.message);
        console.log("Operator added error!", data);
      }
    } catch (error) {
      console.log("Operator added error!", error);
    }
  };
  const hanldleAddValues = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //NOTE -  =================> get all operators <================
  const get_operators = async () => {
    const url = path.getOperators;
    const response = await getWithToken(url, token);
    try {
      console.log("all operators ===> ", response);
      const formattedData = response.data.map((item) => ({
        ...item,
        createdDate: moment(item.createdDate).format("YYYY-MM-DD"),
      }));
      setRowData(formattedData);
    } catch (error) {
      console.log("error ===> ", error);
    }
  };
  useEffect(() => {
    get_operators();
  }, []);

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
            All Operators
          </h4>
          <Link
            onClick={() => setShow(true)}
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
            Add New Operator <BsArrowRightCircleFill className="btsia" />
          </Link>
        </div>
        <div className="ag-theme-quartz">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            enableRangeSelection={false}
            enableFillHandle={false}
            gridOptions={{ pagination: true, paginationPageSize: 7 }}
          />
        </div>
      </div>

      {/* add operator */}
      <Modal
        className="lg-expand"
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header
          className="myhead"
          closeButton
          style={{ background: "#1d7ed2", color: "#fff" }}
        >
          Add Operator
        </Modal.Header>
        <div className="px-4 py-3">
          <Form className="row">
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Role</Form.Label>
              <Form.Control
                onChange={hanldleAddValues}
                type="text"
                name="role"
                value={formData.role}
              />
            </div>

            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={hanldleAddValues}
                type="text"
                name="name"
                value={formData.name}
              />
            </div>
            <div className="mb-3 col-3" controlId="userid">
              <Form.Label>User-Id/Username</Form.Label>
              <Form.Control
                onChange={hanldleAddValues}
                type="text"
                name="userid"
                value={formData.userid}
              />
            </div>
            <div className="mb-3 col-3" controlId="password">
              <Form.Label>password</Form.Label>
              <Form.Control
                onChange={hanldleAddValues}
                type="password"
                name="password"
                value={formData.password}
              />
            </div>
          </Form>
          <div className="mt-4 mb-2 d-flex justify-content-end">
            <Link
              onClick={() => {
                add_operator();
              }}
              className="d-flex me-3 justify-content-end align-items-center shadow py-2 px-3  btsi"
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
              Save
            </Link>
          </div>
        </div>
      </Modal>
      {/* add item end */}
    </>
  );
}
