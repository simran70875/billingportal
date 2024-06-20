const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Unauthorized: Invalid token",
        });
      }
      req.user = decoded; // Decoded information (e.g., user ID) is stored in req.user
      next();
    });
  } catch (error) {
    return res.status(401).send(error);
  }
};

module.exports = verifyToken;
