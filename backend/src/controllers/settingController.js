const adminSchema = require("../modals/adminSchema");
const operatorSchema = require("../modals/operatorSchema");
const settingSchema = require("../modals/settingSchema");

class SettingController {
  static settings_post = async (req, res) => {
    const userId = req.user.userId;
    const { tax, shopName, phone, address, email, copyright } = req.body;
  
    try {
      const findUser = await adminSchema.findById(userId ) || await operatorSchema.findById(userId);
      console.log(findUser);
      if (!findUser) {
        return res.json({
          success: false,
          message: "User not found!",
        });
      }
  
      let settings = await settingSchema.findOne({ user: userId });
      let updateFields = {
        tax: tax || settings?.tax,
      };
  
      if (findUser.role == "superAdmin") {
        Object.assign(updateFields, {
          shopName: shopName || settings?.shopName,
          phone: phone || settings?.phone,
          address: address || settings?.address,
          email: email || settings?.email,
          copyright: copyright || settings?.copyright,
          logo: req.file ? req.file.filename : settings?.logo,
        });
      }
  
      if (settings) {
        const updatedSettings = await settingSchema.findOneAndUpdate({ user: userId }, updateFields, { new: true });
        res.json({
          success: true,
          data: updatedSettings,
          message: "Settings updated successfully",
        });
      } else {
        // Create new settings
        const newSettings = new settingSchema({
          ...updateFields,
          user: userId,
          role: findUser.role,
        });
        await newSettings.save();
        res.json({
          success: true,
          data: newSettings,
          message: "Settings saved successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error); // Log detailed error information
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  static settings_get = async (req, res) => {
    const userId = req.user.userId;
    try {
      const settings = await settingSchema.findOne({ user: userId });
      const adminSettings = await settingSchema.findOne({ role: "superAdmin" });
      res.json({
        success: true,
        data: {
          userSettings: settings,
          adminSettings: adminSettings,
        },
        message: "Settings retrieved successfully",
      });
    } catch (error) {
      console.error("Error retrieving settings:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
}

module.exports = { SettingController };
