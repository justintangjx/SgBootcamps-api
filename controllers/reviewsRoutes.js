const ReviewSchema = require("../models/Review");
const BootcampSchema = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
      const reviews = await ReviewSchema.find({
        bootcamp: req.params.bootcampId
      });
  
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  });