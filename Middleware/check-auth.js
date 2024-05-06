const HttpError = require("./http-error");
const jwt = require("jsonwebtoken");

module.exports = (roles) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        throw new Error("Authentication failed");
      }

      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      req.userData = { userId: decodedToken.userId, role: decodedToken.role };

      // Verify if the user role matches any of the required roles
      if (!roles.includes(req.userData.role)) {
        throw new Error("Unauthorized");
      }

      next(); // Correctly calling next without any argument
    } catch (err) {
      const error = new HttpError("Authentication failed", 401);
      return next(error);
      // Correctly calling next with the error argument
    }
  };
};
