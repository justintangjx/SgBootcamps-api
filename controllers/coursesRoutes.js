const CourseSchema = require("../models/Course");
const BootcampSchema = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await CourseSchema.find({
      bootcamp: req.params.bootcampId
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// exports.getCourses = asyncHandler(async (req, res, next) => {
//   let query;

//   if (req.params.bootcampId) {
//     query = CourseSchema.find({ bootcamp: req.params.bootcampId });
//   } else {
//     query = CourseSchema.find().populate({
//       path: "bootcamp",
//       select: "name description"
//     });
//   }

//   const courses = await query;

//   res.status(200).json({
//     success: true,
//     count: courses.length,
//     data: courses
//   });
// });

// get single course
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await (await CourseSchema.findById(req.params.id)).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(
      new ErrorResponse(`no course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// add course , after login
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await BootcampSchema.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  //ensure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorised to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await CourseSchema.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// Update course
// @route PUT /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await CourseSchema.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`no course with the id of ${req.params.id}`),
      404
    );
  }

  //ensure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorised to update this course ${course._id}`,
        401
      )
    );
  }

  course = await CourseSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// delete course
// @route DELETE /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseSchema.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`no course with the id of ${req.params.id}`),
      404
    );
  }

  //ensure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorised to DELETE this course ${course._id}`,
        401
      )
    );
  }

  course = await CourseSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
