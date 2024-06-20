import React, { useState, useEffect } from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import FetchSettings from "../../../hooks/fetchSettings";
import { useParams } from "react-router-dom";
import { getWithoutToken } from "../../../services/get";
import path from "../../../config/config";

function PdfView() {
  const { id } = useParams();
  const [billDetails, setBillDetails] = useState(null);
  const { adminSettings } = FetchSettings();
  useEffect(() => {
    async function fetchBillDetails() {
      try {
        const url = `${path.billDetails}/${id}`;
        const response = await getWithoutToken(url);
        setBillDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching bill details:", error);
      }
    }

    fetchBillDetails();
  }, [id]);

  if (!billDetails) return <div>Loading...</div>;
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderColor: "#d3d3d3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          color: "white",
          padding: 15,
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        {adminSettings && (
          <Image
            src={path.image_url + adminSettings.logo}
            style={{ width: "100pt", objectFit: "contain" }}
          />
        )}
        {adminSettings && (
          <img
            style={{
              width: "100pt",
              objectFit: "contain",
              position: "absolute",
            }}
            src={path.image_url + adminSettings.logo}
            alt="logo"
          />
        )}

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 25,
              color: "#1d7ed2",
              textTransform: "capitalize",
            }}
          >
            {adminSettings && adminSettings.shopName}
          </Text>
          <Text style={{ fontSize: "11pt", color: "#000" }}>
            Contact Info:{" "}
            {adminSettings && adminSettings.phone
              ? `${adminSettings.phone} | `
              : ``}
            {adminSettings && adminSettings.email
              ? `${adminSettings.email} | `
              : ``}
            {adminSettings && adminSettings.address
              ? `${adminSettings.address} | `
              : ``}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#1d7ed2",
          padding: 7,
          borderBottomWidth: 1,
          borderStyle: "solid",
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: "12pt",
            color: "#fff",
            fontWeight: "800",
          }}
        >
          Bill Information
        </Text>
      </View>
      {/* Table Body */}
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Bill Number: {billDetails.billNumber}
        </Text>
        <Text
          colSpan="5"
          style={{
            padding: 7,
            fontSize: "11pt",
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Date: {new Date(billDetails.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Client ID: {billDetails.clientInfo.clientID}
        </Text>
        <Text
          colSpan="5"
          style={{
            padding: 7,
            fontSize: "11pt",
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Client Phone: {billDetails.clientInfo.clientPhone}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Client Name: {billDetails.clientInfo.clientName}
        </Text>
        <Text
          colSpan="5"
          style={{
            padding: 7,
            fontSize: "11pt",
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Address: {billDetails.clientInfo.address}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
            color: "#3f3f3f",
          }}
        >
          Email: {billDetails.clientInfo.email}
        </Text>
        <Text
          colSpan="5"
          style={{
            padding: 7,
            fontSize: "11pt",
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            flex: 1,
            color: "#3f3f3f",
          }}
        ></Text>
      </View>
      <View
        style={{
          backgroundColor: "#1d7ed2",
          padding: 7,
          borderBottomWidth: 1,
          borderStyle: "solid",
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: "12pt",
            color: "#fff",
            fontWeight: "800",
          }}
        >
          Product Items
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            color: "#000",
            flex: 1,
            fontWeight: "700",
          }}
        >
          Id
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 5,
          }}
        >
          Name
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        >
          Quantity
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        >
          Price
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        >
          Discount
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        >
          Amt(Rs)
        </Text>
      </View>
      {billDetails.items.map((item, index) => (
        <View
          key={index}
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderColor: "#d3d3d3",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              padding: 7,
              borderRightWidth: 1,
              borderStyle: "solid",
              borderColor: "#d3d3d3",
              fontSize: "11pt",
              flex: 1,
              color: "#3f3f3f",
            }}
          >
            {item.productId}
          </Text>
          <Text
            style={{
              padding: 7,
              borderRightWidth: 1,
              borderStyle: "solid",
              borderColor: "#d3d3d3",
              fontSize: "11pt",
              flex: 5,
              color: "#3f3f3f",
            }}
          >
            {item.productName}
          </Text>
          <Text
            style={{
              padding: 7,
              borderRightWidth: 1,
              borderStyle: "solid",
              borderColor: "#d3d3d3",
              fontSize: "11pt",
              flex: 1,
              color: "#3f3f3f",
            }}
          >
            {item.stockAmount}
          </Text>
          <Text
            style={{
              padding: 7,
              borderRightWidth: 1,
              borderStyle: "solid",
              borderColor: "#d3d3d3",
              fontSize: "11pt",
              flex: 1,
              color: "#3f3f3f",
            }}
          >
            {item.price.toFixed(0)}
          </Text>
          <Text
            style={{
              padding: 7,
              borderRightWidth: 1,
              borderStyle: "solid",
              borderColor: "#d3d3d3",
              fontSize: "11pt",
              flex: 1,
              color: "#3f3f3f",
            }}
          >
            {item.discount}%
          </Text>
          <Text
            style={{
              padding: 7,
              borderRightWidth: 1,
              borderStyle: "solid",
              borderColor: "#d3d3d3",
              fontSize: "11pt",
              flex: 1,
              color: "#3f3f3f",
            }}
          >
            {item.amount.toFixed(0)}
          </Text>
        </View>
      ))}

      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 5,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "10pt",
            flex: 1,
          }}
        >
          Total Price:
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "12pt",
            flex: 1,
            color: "#555",
            backgroundColor: "aliceblue",
          }}
        >
          {billDetails.totalPrice.toFixed(0)}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 5,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "10pt",
            flex: 1,
          }}
        >
          Tax({((billDetails.tax / billDetails.totalPrice) * 100).toFixed(0)}
          %):
        </Text>
        <Text
          style={{
            padding: 7,
            borderRightWidth: 1,
            borderStyle: "solid",
            borderColor: "#d3d3d3",
            fontSize: "12pt",
            flex: 1,
            color: "#555",
            backgroundColor: "aliceblue",
          }}
        >
          {billDetails.tax.toFixed(0)}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            padding: 7,
            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            fontSize: "11pt",
            flex: 5,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,

            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,

            fontSize: "11pt",
            flex: 1,
          }}
        ></Text>
        <Text
          style={{
            padding: 7,
            textAlign: "right",
            fontSize: "15pt",
            flex: 2,
            backgroundColor: "aliceblue",
          }}
        >
          Grand Total:
        </Text>
        <Text
          style={{
            padding: 7,
            fontSize: "15pt",
            flex: 1,
            backgroundColor: "aliceblue",
          }}
        >
          {billDetails.grandTotal.toFixed(0)}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "aliceblue",
          color: "white",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: "10pt", color: "#3f3f3f", textAlign: "center" }}
        >
          {adminSettings && adminSettings.copyright}
        </Text>
      </View>
    </View>
  );
}

export default PdfView;
