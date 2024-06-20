const Client = require("../modals/clientSchema");
const Bill = require("../modals/billSchema");
const operator = require("../modals/operatorSchema");
const adminSchema = require("../modals/adminSchema");
const operatorSchema = require("../modals/operatorSchema");

class BillController {
  static get_bills = async (req, res) => {
    try {
      const clientId = req.query.clientId;
      const userId = req.user.userId;
      console.log("userId ===>", userId);
      const adminOrOperator =
        (await adminSchema.findById(userId)) ||
        (await operatorSchema.findById(userId));
      let data;

      if (
        adminOrOperator &&
        (adminOrOperator.role === "admin" ||
          adminOrOperator.role === "superAdmin")
      ) {
        if (clientId) {
          data = await Bill.find({ "clientInfo.clientID": clientId });
        } else {
          data = await Bill.find();
        }
      } else if (adminOrOperator && adminOrOperator.role === "operator") {
        if (clientId) {
          data = await Bill.find({ "clientInfo.clientID": clientId });
        } else {
          data = await Bill.find({ operator: userId });
        }
      }
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(404).json({ success: false, error: error });
    }
  };

  static get_single_bill_details = async (req, res) => {
    try {
      const billID = req.params.id;
      const data = await Bill.findById({ _id: billID });

      return res.json({ success: true, data });
    } catch (error) {
      return res.status(404).json({ success: false, error: error });
    }
  };

  static get_Clients = async (req, res) => {
    try {
      const userId = req.user.userId;
      const adminOrOperator =
        (await adminSchema.findById(userId)) ||
        (await operatorSchema.findById(userId));

      let clients;
      if (
        (adminOrOperator && adminOrOperator.role === "admin") ||
        adminOrOperator.role === "superAdmin"
      ) {
        clients = await Client.find();
      } else if (adminOrOperator && adminOrOperator.role === "operator") {
        clients = await Client.find({ operator: userId });
      }
      console.log(userId, adminOrOperator, clients);
      return res.json({ success: true, data: clients });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  static create_new_bill = async (req, res) => {
    const id = req.params.id;
    const {
      billNumber,
      clientPhone,
      clientName,
      address,
      email,
      items,
      totalPrice,
      tax,
      grandTotal,
    } = req.body;

    try {
      const operatorExist =
        (await operator.findById(id)) || (await adminSchema.findById(id));
      if (!operatorExist) {
        return res.json({ success: false, message: "User not found." });
      }
      const clientExist = await Client.findOne({ clientPhone });
      if (!clientExist) {
        const clientSave = new Client({
          operator: operatorExist._id,
          clientPhone: clientPhone,
          clientName: clientName,
          address: address,
          email: email,
          totalBills: 1,
          totalSales: grandTotal,
          dateCreated: new Date(),
        });
        const newClient = await clientSave.save();
        const newBill = new Bill({
          billNumber: billNumber,
          client: newClient._id,
          operator: operatorExist._id,
          clientInfo: newClient,
          items: items,
          totalPrice: totalPrice,
          grandTotal: grandTotal,
          tax: tax,
        });
        const data = await newBill.save();
        return res.json({
          success: true,
          message: "Bill and new client created successfully!",
          data,
        });
      } else {
        clientExist.totalBills += 1;
        clientExist.totalSales += grandTotal;
        await clientExist.save();
        const newBill = new Bill({
          billNumber: billNumber,
          client: clientExist._id,
          operator: operatorExist._id,
          clientInfo: clientExist,
          items: items,
          totalPrice: totalPrice,
          grandTotal: grandTotal,
          tax: tax,
        });
        const data = await newBill.save();
        return res
          .status(201)
          .json({ success: true, message: "Bill created successfully!", data });
      }
    } catch (error) {
      console.log("Server error while creating new bill", error);
      return res.status(500).send({ success: false, error });
    }
  };

  //NOTE - ========================== bill_update_status =================================
  static bill_update_status = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    try {
      const updateBill = await Bill.findByIdAndUpdate(
        id,
        {
          status: status,
        },
        { new: true }
      );

      if (!updateBill) {
        return res
          .status(404)
          .send({ success: false, message: "Bill not found" });
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

  static totalYearRevenue = async (req, res) => {
    const currentYear = new Date().getFullYear();
    const userId = req.user.userId;
    try {
      const adminOrOperator = (await adminSchema.findById(userId)) || (await operatorSchema.findById(userId));
      let data;
      if (adminOrOperator && (adminOrOperator.role === "admin" || adminOrOperator.role === "superAdmin")) {
        data = await Bill.find({ createdAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) } });
      } else {
        data = await Bill.find({ createdAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1), operator: userId } });
      }
      let totalRevenue = 0;
      data.forEach(bill => {
        totalRevenue += bill.grandTotal;
      });
      totalRevenue = parseFloat(totalRevenue.toFixed(0));
      console.log(totalRevenue);
      return res.json({ success: true,  totalRevenue });
    } catch (error) {
      return res.status(500).json({ success: false, data: error.message });
    }
  };
  
  static getMonthlyBillRevenue = async (req, res) => {
    const userId = req.user.userId;
    const currentYear = new Date().getFullYear(); // Get the current year
  
    try {
      const adminOrOperator = (await adminSchema.findById(userId)) || (await operatorSchema.findById(userId));
      let data;
  
      if (adminOrOperator && (adminOrOperator.role === "admin" || adminOrOperator.role === "superAdmin")) {
        data = await Bill.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) }
            }
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              totalRevenue: { $sum: "$grandTotal" }
            }
          },
          {
            $project: {
              _id: 0,
              month: { $dateToString: { format: "%b", date: { $toDate: { $multiply: ["$_id", 1000 * 60 * 60 * 24 * 30] } } } },
              revenue: "$totalRevenue",
              monthNumber: "$_id" // Include month number as well
            }
          },
          {
            $sort: { monthNumber: 1 } // Sort by month number
          }
        ]);
      } else {
        data = await Bill.aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) },
              operator: userId
            }
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              totalRevenue: { $sum: "$grandTotal" }
            }
          },
          {
            $project: {
              _id: 0,
              month: { $dateToString: { format: "%b", date: { $toDate: { $multiply: ["$_id", 1000 * 60 * 60 * 24 * 30] } } } },
              revenue: "$totalRevenue",
              monthNumber: "$_id" // Include month number as well
            }
          },
          {
            $sort: { monthNumber: 1 } // Sort by month number
          }
        ]);
      }
  
      const formattedData = data.map(item => ({
        month: item.month,
        revenue: item.revenue,
        monthNumber: item.monthNumber,
        timestamp: new Date(currentYear, item.monthNumber - 1).getTime() // Convert month to Unix timestamp
      }));
  
      return res.json({ success: true, data: formattedData });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  
  
}

module.exports = { BillController };
