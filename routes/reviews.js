const express = require("express");

const { getReviews } = require("../controllers/reviewsRoutes");

const ReviewSchema = require("../models/Review");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(
  advancedResults(ReviewSchema, {
    path: "bootcamp",
    select: "name description"
  }),
  getReviews
);

module.exports = router;