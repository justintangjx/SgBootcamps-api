const express = require("express");

const {
  getBootcamps,
  getUniqueBootcamp,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require("../controllers/bootcampsRoutes");

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route("/")
  .get(getBootcamps)
  .post(protect, createNewBootcamp);

router
  .route("/:id")
  .get(getUniqueBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);
  
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
