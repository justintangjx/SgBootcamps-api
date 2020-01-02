const UserSchema = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

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

    const token = UserSchema.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});

// @ desc   Login User
// @route   POST /api/v1/auth/login
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    //validate email and pw
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    //check for user
    const user = await UserSchema.findOne({ email }).select('+password');
    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    //check if pw matches
    const isAMatch = await user.matchPassword(password);
    if(!isAMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});