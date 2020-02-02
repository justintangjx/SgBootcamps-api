const express = require("express");

const {
  getBootcamps,
  getUniqueBootcamp,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require("../controllers/bootcampsRoutes");

const BootcampSchema = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

// include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

// router
//   .route("/")
//   .get(getBootcamps)
//   .post(protect, authorize('publisher', 'admin'), createNewBootcamp);

router
  .route("/")
  .get(advancedResults(BootcampSchema, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createNewBootcamp);

router
  .route("/:id")
  .get(getUniqueBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

// router.get('/', (req, res) => {
//     res.status(200).json({ success: true, msg: 'display all bootcamps' });
// });

// router.get('/:id', (req, res) => {
//     res.status(200).json({success: true, msg: `show bootcamp ID ${req.params.id}` });
// });

// router.post('/', (req, res) => {
//     res.status(200).json({ success: true, msg: 'create and add new bootcamp'});
// });

// router.put('/:id', (req, res) => {
//     res.status(200).json({ success: true, msg: `update bootcamp ID ${req.params.id}`});
// });

// router.delete('/:id', (req, res) => {
//     res.status(200).json({ success: true, msg: `delete bootcamp ID ${req.params.id}` });
// });

module.exports = router;
