const admin = require("../modals/adminSchema");
const bcrypt = require("bcrypt");
const operatorSchema = require("../modals/operatorSchema");
const services = require("../services/services");
const utils = require("../util/utils");
const jwt = require("jsonwebtoken");

class AdminController {
  static welcome_msz = (req, res) => {
    res.send("Welcome to book store system backend");
  };

  //NOTE - ========================== signup to admin =================================
  static signup_post = async (req, res) => {
    const { userid, password, role } = req.body;

    try {
      //REVIEW -  -   check if user already exists

      try {
        await services.ifUserExists(userid);
      } catch (error) {
        return res.json({ success: false, message: "User Already Exists!" });
      }

      //REVIEW - encrypt password
      const encryptedPassword = await utils.getBecryptedPassword(password);

      //REVIEW - create new user
      const saveAdmin = new admin({
        role: role,
        userid: userid,
        password: encryptedPassword,
      });

      //REVIEW - save new data
      const data = await saveAdmin.save();

      //REVIEW
      res.status(200).send({
        success: true,
        data: data,
        message: "Registered Successfully",
      });
    } catch (error) {
      console.error("register error:", error);
      res.status(500).send({ success: false, message: "Internal api Error" });
    }
  };

  //NOTE - ========================== login to admin =================================
  static login_post = async (req, res) => {
    const { userid, password } = req.body;
    try {
      //REVIEW - check user admin or operator exits
      const adminOrOperator =
        (await admin.findOne({ userid })) ||
        (await operatorSchema.findOne({ userid }));
      console.log(adminOrOperator);
      if (!adminOrOperator) {
        return res.json({ success: false, message: "User not found" });
      }
      if (adminOrOperator.status === false) {
        return res.json({ success: false, message: "User not found" });
      }

      if (!(await bcrypt.compare(password, adminOrOperator.password))) {
        return res.json({ success: false, message: "Invalid Password" });
      }

      //REVIEW - add token to response
      const token = await utils.getJwtToken(adminOrOperator._id);

      const data = { adminOrOperator, ...{ token } };

      req.session.userid = adminOrOperator._id;
      return req.session.save(() => {
        return res.status(200).json({
          success: true,
          message: "Login successful",
          data,
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  static logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.json({ message: "Logout successful" });
    });
  };
}

module.exports = { AdminController };
