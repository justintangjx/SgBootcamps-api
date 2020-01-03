const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if(req.cookies.token) {
  //     token = req.cookies.token
  // }

  // check if token exists
  if (!token) {
    return next(new ErrorResponse("not authorised to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    //to reflect current login user
    req.user = await User.findById(decoded.id);
  } catch (err) {
    return next(new ErrorResponse("not authorised to access this route", 401));
  }
});
