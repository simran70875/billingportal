import React, { useState } from "react";
import { putWithoutToken } from "../../../services/put";
import path from "../../../config/config";
import { deleteWithoutToken } from "../../../services/delete";
import Button from "react-bootstrap/Button";
import { FaEdit, FaExclamation } from "react-icons/fa";
import { BsBack, BsFillTrash3Fill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { postsWithoutToken } from "../../../services/post";
import imagesPath from "../../../components/other/imagePaths";

const Actions = ({ value, reload }) => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [copyItemModal, setCopyItemModal] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const imageGen = async (url, name) => {
    const image = await fetch(url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = name;
    downloadLink.click();
  };
  const [formData, setFormData] = useState({
    productId: value.productId,
    productName: value.productName,
    shortDescription: value.shortDescription,
    price: value.price,
    discount: value.discount,
    stockAmount: value.stockAmount,
  });
  const handleEditValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const duplicateItem = async () => {
    const url = path.duplicateItem;
    const data = {
      productId: value.productId,
      newProductId: newProductId,
    };
    await postsWithoutToken(url, data)
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          setCopyItemModal(false);
          setNewProductId("");
          reload();
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteItem = async () => {
    await deleteWithoutToken(`${path.deleteItem}/${value.productId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success === true) {
          toast.success(response.data.message);
          setShow(false);
          reload();
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };
  const editItem = async () => {
    await putWithoutToken(`${path.editItem}/${value._id}`, formData)
      .then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message);

          setShowEdit(false);
          reload();
        } else {
          toast.error(response.data.message);
        }
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
        <Button
          variant="transparent"
          style={{ marginLeft: 10, padding: 0, borderWidth: 0 }}
          onClick={() => setCopyItemModal(true)}
        >
          <BsBack style={{ color: "#1d7ed2" }} />
        </Button>
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

        <Button
          variant="transparent"
          style={{ marginLeft: 10, padding: 0, borderWidth: 0 }}
          onClick={() => setShowBarcode(true)}
        >
          <img
            alt="create barcode"
            className="img-fluid"
            src={imagesPath.barcode}
            style={{ width: 30 }}
          />
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
              deleteItem();
            }}
            style={{ background: "red", fontWeight: 700 }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* delete item  */}

      {/* duplicate item */}
      <Modal
        className="lg-expand"
        show={copyItemModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setCopyItemModal(false);
        }}
      >
        <Modal.Header
          className="myhead"
          closeButton
          style={{ background: "#1d7ed2", color: "#fff" }}
        >
          Duplicate Item
        </Modal.Header>
        <div className="px-4 py-3">
          <Form className="row">
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Created Date</Form.Label>
              <Form.Control
                readOnly
                type="text"
                name="name"
                placeholder={value.dateCreated}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Product Id</Form.Label>
              <Form.Control
                readOnly
                type="text"
                name="name"
                placeholder={value.productId}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                readOnly
                type="text"
                name="name"
                placeholder={value.productName}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                readOnly
                type="text"
                name="name"
                placeholder={value.price}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Product Discount</Form.Label>
              <Form.Control
                readOnly
                type="text"
                name="name"
                placeholder={value.discount}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>Stock Amount</Form.Label>
              <Form.Control
                readOnly
                type="text"
                name="name"
                placeholder={value.stockAmount}
              />
            </div>
            <div className="mb-3 col-3" controlId="name">
              <Form.Label>New Product Id</Form.Label>
              <Form.Control
                onChange={(e) => setNewProductId(e.target.value)}
                type="text"
                name="name"
                value={newProductId}
              />
            </div>
          </Form>
          <div className="mt-4 mb-2 d-flex justify-content-end">
            <Link
              onClick={() => {
                duplicateItem();
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
      {/* duplicate item */}

      {/* edit item */}
      <Modal
        className="lg-expand"
        show={showEdit}
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
          Update Item
        </Modal.Header>
        <div className="px-4 py-3">
          <Form className="row">
            <div className="mb-3 col-3" controlId="productId">
              <Form.Label>Product Id</Form.Label>
              <Form.Control
               readOnly
                onChange={handleEditValueChange}
                type="text"
                name="productId"
                value={formData.productId}
                placeholder={formData.productId}
              />
            </div>
            <div className="mb-3 col-3" controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="text"
                name="productName"
                value={formData.productName}
                placeholder={formData.productName}
              />
            </div>
            <div className="mb-3 col-3" controlId="price">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="number"
                name="price"
                value={formData.price}
                placeholder={formData.price}
              />
            </div>
            <div className="mb-3 col-3" controlId="discount">
              <Form.Label>Product Discount</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="number"
                name="discount"
                value={formData.discount}
                placeholder={formData.discount}
              />
            </div>
            <div className="mb-3 col-3" controlId="stockAmount">
              <Form.Label>Stock Amount</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="number"
                name="stockAmount"
                value={formData.stockAmount}
                placeholder={formData.stockAmount}
              />
            </div>
            <div className="mb-3 col-3" controlId="shortDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={handleEditValueChange}
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                placeholder={formData.shortDescription}
              />
            </div>
          </Form>
          <div className="mt-4 mb-2 d-flex justify-content-end">
            <Link
              onClick={() => {
                editItem();
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
      {/* edit item */}

      {/* bar code item */}
      <Modal
        className="lg-expand"
        show={showBarcode}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setShowBarcode(false);
        }}
      >
        <Modal.Header
          className="myhead"
          closeButton
          style={{ background: "#1d7ed2", color: "#fff" }}
        >
          {value.productId} {value.productName}
        </Modal.Header>

        <div
          className="py-4  d-flex align-items-center"
          style={{ flexDirection: "column" }}
        >
          <div style={{ width: "50%" }}>
            <img
              alt="create barcode"
              className="img-fluid"
              src={path.image_url + value.barcode}
              style={{ width: "100%" }}
            />
          </div>
          <button
            onClick={() =>
              imageGen(path.image_url + value.barcode, value.productName)
            }
            className="d-flex me-3 mt-4 justify-content-center align-items-center shadow py-2 px-3  btsi"
            variant="primary"
            style={{
              background: "#e2ffe4",
              color: "#388e3c",
              fontWeight: "900",
              borderColor: "#388e3c",
              border: "1px solid",
              borderRadius: 6,
              alignSelf: "center",
            }}
          >
            Download
          </button>
        </div>
      </Modal>
      {/*  bar code item  */}
    </div>
  );
};

export default Actions;
