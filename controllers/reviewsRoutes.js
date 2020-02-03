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

// get single review
// @route GET /api/v1/reviews/:id
// @access public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await (await ReviewSchema.findById(req.params.id)).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// add review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await BootcampSchema.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `no bootcamp with the id of ${req.param.bootcampId}`,
        404
      )
    );
  }

  const review = await ReviewSchema.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// update review
// @route PUT /api/v1/reviews/:Id
// @access Public
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await ReviewSchema.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`no bootcamp with the id of ${req.params.id}`, 404)
    );
  }

  // permissions check
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to update review!`, 401));
  }

  review = await ReviewSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// delete review
// @route DELETE /api/v1/reviews/:Id
// @access Public
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await ReviewSchema.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`no bootcamp with the id of ${req.params.id}`, 404)
    );
  }

  // permissions check
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to update review!`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
