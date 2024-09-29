const express = require("express");
const router = express.Router();
const { AdminController } = require("../controllers/adminController");
const { OperatorsController } = require("../controllers/operatorsController");
const { productController } = require("../controllers/productController");
const { BillController } = require("../controllers/billController");
const { SettingController } = require("../controllers/settingController");
const verifyToken = require("../middlewares/authorization");
const isValid = require("../middlewares/validations");
const  upload  = require("../util/upload");

router.get("/", AdminController.welcome_msz);

//NOTE - ========================== admin routes =================================
router.post("/register", AdminController.signup_post);
router.post("/login", isValid.login_post, AdminController.login_post);
router.post("/logout", AdminController.logout);

//NOTE - ========================== operator routes =================================
router.post("/createOperator",verifyToken,isValid.create_operator,OperatorsController.operator_post);
router.get("/showOperators",verifyToken, OperatorsController.operator_get);
router.delete("/deleteOperator/:id", OperatorsController.operator_delete);
router.put("/editOperator/:id", OperatorsController.operator_update);
router.put("/updateStatus/:id", OperatorsController.operator_update_status);

//NOTE - ========================== product routes =================================
router.get("/showProducts", verifyToken, productController.get_products);
router.get("/todayProducts", verifyToken, productController.get_today_products);
router.get("/productSales", verifyToken, productController.get_all_sales);
router.post("/addProduct", verifyToken, isValid.add_product, productController.product_post);
router.post("/addProductsFile",verifyToken, upload.single('file'), productController.product_file_post);

router.delete("/deleteProduct/:id", productController.delete_product);
router.put("/updateProduct/:id", productController.update_product);
router.post("/duplicateProduct",isValid.copy_product,productController.copy_product);
router.put("/updateStock", productController.update_stock);
router.put("/updatePriceDiscount", productController.update_price_discount);

//NOTE - ========================== billing routes =================================
router.get("/showBills", verifyToken, BillController.get_bills);
router.get("/getCleints", verifyToken, BillController.get_Clients);
router.post("/createNewBill/:id",isValid.add_bill,BillController.create_new_bill);
router.get("/billDetails/:id", BillController.get_single_bill_details);
router.put("/updateBillStatus/:id", BillController.bill_update_status);
router.get("/getTotalRevenue", verifyToken, BillController.totalYearRevenue);
router.get("/getMonthTotalRevenue", verifyToken, BillController.getMonthlyBillRevenue);


//NOTE - ========================== other routes =================================
router.post("/settings", verifyToken, upload.single('file'), SettingController.settings_post);
router.get("/showSettings", verifyToken, SettingController.settings_get);

module.exports = router;
