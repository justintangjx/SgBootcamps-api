const express = require("express");
const {
  register,
  login,
  getMeCurrentUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require("../controllers/authRoutes");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMeCurrentUser);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
