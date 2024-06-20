const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.getJwtToken = async (id) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let tokendata = {
    time: Date(),
    userId: id,
  };
  const token =  jwt.sign(tokendata, jwtSecretKey, { expiresIn: "30m" });
  return token;
};

exports.getBecryptedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
