const bcrypt = require("bcrypt");
const operatorSchema = require("../modals/operatorSchema");
const utils = require("../util/utils");
const adminSchema = require("../modals/adminSchema");

class OperatorsController {
  //NOTE - ========================== get operators added by admin =================================
  static operator_get = async (req, res) => {
    const id = req.user.userId;
    console.log(id);
    try {
      const adminOrOperator =
        (await adminSchema.findById(id)) || (await operatorSchema.findById(id));
      if (!adminOrOperator) {
        return res.json({
          success: false,
          message: "User not authorized to view products",
        });
      }

      console.log(adminOrOperator);
      let operators;
      if (adminOrOperator && adminOrOperator.role == "superAdmin") {
        operators = await operatorSchema.find();
      } else if (adminOrOperator && adminOrOperator.role == "admin") {
        operators = await operatorSchema.find({ adminId: id });
      }

      res.status(201).send({
        success: true,
        data: operators,
      });
    } catch (error) {
      console.error("operator error while geting:", error);
      res.status(500).send({ success: false, message: "Internal api Error" });
    }
  };

  //NOTE - ========================== add operator by admin =================================
  static operator_post = async (req, res) => {
    const id = req.user.userId;
    const { role, name, userid, password, status } = req.body;
    try {
      const exitingOperator = await operatorSchema.findOne({ userid });
      if (exitingOperator) {
        return res.json({
          success: false,
          message: "Operator Already Exits",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newOperator = new operatorSchema({
        role: role ? role : "operator",
        adminId: id,
        name: name,
        userid: userid,
        password: hashedPassword,
        status: status,
      });

      await newOperator.save();
      const data = await operatorSchema.find();

      req.session.operatorLoginId = data._id;
      return res.status(201).send({
        success: true,
        data: data,
        message: "Added Successfully",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: "Internal api Error" });
    }
  };

  //NOTE - ========================== delete operator by admin =================================
  static operator_delete = async (req, res) => {
    const id = req.params.id;
    try {
      const deleteOperator = await operatorSchema.findByIdAndDelete(id);
      if (!deleteOperator) {
        return res
          .status(404)
          .send({ success: false, message: "Operator not found" });
      }
      const data = await operatorSchema.find();
      return res.status(200).json({
        success: true,
        data: data,
        message: `Operator deleted successfully with this ${id}`,
      });
    } catch (error) {
      console.error("Error deleting operator:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  //NOTE - ========================== update operator by admin =================================
  static operator_update = async (req, res) => {
    const id = req.params.id;
    const { role, name, userid, password } = req.body;
    const hashedPassword = await utils.getBecryptedPassword(password);

    try {
      const updateOperator = await operatorSchema.findByIdAndUpdate(
        id,
        {
          role: role,
          name: name,
          userid: userid,
          password: hashedPassword,
        },
        { new: true }
      );

      if (!updateOperator) {
        return res
          .status(404)
          .send({ success: false, message: "Operator not found" });
      }
      const data = await operatorSchema.find();
      return res.status(200).json({
        success: true,
        data: data,
        message: `Operator updated successfully with this ${id}`,
      });
    } catch (error) {
      console.error("Error updated operator:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  //NOTE - ========================== update operator by admin =================================
  static operator_update_status = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    try {
      const updateOperator = await operatorSchema.findByIdAndUpdate(
        id,
        {
          status: status,
        },
        { new: true }
      );

      if (!updateOperator) {
        return res
          .status(404)
          .send({ success: false, message: "Operator not found" });
      }

      return res.status(200).json({
        success: true,
        message: `Status updated successfully with this ${id}`,
      });
    } catch (error) {
      console.error("Error status updated operator:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

module.exports = { OperatorsController };
