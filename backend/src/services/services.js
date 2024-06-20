const admin = require("../modals/adminSchema");
const Product = require("../modals/productSchema");

exports.ifUserExists = async (userid) => {
  return new Promise(async (resolve, reject) => {
    const ifUserExists = await admin.findOne({ userid });
    if (ifUserExists) {
      reject("User Already Exists!");
    }
    resolve(true);
  });
};

exports.isProductId = async (productId) => {
  return new Promise(async (resolve, reject) => {
    const ifProductIdExists = await Product.findOne({ productId });
    if (ifProductIdExists) {
      reject("Product ID must be different");
    }
    resolve(true);
  });
};
