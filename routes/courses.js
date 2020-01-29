const express = require("express");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/coursesRoutes");

const CourseSchema = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

// router.route('/').get(getCourses).post(addCourse);
router
  .route("/")
  .get(
    advancedResults(CourseSchema, {
      path: "bootcamp",
      select: "name description"
    }),
    getCourses
  )
  .post(addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
