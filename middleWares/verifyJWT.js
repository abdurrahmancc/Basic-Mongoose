const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { userName, userId } = decoded;
    req.userName = userName;
    req.userId = userId;
    next();
  } catch (error) {
    next("Authorization failure!");
  }
};

module.exports = verifyJWT;
