const adminSchema = require("../modals/adminSchema");
const Bill = require("../modals/billSchema");
const operatorSchema = require("../modals/operatorSchema");
const Product = require("../modals/productSchema");
const XLSX = require("xlsx");
const { Canvas } = require("canvas");
const jsBarcode = require("jsbarcode");
const fs = require("fs");
const path = require("path");

// Generate barcode and save to images folder
const imagesDir = path.resolve(__dirname, "../../assets/images");

// Ensure the directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

class productController {
  //NOTE - ========================== get all products =================================
  static get_products = async (req, res) => {
    try {
      const userId = req.user.userId;
      const adminOrOperator =
        (await adminSchema.findById(userId)) ||
        (await operatorSchema.findById(userId));
      console.log(adminOrOperator.role, userId);

      let items;
      if (
        adminOrOperator &&
        (adminOrOperator.role === "admin" ||
          adminOrOperator.role === "superAdmin")
      ) {
        items = await Product.find();
      } else if (adminOrOperator && adminOrOperator.role === "operator") {
        items = await Product.find({ operator: userId });
      } else {
        return res.json({
          success: false,
          message: "User not authorized to view products",
        });
      }
      return res.json({
        success: true,
        data: items,
        message: "",
      });
    } catch (error) {
      console.error("Error while showing product:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };

  static get_today_products = async (req, res) => {
    try {
      const userId = req.user.userId;
      const adminOrOperator =
        (await adminSchema.findById(userId)) ||
        (await operatorSchema.findById(userId));

      if (!adminOrOperator) {
        return res.json({
          success: false,
          message: "User not authorized to view products",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      let todayBills;
      if (
        adminOrOperator.role === "admin" ||
        adminOrOperator.role === "superAdmin"
      ) {
        todayBills = await Bill.aggregate([
          {
            $match: { createdAt: { $gte: today, $lt: tomorrow } },
          },
          {
            $unwind: "$items",
          },
          {
            $group: {
              _id: "$items.productId",
              productName: { $first: "$items.productName" },
              price: { $first: "$items.price" },
              discount: { $first: "$items.discount" },
              totalStockAmount: { $sum: "$items.stockAmount" },
              totalAmount: { $sum: "$items.amount" },
            },
          },
        ]);
      } else if (adminOrOperator.role === "operator") {
        todayBills = await Bill.aggregate([
          {
            $match: {
              operator: adminOrOperator._id,
              createdAt: { $gte: today, $lt: tomorrow },
            },
          },
          {
            $unwind: "$items",
          },
          {
            $group: {
              _id: "$items.productId",
              productName: { $first: "$items.productName" },
              price: { $first: "$items.price" },
              discount: { $first: "$items.discount" },
              totalStockAmount: { $sum: "$items.stockAmount" },
              totalAmount: { $sum: "$items.amount" },
            },
          },
        ]);
      }

      return res.json({
        success: true,
        data: todayBills,
        message: "",
      });
    } catch (error) {
      console.error("Error while showing product:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };

  static get_all_sales = async (req, res) => {
    try {
      const userId = req.user.userId;
      const adminOrOperator =
        (await adminSchema.findById(userId)) ||
        (await operatorSchema.findById(userId));

      if (!adminOrOperator) {
        return res.json({
          success: false,
          message: "User not authorized to view products",
        });
      }

      let Sales;
      if (
        adminOrOperator.role === "admin" ||
        adminOrOperator.role === "superAdmin"
      ) {
        Sales = await Bill.aggregate([
          {
            $unwind: "$items",
          },
          {
            $group: {
              _id: "$items.productId",
              productName: { $first: "$items.productName" },
              price: { $first: "$items.price" },
              discount: { $first: "$items.discount" },
              totalStockAmount: { $sum: "$items.stockAmount" },
              totalAmount: { $sum: "$items.amount" },
              createdAt: { $first: "$createdAt" },
            },
          },
        ]);
      } else if (adminOrOperator.role === "operator") {
        Sales = await Bill.aggregate([
          {
            $match: { operator: adminOrOperator._id },
          },
          {
            $unwind: "$items",
          },
          {
            $group: {
              _id: "$items.productId",
              productName: { $first: "$items.productName" },
              price: { $first: "$items.price" },
              discount: { $first: "$items.discount" },
              totalStockAmount: { $sum: "$items.stockAmount" },
              totalAmount: { $sum: "$items.amount" },
              createdAt: { $first: "$createdAt" },
            },
          },
        ]);
      }

      console.log("Sales items ==>", Sales);
      return res.json({
        success: true,
        data: Sales,
        message: "",
      });
    } catch (error) {
      console.error("Error while showing product:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };

  //NOTE - ========================== add products by file operator =================================
  static product_file_post = async (req, res) => {
    const userID = req.user.userId;
    const user =
      (await operatorSchema.findById(userID)) ||
      (await adminSchema.findById(userID));
    try {
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Save each item from the parsed data to the Product model
      for (const item of data) {
        const canvas = new Canvas();
        const value = `${item.productId ? `Item-Id:${item.productId}` : ""}\n${
          item.productName ? `Item-Name:${item.productName}` : ""
        }\n${item.price ? `Unit Price:${item.price}` : ""}\n${
          item.discount ? `Discount:${item.discount}%,` : ""
        }\n${item.stockAmount ? `Stock:${item.stockAmount}` : ""}`;
        jsBarcode(canvas, value, {
          lineColor: "black",
          width: 1,
          displayValue: false,
        });
        const barImg = canvas.toDataURL("image/png");
        const base64Data = barImg.replace(/^data:image\/png;base64,/, "");
        const imageName = `${item.productName}_${item.productId}.png`;
        const imagePath = path.join(imagesDir, imageName);
        fs.writeFileSync(imagePath, base64Data, "base64", (err) => {
          if (err) {
            console.error("Error while saving the image:", err);
            return res.status(500).send({
              success: false,
              message: "Internal server error",
            });
          }
        });

        console.log(imageName);
        const existingProductId = await Product.findOne({
          productId: item.productId,
        });
        if (existingProductId) {
          return res.json({
            success: false,
            message: "Product ID must be unique",
          });
        }

        let productData;
        if (user && (user.role === "admin" || user.role === "superAdmin")) {
          productData = {
            productId: item.productId,
            admin: userID,
            productName: item.productName,
            variationName: item.variationName,
            shortDescription: item.shortDescription,
            price: item.price,
            discount: item.discount,
            barcode: imageName,
            stockAmount: item.stockAmount,
          };
        } else {
          productData = {
            productId: item.productId,
            operator: userID,
            productName: item.productName,
            variationName: item.variationName,
            shortDescription: item.shortDescription,
            price: item.price,
            discount: item.discount,
            barcode: imageName,
            stockAmount: item.stockAmount,
          };
        }

        const product = new Product(productData);
        await product.save(); // Save each product item to the database
      }

      res.send({
        success: true,
        data: data,
        message: "Products added successfully",
      });
    } catch (error) {
      console.error("Error while uploading and saving products:", error);
      res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
  };

  //NOTE - ========================== add product by operator =================================
  static product_post = async (req, res) => {
    const userID = req.user.userId;
    const {
      productId,
      productName,
      variationName,
      shortDescription,
      price,
      discount,
      stockAmount,
    } = req.body;

    try {
      const user =
        (await operatorSchema.findById(userID)) ||
        (await adminSchema.findById(userID));
      const existingProductId = await Product.findOne({ productId: productId });
      if (existingProductId) {
        return res.json({
          success: false,
          message: "Product ID must be unique",
        });
      }

      const canvas = new Canvas();
      const value = `${productId ? `Item-Id:${productId}` : ""}\n${
        productName ? `Item-Name:${productName}` : ""
      }\n${price ? `Unit Price:${price}` : ""}\n${
        discount ? `Discount:${discount}%,` : ""
      }\n${stockAmount ? `Stock:${stockAmount}` : ""}`;
      jsBarcode(canvas, value, {
        lineColor: "black",
        width: 1,
        displayValue: false,
      });

      const barImg = canvas.toDataURL("image/png");
      const base64Data = barImg.replace(/^data:image\/png;base64,/, "");
      const imageName = `${productName}_${productId}.png`;
      const imagePath = path.join(imagesDir, imageName);

      fs.writeFileSync(imagePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error while saving the image:", err);
          return res.status(500).send({
            success: false,
            message: "Internal server error",
          });
        }
      });

      console.log(imageName);

      let newItem;

      if (user && (user.role === "admin" || user.role === "superAdmin")) {
        newItem = {
          productId: productId,
          admin: userID,
          productName: productName,
          variationName: variationName,
          shortDescription: shortDescription,
          price: price,
          discount: discount,
          barcode: imageName,
          stockAmount: stockAmount,
        };
      } else {
        newItem = {
          productId: productId,
          operator: userID,
          productName: productName,
          variationName: variationName,
          shortDescription: shortDescription,
          price: price,
          discount: discount,
          barcode: imageName,
          stockAmount: stockAmount,
        };
      }

      const saveProduct = new Product(newItem);
      await saveProduct.save();

      const data = await Product.find();
      res.json({
        success: true,
        data,
        message: "Product added successfully",
      });
    } catch (error) {
      console.error("Server error:", error);
      res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };

  //NOTE -   ========================== copy product by operator =================================
  static copy_product = async (req, res) => {
    const { productId, newProductId } = req.body;
    try {
      //NOTE -Check if a product with the new productId already exists
      const existingProduct = await Product.findOne({
        productId: newProductId,
      });
      if (existingProduct) {
        return res.json({
          success: false,
          message: "New Product ID must be unique",
        });
      }

      //NOTE - Find the product to be copied based on productId
      const productToCopy = await Product.findOne({ productId });
      console.log("productToCopy ==>", productToCopy);
      if (!productToCopy) {
        return res.json({
          success: false,
          message: "Product to copy not found",
        });
      }

      //NOTE - gnerate barcode and save to images folder
      const canvas = new Canvas();
      const value = `${newProductId ? `Item-Id:${newProductId}` : ""}\n${
        productToCopy.productName
          ? `Item-Name:${productToCopy.productName}`
          : ""
      }\n${productToCopy.price ? `Unit Price:${productToCopy.price}` : ""}\n${
        productToCopy.discount ? `Discount:${productToCopy.discount}%,` : ""
      }\n${
        productToCopy.stockAmount ? `Stock:${productToCopy.stockAmount}` : ""
      }`;
      jsBarcode(canvas, value, {
        lineColor: "#000",
        width: 1,
        displayValue: false,
      });
      const barImg = canvas.toDataURL("image/png");
      const base64Data = barImg.replace(/^data:image\/png;base64,/, "");
      const imageName = `${productToCopy.productName}_${newProductId}.png`;
      const imagePath = path.join(imagesDir, imageName);
      fs.writeFileSync(imagePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error while saving the image:", err);
          return res.status(500).send({
            success: false,
            message: "Internal server error",
          });
        }
      });
      console.log(imageName);

      const copiedProduct = new Product({
        ...productToCopy.toObject(),
        _id: null,
        productId: newProductId,
        barcode: imageName,
      });

      await copiedProduct.save();

      const data = await Product.find();
      return res.status(201).json({
        success: true,
        data: data,
        message: "Product duplicated successfully",
      });
    } catch (error) {
      console.error("Server error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  //NOTE - ========================== delete product by id =================================
  static delete_product = async (req, res) => {
    const id = req.params.id;
    try {
      const deleteProduct = await Product.findOneAndDelete({ productId: id });
      if (!deleteProduct) {
        return res.send({ success: false, message: "product not found" });
      }
      const oldImagePath = path.join(imagesDir, deleteProduct.barcode);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      const data = await Product.find();
      return res.status(200).json({
        success: true,
        data: data,
        message: `product deleted successfully with this ${id}`,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res
        .status(404)
        .send({ success: false, message: "Internal server error" });
    }
  };

  // NOTE - ========================== update product by id =================================
  static update_product = async (req, res) => {
    const id = req.params.id;
    const {
      productId,
      productName,
      variationName,
      shortDescription,
      price,
      discount,
      stockAmount,
    } = req.body;

    try {
      const oldProduct = await Product.findById(id);
      const oldImagePath = path.join(imagesDir, oldProduct.barcode);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      const canvas = new Canvas();
      const value = `${productId ? `Item-Id:${productId}` : ""}\n${
        productName ? `Item-Name:${productName}` : ""
      }\n${price ? `Unit Price:${price}` : ""}\n${
        discount ? `Discount:${discount}%` : ""
      }\n${stockAmount ? `Stock:${stockAmount}` : ""}`;
      jsBarcode(canvas, value, {
        lineColor: "#000",
        width: 1,
        displayValue: false,
      });
      const barImg = canvas.toDataURL("image/png");
      const base64Data = barImg.replace(/^data:image\/png;base64,/, "");
      const imageName = `${productName}_${productId}.png`;
      const imagePath = path.join(imagesDir, imageName);

      // Save the new image
      fs.writeFileSync(imagePath, base64Data, "base64", (err) => {
        if (err) {
          console.error("Error while saving the image:", err);
          return res.status(500).send({
            success: false,
            message: "Internal server error",
          });
        }
      });

      // Update the product in the database
      const updateProduct = await Product.findByIdAndUpdate(
        id,
        {
          productId: productId,
          productName: productName,
          variationName: variationName,
          shortDescription: shortDescription,
          price: price,
          discount: discount,
          barcode: imageName, // Update the barcode field with the new image name
          stockAmount: stockAmount,
          dateUpdated: new Date(),
        },
        { new: true }
      );

      if (!updateProduct) {
        return res
          .status(404)
          .send({ success: false, message: "Product not found" });
      }

      // Retrieve the updated list of products
      const data = await Product.find();
      return res.status(200).json({
        success: true,
        data: data,
        message: `Product updated successfully`,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };

  //NOTE - ========================== update stock by id =================================
  static update_stock = async (req, res) => {
    const stockUpdates = req.body;
    try {
      const updatedProducts = [];
      for (const { id, stockAmount } of stockUpdates) {
        const oldProduct = await Product.findById(id);
        const oldImagePath = path.join(imagesDir, oldProduct.barcode);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        const canvas = new Canvas();
        const value = `${
          oldProduct.productId ? `Item-Id:${oldProduct.productId}` : ""
        }\n${
          oldProduct.productName ? `Item-Name:${oldProduct.productName}` : ""
        }\n${oldProduct.price ? `Unit Price:${oldProduct.price}` : ""}\n${
          oldProduct.discount ? `Discount:${oldProduct.discount}%` : ""
        }\n${stockAmount ? `Stock:${stockAmount}` : ""}`;
        jsBarcode(canvas, value, {
          lineColor: "#000",
          width: 1,
          displayValue: false,
        });
        const barImg = canvas.toDataURL("image/png");
        const base64Data = barImg.replace(/^data:image\/png;base64,/, "");
        const imageName = `${oldProduct.productName}_${oldProduct.productId}.png`;
        const imagePath = path.join(imagesDir, imageName);
        fs.writeFileSync(imagePath, base64Data, "base64");
        const stockUpdate = await Product.findByIdAndUpdate(
          id,
          {
            stockAmount: stockAmount,
            barcode: imageName,
            $set: { dateUpdated: new Date() },
          },
          { new: true }
        );
        if (!stockUpdate) {
          return res.json({ success: false, message: "product not found" });
        }
        updatedProducts.push(stockUpdate);
      }

      return res.status(200).json({
        success: true,
        message: `Stock updated successfully`,
      });
    } catch (error) {
      console.error("Error updating stock product:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };

  //NOTE - ========================== update price and discount by id =================================
  static update_price_discount = async (req, res) => {
    const updates = req.body;

    try {
      const updatedProducts = [];
      for (const { id, price, discount } of updates) {
        const oldProduct = await Product.findById(id);
        const oldImagePath = path.join(imagesDir, oldProduct.barcode);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        const canvas = new Canvas();
        const value = `${oldProduct.productId ? `Item-Id:${oldProduct.productId}` : ""}\n${oldProduct.productName ? `Item-Name:${oldProduct.productName}` : ""}\n${price ? `Unit Price:${price}` : ""}\n${discount ? `Discount:${discount}%` : ""}\n${oldProduct.stockAmount ? `Stock:${oldProduct.stockAmount}` : ""}`;
        jsBarcode(canvas, value, {
          lineColor: "#000",
          width: 1,
          displayValue: false,
        });
        const barImg =  canvas.toDataURL("image/png");
        const base64Data = barImg.replace(/^data:image\/png;base64,/, "");
        const imageName = `${oldProduct.productName}_${oldProduct.productId}.png`;
        const imagePath = path.join(imagesDir,imageName);
        fs.writeFileSync(imagePath,base64Data,"base64");
        const update = await Product.findByIdAndUpdate(
          id,
          {
            price: price,
            discount: discount,
            $set: { dateUpdated: new Date() },
          },
          { new: true }
        );
        if (!update) {
          return res.json({ success: false, message: "product not found" });
        }
        updatedProducts.push(update);
      }

      return res.status(200).json({
        success: true,
        message: `Updated successfully`,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  };
}

module.exports = { productController };
