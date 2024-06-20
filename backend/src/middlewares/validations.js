const { check, validationResult } = require("express-validator");

exports.login_post = [
  check("userid").trim().not().isEmpty().withMessage("userid is required"),
  check("password").trim().not().isEmpty().withMessage("password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: "Something Went Wrong!",
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.create_operator = [
  check("userid").trim().not().isEmpty().withMessage("userid is required"),
  check("password").trim().not().isEmpty().withMessage("password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: "User-Id and Password are mandatory.",
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.add_product = [
  check("productId").trim().not().isEmpty().withMessage("product id is required"),
  check("productName").trim().not().isEmpty().withMessage("product name is required"),
  check("price").trim().not().isEmpty().withMessage("price is required"),
  check("stockAmount").trim().not().isEmpty().withMessage("stock amount is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: "Product-Id, Product Name, price and Stock Amount are mandatory.",
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.copy_product = [
  check("productId").trim().not().isEmpty().withMessage("product id field is required"),
  check("newProductId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("newProductId field is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: "New ProductId field is required!",
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.add_bill = [
  check("billNumber").trim().not().isEmpty().withMessage("bill id is required"),
  check("clientPhone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("clientPhone is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: "Bill-Id & Phone are must required",
        errors: errors.array(),
      });
    }
    next();
  },
];


