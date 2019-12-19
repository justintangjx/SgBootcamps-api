const express = require("express");

const {
  getBootcamps,
  getUniqueBootcamp,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require("../controllers/bootcampsRoutes");

const router = express.Router();

router
  .route("/")
  .get(getBootcamps)
  .post(createNewBootcamp);

router
  .route("/:id")
  .get(getUniqueBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
  
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
