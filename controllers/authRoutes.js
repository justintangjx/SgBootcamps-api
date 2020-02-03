const UserSchema = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// @ desc   Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create a user
  const user = await UserSchema.create({
    name,
    email,
    password,
    role
  });

  // const token = UserSchema.getSignedJwtToken();
  // res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
});

// @ desc   Login User
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and pw
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //check for user
  const user = await UserSchema.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check if pw matches
  const isAMatch = await user.matchPassword(password);
  if (!isAMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// get token from model and then create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @ desc   Logout User
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = ayncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});



// @ desc   GET current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMeCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse("there is no associated user with that email", 404)
    );
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `you are receiving this email because you (or someone else) has requested the reset of a password. please make a PUT request to \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get hashed token; pass the token from the url
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  // find user by resettoken
  const user = await UserSchema.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // set new pw and note that password is being modified so pre-save would not run
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @ desc   update user details when you are logged in!
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };
  const user = await UserSchema.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   update user details when you are logged in!
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await UserSchema.findById(req.user.id).select("+password");

  // check current password first
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
