const CourseSchema = require("../models/Course");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// get all bootcamps
// @route GET /api/v1/bootcamps
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    
    if(req.params.bootcampId) {
        query = CourseSchema.find({ bootcamp: req.params.bootcampId });
    } else {
        query = CourseSchema.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
})
