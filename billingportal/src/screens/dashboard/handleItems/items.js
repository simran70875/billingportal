import React, {  useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FcBullish } from "react-icons/fc";
import { FcSalesPerformance } from "react-icons/fc";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsArrowRightCircleFill, BsFillTrash2Fill } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import path from "../../../config/config";
import Actions from "./actions";
import { postWithToken } from "../../../services/post";
import { toast } from "react-toastify";
import { putWithoutToken } from "../../../services/put";
import { useSelector } from "react-redux";
import FetchItems from "../../../hooks/fetchItems";
import { FaBarcode, FaFile, FaFileUpload } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { deleteWithoutToken } from "../../../services/delete";

export default function Items() {
  const componentRef = useRef();
  const { itemsData, updateStock, priceDiscount, Items } = FetchItems();
  const token = useSelector((state) => state.auth.token);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [productId, setproductId] = useState("");
  const [productName, setproductName] = useState("");
  const [shortDescription, setshortDescription] = useState("");
  const [price, setprice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stockAmount, setStockAmount] = useState(0);
  const printBarcodes = useReactToPrint({
    content: () => componentRef.current,
  });
  const columnDefs = [
    { field: "productId", flex: 1, checkboxSelection: true },
    { field: "dateCreated", flex: 1 },
    { field: "dateUpdated", flex: 1 },
    {
      field: "productName",
      flex: 2.5,
      cellRenderer: (params) => (
        <>
          {params.data.productName}
          <br />
          {params.data.shortDescription}
        </>
      ),
    },
    {
      field: "price",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? `₹${params.value.toFixed(0)}` : "--",
    },
    {
      field: "discount",
      flex: 1,
      valueFormatter: (params) => (params.value ? `${params.value}%` : "--"),
    },
    {
      headerName: "Quantity",
      field: "stockAmount",
      flex: 1,
      valueFormatter: (params) => (params.value ? params.value : 0),
    },
    {
      field: "Operations",
      flex: 2,
      cellRenderer: (params) => <Actions value={params.data} reload={Items} />,
    },
  ];
  const [formDataStock, setFormDataStock] = useState([]);
  const [showupdate, setShowUpdateStock] = useState(false);
  const columnUpdateStock = [
    {
      field: "productId",
      flex: 1,
      filter: true,

      floatingFilter: true,
    },
    {
      field: "productName",
      flex: 2,
    },
    {
      field: "stockAmount",
      flex: 1,
      cellEditor: "agTextCellEditor",
      editable: true,
    },
  ];
  const [formDataPrice, setFormDataPrice] = useState([]);
  const [showprice, setShowUpdatePrice] = useState(false);
  const columnPriceDiscount = [
    {
      field: "productId",
      flex: 1,
      filter: true,
      floatingFilter: true,
    },
    {
      field: "productName",
      flex: 2,
    },
    {
      field: "price",
      flex: 1,
      cellEditor: "agTextCellEditor",
      editable: true,
      valueFormatter: (params) =>
        params.value && "₹" + Number(params.value).toFixed(0),
    },
    {
      field: "discount",
      flex: 1,
      cellEditor: "agTextCellEditor",
      editable: true,
      valueFormatter: (params) =>
        params.value && Number(params.value).toFixed(0) + "%",
    },
  ];

  const addItem = async () => {
    const formData = {
      productId: productId,
      productName: productName,
      shortDescription: shortDescription,
      price: price,
      discount: discount,
      stockAmount: stockAmount,
    };

    console.log(formData);
    const url = path.addItem;
    try {
      await postWithToken(url, token, formData).then((response) => {
        console.log("response ==>", response);
        if (response.success === true) {
          toast.success(response.message);
          setShowAddItem(false);
          Items();
        } else {
          toast.error(response.message);
        }
      });
    } catch (error) {
      console.error("Error adding item:", error);
    }

    // html2canvas(elem, opt).then(async (canvas) => {
    //   const barImg = canvas.toDataURL("image/png");
    //   const blob = await fetch(barImg).then((res) => res.blob());
    //   const barcodeName = `${productName}${productId}_${Date.now()}.png`;
    //   const formData = new FormData();
    //   formData.append("productId", productId);
    //   formData.append("productName", productName);
    //   formData.append("shortDescription", shortDescription);
    //   formData.append("price", price);
    //   formData.append("discount", discount);
    //   formData.append("stockAmount", stockAmount);
    //   formData.append("file", blob, barcodeName);

    //   // Log formData contents
    //   for (let pair of formData.entries()) {
    //     console.log(pair[0] + ": " + pair[1]);
    //   }

    //   const url = path.addItem;
    //   try {
    //     await postWithToken(url, token, formData).then((response) => {
    //       console.log("response ==>", response);
    //       if (response.success === true) {
    //         toast.success(response.message);
    //         setShowAddItem(false);
    //         Items();
    //       } else {
    //         toast.error(response.message);
    //       }
    //     });
    //   } catch (error) {
    //     console.error("Error adding item:", error);
    //   }
    // });
  };

  const deleteSeletedItem = async (id) => {
    await deleteWithoutToken(`${path.deleteItem}/${id}`)
      .then((response) => {
        console.log(response);
        if (response.data.success === true) {
          console.log("done");
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const deleteItems = () => {
    for (let index = 0; index < selectedItems.length; index++) {
      console.log("selectedItems ==>", selectedItems[index]._id);
      deleteSeletedItem(selectedItems[index].productId);
    }
    setSelectedItems([]);
    Items();
  };

  //REVIEW -  -  - Update stocks
  const handleStockAmountChange = (event) => {
    const { data, newValue } = event;
    const updatedData = {
      id: data._id,
      stockAmount: newValue,
    };
    setFormDataStock((preData) => [...preData, updatedData]);
  };
  const handleUpdateStock = async () => {
    console.log("formDataStock ==>", formDataStock);
    const url = path.updateStock;
    await putWithoutToken(url, formDataStock)
      .then((res) => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          setShowUpdateStock(false);
          Items();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //REVIEW -  -  - Update price and discount
  const handlePriceChange = (params) => {
    const updatedData = {
      id: params.data._id,
      price: params.data.price,
      discount: params.data.discount,
    };

    setFormDataPrice((preData) => {
      const itemExists = preData.some((item) => item.id === updatedData.id);
      if (itemExists) {
        return preData.map((item) =>
          item.id === updatedData.id
            ? {
                ...item,
                price: updatedData.price,
                discount: updatedData.discount,
              }
            : item
        );
      } else {
        return [...preData, updatedData];
      }
    });
  };

  const handleUpdatePrice = async () => {
    console.log("formDataStock ==>", formDataPrice);
    const url = path.updatePriceDiscount;
    await putWithoutToken(url, formDataPrice)
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          toast.success(res.data.message);
          setShowUpdatePrice(false);
          Items();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFileUpload = async (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    const url = path.addProductsFile;
    try {
      await postWithToken(url, token, formData).then((res) => {
        if (res.success) {
          toast.success(res.message);
          Items();
        } else {
          toast.error(res.message);
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
            Items
          </h4>
        </div>
        <div className="d-flex flex-wrap align-items-center py-3 mb-3">
          <Link
            onClick={() => printBarcodes()}
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
            <FaBarcode className="me-1" style={{ fontSize: 20 }} />
            Print Barcodes <FaFile className="btsia" />
          </Link>
          {selectedItems.length > 0 && (
            <Link
              onClick={() => deleteItems()}
              className="d-flex  me-3 justify-content-end align-items-center shadow py-2 px-3 btsi "
              variant="primary"
              style={{
                background: "#ffdede",
                color: "red",
                fontWeight: "900",
                borderColor: "#eba834",
                border: "1px solid",
                borderRadius: 6,
              }}
            >
              <BsFillTrash2Fill style={{ color: "#ff0000" }} />
            </Link>
          )}

          <div
            className="d-flex flex-wrap justify-content-end align-items-center"
            style={{ flex: 1 }}
          >
            <Link
              onClick={() => setShowUpdateStock(true)}
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
              <FcBullish className="me-1" style={{ fontSize: 20 }} />
              Update stock <BsArrowRightCircleFill className="btsia" />
            </Link>
            <Link
              onClick={() => setShowUpdatePrice(true)}
              className="d-flex  me-3 justify-content-end align-items-center shadow py-2 px-3 btsi "
              variant="primary"
              style={{
                background: "#fff2cb",
                color: "#eba834",
                fontWeight: "900",
                borderColor: "#eba834",
                border: "1px solid",
                borderRadius: 6,
              }}
            >
              <FcSalesPerformance className="me-1" style={{ fontSize: 20 }} />
              Update price <BsArrowRightCircleFill className="btsia" />
            </Link>
            <Link
              onClick={() => {
                setShowAddItem(true);
              }}
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
              Add item <BsArrowRightCircleFill className="btsia" />
            </Link>
            <label
              className="d-flex me-3 justify-content-end align-items-center shadow py-2 px-3 btsi"
              style={{
                background: "#d9edff",
                color: "#186bb6",
                fontWeight: "900",
                borderColor: "#186bb6",
                border: "1px solid",
                borderRadius: 6,
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              <AiFillPlusCircle className="me-1" style={{ fontSize: 20 }} />
              Upload Items <FaFileUpload className="btsia" />
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                accept=".xls,.xlsx"
                style={{ display: "none" }} // Hide the actual file input
              />
            </label>
          </div>
        </div>
        <div style={{ display: "none" }}>
          <div
            ref={componentRef}
            style={{
              padding: 20,
            }}
          >
            <h4 style={{ fontWeight: "700", marginBottom: 30 }}>
              All Items Barcode
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {selectedItems.length > 0
                ? selectedItems.map((item, index) => (
                    <div key={item._id} style={{ width: "50%", padding: 10 }}>
                      <p style={{ textAlign: "center", margin: 0 }}>
                        {item.productId}
                      </p>
                      <img
                        style={{ width: "100%" }}
                        key={index}
                        src={path.image_url + item.barcode}
                        alt={item.name}
                      />
                    </div>
                  ))
                : itemsData.map((item, index) => (
                    <div key={item._id} style={{ width: "50%", padding: 10 }}>
                      <p style={{ textAlign: "center", margin: 0 }}>
                        {item.productId} {item.productName}
                      </p>
                      <img
                        style={{ width: "100%" }}
                        key={index}
                        src={path.image_url + item.barcode}
                        alt={item.name}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <div className="ag-theme-quartz" style={{ height: "400px" }}>
          <AgGridReact
            rowData={itemsData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            onRowSelected={(event) => {
              const selectedRowData = event.api.getSelectedRows();
              setSelectedItems(selectedRowData);
              console.log("selectedRowData", selectedRowData);
            }}
            rowMultiSelectWithClick={true}
            suppressRowClickSelection={true}
            gridOptions={{
              pagination: true,
              paginationPageSize: 7,
              paginationPageSizeSelector: [7, 10, 20],
            }}
          />
        </div>
      </div>

      {/* ///REVIEW - add item */}
      <Modal
        className="lg-expand"
        show={showAddItem}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setShowAddItem(false);
        }}
      >
        <Modal.Header
          className="myhead"
          closeButton
          style={{ background: "#1d7ed2", color: "#fff" }}
        >
          Add item
        </Modal.Header>
        <div className="px-4 py-3">
          <Form className="row">
            <div className="mb-3 col-3">
              <Form.Label>Product Id</Form.Label>
              <Form.Control
                onChange={(e) => setproductId(e.target.value)}
                type="text"
                name="productId"
                value={productId}
              />
            </div>
            <div className="mb-3 col-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                onChange={(e) => {
                  setproductName(e.target.value);
                }}
                type="text"
                name="productName"
                value={productName}
              />
            </div>
            <div className="mb-3 col-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                onChange={(e) => setprice(e.target.value)}
                type="number"
                name="price"
                value={price}
              />
            </div>
            <div className="mb-3 col-3">
              <Form.Label>Product Discount</Form.Label>
              <Form.Control
                onChange={(e) => setDiscount(e.target.value)}
                type="number"
                name="discount"
                value={discount}
              />
            </div>
            <div className="mb-3 col-3">
              <Form.Label>Stock Amount</Form.Label>
              <Form.Control
                onChange={(e) => setStockAmount(e.target.value)}
                type="number"
                name="stockAmount"
                value={stockAmount}
              />
            </div>
            <div className="mb-3 col-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                onChange={(e) => setshortDescription(e.target.value)}
                name="shortDescription"
                value={shortDescription}
                as="textarea"
                rows={2}
              />
            </div>
          </Form>

          <div className="mt-4 mb-2 d-flex justify-content-end">
            <Link
              onClick={() => {
                addItem();
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
              <AiFillPlusCircle className="me-2" /> Add item
            </Link>
          </div>
        </div>
      </Modal>
      {/* add item end */}

      {/* ///REVIEW -  - update stock  */}
      <Modal
        className="lg-expand"
        show={showupdate}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setShowUpdateStock(false)}
      >
        <Modal.Header closeButton>Update Stock</Modal.Header>
        <div className="px-4 py-3">
          <div
            className="ag-theme-quartz" // applying the grid theme
            style={{ height: "500px" }} // the grid will fill the size of the parent container
          >
            <AgGridReact
              rowData={updateStock}
              columnDefs={columnUpdateStock}
              onCellValueChanged={handleStockAmountChange}
              gridOptions={{
                pagination: true,
                paginationPageSize: 7,
                paginationPageSizeSelector: [5, 7, 10],
              }}
            />
          </div>
          <div className="d-flex flex-wrap justify-content-end align-items-center py-3 mb-3">
            <Link
              onClick={handleUpdateStock}
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
              Update stock <BsArrowRightCircleFill className="btsia" />
            </Link>
          </div>
        </div>
      </Modal>
      {/* update stock  end */}

      {/* ///REVIEW -  update price */}
      <Modal
        className="lg-expand"
        show={showprice}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setShowUpdatePrice(false)}
      >
        <Modal.Header closeButton>Update Price</Modal.Header>
        <div className="px-4 py-3">
          <div className="ag-theme-quartz" style={{ height: "500px" }}>
            <AgGridReact
              rowData={priceDiscount}
              columnDefs={columnPriceDiscount}
              onCellValueChanged={handlePriceChange}
              gridOptions={{
                pagination: true,
                paginationPageSize: 7,
                paginationPageSizeSelector: [7, 10, 20],
              }}
            />
          </div>
          <div className="d-flex flex-wrap justify-content-end align-items-center py-3 mb-3">
            <Link
              onClick={handleUpdatePrice}
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
              Update price <BsArrowRightCircleFill className="btsia" />
            </Link>
          </div>
        </div>
      </Modal>
      {/* update price end */}
    </>
  );
}
