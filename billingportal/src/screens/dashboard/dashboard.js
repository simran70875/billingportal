import React, { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import path from "../../config/config";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { BsFillTrash3Fill } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";
import { BiSolidSave } from "react-icons/bi";
import { postsWithoutToken } from "../../services/post";
import { putWithoutToken } from "../../services/put";
import FetchSettings from "../../hooks/fetchSettings";
import FetchClients from "../../hooks/fetchClients";
import FetchItems from "../../hooks/fetchItems";

export default function Dashboard() {
  const id = useSelector((state) => state.auth.id);
  const { userSettings } = FetchSettings();
  const taxValue = userSettings && userSettings.tax;
  const { clientData } = FetchClients();
  const { itemsData } = FetchItems();

  const [formData, setFormData] = useState({
    billNumber: `BID-${uuidv4().substring(0, 8)}`,
    clientPhone: "",
    clientName: "",
    address: "",
    email: "",
  });
  const [rowData, setRowData] = useState([]);
  const columnDefs = [
    { field: "productId", flex: 1 }, //This column will be twice as wide as the others
    { field: "productName", flex: 2 },
    { field: "price", flex: 1 },
    { field: "discount", flex: 1 },
    { field: "stockAmount", flex: 1 },
    { field: "amount", flex: 1 },
    {
      field: "Actions",
      flex: 1,
      cellRenderer: (params) => <CustomButtonComponent data={params.data} />,
    },
  ];
  const [subTotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandtotal] = useState(0);
  const [updatedStock, setUpdatedStock] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [filteredItemsData, setFilteredItemsData] = useState([]);
  const [showItemsFilteredData, setShowItemsFilteredData] = useState(false);
  const [productId, setProductId] = useState();
  const [stockAmount, setStockAmount] = useState(0);
  const [MongoItemId, setMongoItemId] = useState("");
  const [itemStockAmount, setitemStockAmount] = useState(0);
  const [initialItemStockAmount, setInitialItemStockAmount] = useState(0);
  const [filteredPhoneData, setFilteredPhoneData] = useState([]);
  const [showPhoneFilteredData, setShowPhoneFilteredData] = useState(false);

  //REVIEW - handle change value of text inputs while creating bill
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowPhoneFilteredData(true);
    // if(name == "clientPhone"){
    //   setFormData({
    //     clientName: "",
    //     address: "",
    //     email: "",
    //   });
    // }
    if (clientData) {
      const filteredClients = clientData.filter((client) =>
        client.clientPhone.includes(value)
      );
      setFilteredPhoneData(filteredClients);
    }
  };
  //REVIEW - handle filter product based on product id
  const handleFilterItemIdChange = (e) => {
    setProductId(e.target.value);
    setShowItemsFilteredData(true);
    if (itemsData) {
      const filteredItems = itemsData.filter((item) =>
        item.productId.includes(e.target.value)
      );
      setFilteredItemsData(filteredItems);
    }
  };
  //REVIEW - add new item to bill
  const addItem = () => {
    const selectedItem = itemsData.find((item) => item.productId === productId);
    console.log(selectedItem);
    if (!selectedItem) {
      console.error("Product not found!");
      return;
    }
    const newRowData = [...rowData];
    const discountPrice = (selectedItem.price * selectedItem.discount) / 100;
    const originalPrice = selectedItem.price - discountPrice;
    const amount = originalPrice * stockAmount;
    const total = subTotal + amount;
    const taxAmount = (total * taxValue) / 100;
    const totalAmount = total + taxAmount;
    setSubtotal(total);
    setTax(taxAmount);
    setGrandtotal(totalAmount);
    newRowData.push({
      _id: selectedItem._id,
      productId: selectedItem.productId,
      productName: selectedItem.productName,
      price: selectedItem.price,
      discount: selectedItem.discount,
      stockAmount: stockAmount,
      amount: amount,
      Actions: CustomButtonComponent,
    });
    setRowData(newRowData);
    setitemStockAmount(0);
    setShowItemsFilteredData(false);
    setUpdatedStock((prevData) => [
      ...prevData,
      { id: MongoItemId, stockAmount: itemStockAmount },
    ]);

    setProductId("");
    setStockAmount("");
    setShowAddItemForm(false);
  };
  //REVIEW - delete item from bill
  const deleteItem = (productIdToDelete, _id) => {
    const indexToDelete = rowData.findIndex(
      (item) => item.productId === productIdToDelete
    );

    const removeStock = updatedStock.findIndex((item) => item.id === _id);

    // If the item is found, remove it from the rowData array and update state
    if (indexToDelete !== -1) {
      const updatedRowData = [...rowData];
      updatedRowData.splice(indexToDelete, 1); // Remove the item at indexToDelete
      setRowData(updatedRowData); // Update the state with the modified rowData
    } else {
      console.error("Item not found in rowData.");
    }

    // If the item is found, remove it from the updatedStock array and update state
    if (removeStock !== -1) {
      const update = [...updatedStock];
      update.splice(removeStock, 1); // Remove the item at indexToDelete
      setUpdatedStock(update); // Update the state with the modified updatedStock
    } else {
      console.error("Item not found in updatedStock.");
    }
  };
  const CustomButtonComponent = ({ data }) => {
    const handleDelete = () => {
      deleteItem(data.productId, data._id); // Call deleteItem with the productId of the item to delete
      const total = subTotal - data.amount;

      const taxAmount = (total * taxValue) / 100;
      const totalAmount = total + taxAmount;
      setSubtotal(total);
      setTax(taxAmount);
      setGrandtotal(totalAmount);
    };

    return (
      <div className="d-flex justify-content-start align-items-center h-100">
        <button onClick={handleDelete}>
          <BsFillTrash3Fill style={{ color: "#ff0000" }} />
        </button>
      </div>
    );
  };
  //REVIEW - update items stocks that added to bill while creating
  const handleUpdateStock = async () => {
    const url = path.updateStock;
    await putWithoutToken(url, updatedStock)
      .then((res) => {
        console.log("updated stock ==>", res);
        if (res.data.success === true) {
          toast.success(res.data.message);
          FetchItems();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //REVIEW - create new bill
  const createBill = async () => {
    const { billNumber, clientPhone, clientName, address, email } = formData;
    const data = {
      billNumber: billNumber,
      clientPhone: clientPhone,
      clientName: clientName,
      address: address,
      email: email,
      items: rowData,
      totalPrice: subTotal,
      tax: tax,
      grandTotal: grandTotal,
    };

    console.log("form data ==> ", data);
    if (!billNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const url = `${path.createBill}/${id}`;
    await postsWithoutToken(url, data)
      .then((res) => {
        console.log("res ===> ", res);
        if (res.success === true) {
          toast.success(res.message);
          console.log(res.data);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (formData.billNumber && formData.clientPhone) {
      handleUpdateStock();
    }

    setFormData({
      billNumber: `BID-${uuidv4().substring(0, 8)}`,
      clientPhone: "",
      clientName: "",
      address: "",
      email: "",
    });
    setRowData([]);
    setTax(0);
    setSubtotal(0);
    setGrandtotal(0);
  };

  return (
    <>
      <div className="container">
        <div>
          <>
            <div className=" px-3">
              <div className=" my-3">
                <h3 style={{ fontWeight: 800, textAlign: "center" }}>
                  Billing Desktop ABC Pvt Ltd
                </h3>
                <h6 style={{ fontWeight: 300, textAlign: "center" }}>
                  Vasal Mall, shop No 354, jalandhar
                </h6>
              </div>
              <Form className="row">
                <Form.Group className="mb-3 col-4">
                  <Form.Label style={{ fontSize: 14, fontWeight: 800 }}>
                    Bill id
                  </Form.Label>

                  <Form.Control
                    readOnly
                    type="text"
                    name="billNumber"
                    value={formData.billNumber}
                    onChange={handleChange}
                    style={{ fontSize: 12 }}
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-4">
                  <Form.Label style={{ fontSize: 14, fontWeight: 800 }}>
                    Customer Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    style={{ fontSize: 12 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-4">
                  <Form.Label style={{ fontSize: 14, fontWeight: 800 }}>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    style={{ fontSize: 12 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-4">
                  <Form.Label style={{ fontSize: 14, fontWeight: 800 }}>
                    Phone
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    name="clientPhone"
                    style={{ fontSize: 12 }}
                  />
                  <div className="autocomplete">
                    {showPhoneFilteredData &&
                      filteredPhoneData.map((client) => (
                        <Link
                          onClick={() => {
                            setFormData((prevData) => ({
                              ...prevData,
                              clientName: client.clientName,
                              clientPhone: client.clientPhone,
                              address: client.address,
                              email: client.email,
                            }));
                            setShowPhoneFilteredData(false);
                          }}
                          key={client._id}
                        >
                          <p>{client.clientPhone}</p>
                        </Link>
                      ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3 col-4">
                  <Form.Label style={{ fontSize: 14, fontWeight: 800 }}>
                    Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    style={{ fontSize: 12 }}
                  />
                </Form.Group>
              </Form>
            </div>
          </>
        </div>

        <div className="ag-theme-quartz">
          {rowData.length > 0 && (
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              enableRangeSelection={false}
              enableFillHandle={false}
              gridOptions={{ pagination: true, paginationPageSize: 7 }}
            />
          )}
        </div>
        <div className="d-flex align-items-start justify-content-start">
          <Link
            onClick={() => setShowAddItemForm(true)}
            className="d-flex align-items-start justify-content-end shadow py-2  px-3 my-2"
            style={{ background: "rgb(29 126 210)", color: "#fff" }}
          >
            <AiFillPlusCircle className="me-1" style={{ fontSize: 20 }} />
            Add
          </Link>
        </div>
        <div className="d-flex align-items-start justify-content-start">
          <Table
            striped
            bordered
            hover
            style={{ width: "fit-content" }}
            className="mx-2 my-3"
          >
            <thead>
              <tr>
                <th style={{ color: "#000", fontWeight: 800 }}>Sub total</th>
                <th style={{ color: "#000", fontWeight: 300 }}>{subTotal.toFixed(0)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: "#000", fontWeight: 800 }}>
                  Tax({userSettings && userSettings.tax}%)
                </td>
                <td style={{ color: "#000", fontWeight: 300 }}>{tax.toFixed(0)}</td>
              </tr>
              <tr>
                <td style={{ color: "rgb(29 126 210)", fontWeight: 900 }}>
                  Grand total
                </td>
                <td style={{ color: "#000", fontWeight: 300 }}>{grandTotal.toFixed(0)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="px-2 d-flex align-items-start justify-content-start mt-3 mb-3 ">
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "rgb(29 126 210)",
              marginRight: 10,
            }}
          >
            Note
          </span>
          <p className="mb-0" style={{ fontSize: 14 }}>
            {" "}
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores,
            vero, rerum magni officiis iusto aut cumque voluptates esse quae,
            distinctio expedita nesciunt nobis blanditiis molestias impedit
            atque perferendis magnam. Rerum?
          </p>
        </div>
        <div className="d-flex flex-wrap justify-content-end align-items-center py-3 mb-3">
          <Link
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
            {/* <FcSalesPerformance className="me-1" style={{ fontSize: 20 }} /> */}
            Cancel
          </Link>

          <Link
            onClick={createBill}
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
            <BiSolidSave className="me-1" style={{ fontSize: 20 }} />
            Create Bill
          </Link>
        </div>
      </div>
      {/* add item */}
      <Modal
        className="lg-expand"
        show={showAddItemForm}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          setShowAddItemForm(false);
          setProductId("");
          setStockAmount("");
          setitemStockAmount(0);
        }}
      >
        <Modal.Header
          className="myhead"
          closeButton
          style={{ background: "#1d7ed2", color: "#fff" }}
        >
          Add new item to bill
        </Modal.Header>
        <div className="px-4 py-3">
          <Form className="row">
            <div className="mb-3 col-6">
              <Form.Label>Product Id</Form.Label>
              <Form.Control
                onChange={handleFilterItemIdChange}
                type="text"
                name="productId"
                value={productId}
              />
              <div className="autocomplete">
                {showItemsFilteredData &&
                  filteredItemsData.map((item) => (
                    <Link
                      onClick={() => {
                        setProductId(item.productId);
                        setMongoItemId(item._id);
                        setitemStockAmount(item.stockAmount);
                        setInitialItemStockAmount(item.stockAmount);
                        setShowItemsFilteredData(false);
                      }}
                      key={item._id}
                    >
                      <p>{item.productId} {item.productName}</p>
                      {/* Render the product ID or another specific property */}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="mb-3 col-6">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10); // Parse the input value as an integer
                  setStockAmount(value); // Update stockAmount state

                  if (!isNaN(value)) {
                    // Check if the input is a valid number
                    const remainingStock = initialItemStockAmount - value;
                    if (remainingStock >= 0) {
                      setitemStockAmount(remainingStock); // Update itemStockAmount if it's non-negative
                    } else {
                      // Handle case where input exceeds available stock
                      toast.error(
                        `Enter Item Quantity under ${itemStockAmount}`
                      );
                      setStockAmount(""); // Reset stockAmount to clear the invalid input
                    }
                  } else {
                    setitemStockAmount(initialItemStockAmount);
                  }
                }}
                type="number"
                name="stockAmount"
                value={stockAmount}
                min={1}
                max={itemStockAmount}
              />

              <p>Available Stock : {itemStockAmount}</p>
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
              Add
            </Link>
          </div>
        </div>
      </Modal>
      {/* add item */}
    </>
  );
}
