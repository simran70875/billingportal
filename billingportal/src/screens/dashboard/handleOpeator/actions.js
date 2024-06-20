import React, { useState } from "react";
import { putWithoutToken } from "../../../services/put";
import path from "../../../config/config";
import { deleteWithoutToken } from "../../../services/delete";
import Button from "react-bootstrap/Button";
import { FaEdit, FaExclamation } from "react-icons/fa";
import Switch from "react-switch";
import { BsFillTrash3Fill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const Actions = ({ value, reload }) => {
  const [show, setShow] = useState(false);
  const [editShow, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    role: value.role,
    name: value.name,
    userid: value.userid,
    password: value.password,
  });

  const handleEditValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateStatus = async () => {
    const data = { status: !value.status };
    await putWithoutToken(`${path.updateStatus}/${value._id}`, data)
      .then((response) => {
        console.log("PUT request successful:", response);
        toast.success("Status Updated successfully:");
        reload();
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });
  };

  const deleteOperator = async () => {
    await deleteWithoutToken(`${path.deleteOperator}/${value._id}`)
      .then((response) => {
        console.log("deleted operator successfully:", response.data);
        reload();
        setShow(false);
        toast(response.message);
      })
      .catch((error) => {
        console.error("Error deleting operator:", error);
      });
  };

  const updateOperator = async () => {
    await putWithoutToken(`${path.editOperator}/${value._id}`, formData)
      .then((response) => {
        console.log("Operator Updated Successfully:", response.data);

        reload();
        setShowEdit(false);
        toast.success("Operator Updated Successfully");
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
        <Switch
          onChange={updateStatus}
          checked={value.status}
          uncheckedIcon={false}
          checkedIcon={false}
          width={30}
          height={15}
        />
        <Button
          variant="transparent"
          style={{ marginLeft: 10, padding: 0, borderWidth: 0 }}
          onClick={() => setShow(true)}
        >
          <BsFillTrash3Fill style={{ color: "#ff0000" }} />
        </Button>
        <Button
          variant="transparent"
          style={{ marginLeft: 10, padding: 0, borderWidth: 0 }}
          onClick={() => setShowEdit(true)}
        >
          <FaEdit style={{ color: "#388e3c" }} />
        </Button>
      </div>
      {/* delete item  */}
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
        <div className="d-flex justify-content-center flex-column align-items-center w-100 ">
          <div
            className="d-flex justify-content-center align-items-center "
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              background: "#ffbaba",
            }}
          >
            <FaExclamation style={{ color: "red", fontSize: 50 }} />
          </div>
          <h2
            className="mt-2"
            style={{ color: "red", fontSize: 30, fontWeight: 800 }}
          >
            Are you sure ?
          </h2>
        </div>

        <Modal.Footer style={{ border: "none" }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
            }}
            style={{ background: "#ffbaba", color: "#000", fontWeight: 700 }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deleteOperator();
            }}
            style={{ background: "red", fontWeight: 700 }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* delete item  */}

      {/* Update item */}
      <Modal
        className="lg-expand"
        show={editShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setShowEdit(false);
        }}
      >
        <Modal.Header
          className="myhead"
          closeButton
          style={{ background: "#1d7ed2", color: "#fff" }}
        >
          Update Operator
        </Modal.Header>
        <div className="px-4 py-3">
          <Form className="row">
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Role</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="text"
                name="role"
                value={formData.role}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="text"
                name="name"
                value={formData.name}
              />
            </div>
            <div className="mb-3 col-3" controlId="userid">
              <Form.Label>User-Id/Username</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="text"
                name="userid"
                value={formData.userid}
              />
            </div>
            <div className="mb-3 col-3" controlId="password">
              <Form.Label>password</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="password"
                name="password"
                value={formData.password}
              />
            </div>
          </Form>
          <div className="mt-4 mb-2 d-flex justify-content-end">
            <Link
              onClick={() => {
                updateOperator();
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
    </div>
  );
};

export default Actions;
