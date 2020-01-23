const express = require("express");

const {
  getCourses
} = require("../controllers/coursesRoutes");

const router = express.Router();

router.route('/').get(getCourses);

module.exports = router;