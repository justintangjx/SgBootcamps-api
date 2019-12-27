const BootcampSchema = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require('../utils/errorResponse');



// get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    const bootcamps = await BootcampSchema.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps  });
});



// get all bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
// exports.getUniqueBootcamp = async (req, res, next) => {
//   try {
//     const bootcamp = await BootcampSchema.findById(req.params.id);
//     if (!bootcamp) {
//       return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
//     }
//     res.status(200).json({ success: true, data: bootcamp });
//   } catch (err) {
//     // res.status(400).json({ success: false });
//     // next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
//     next(err);
//   }
// };
exports.getUniqueBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampSchema.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});



// post and add new bootcamp
// @route POST /api/v1/bootcamps
// @access private
// exports.createNewBootcamp = async (req, res, next) => {
//     try {
//         const createNewBootcampToDB = await BootcampSchema.create(req.body);
//         res.status(201).json({
//           success: true,
//           data: createNewBootcampToDB
//         });
//     } catch (err) {
//         // res.status(400).json({ success: false });
//         next(err);
//     }
// };
exports.createNewBootcamp = asyncHandler(async (req, res, next) => {
      const createNewBootcampToDB = await BootcampSchema.create(req.body);
      res.status(201).json({
        success: true,
        data: createNewBootcampToDB
      });
});



// update existing bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
// exports.updateBootcamp = async (req, res, next) => {
//     try {
//         const bootcamp = await BootcampSchema.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         });
    
//         if(!bootcamp){
//             // return res.status(400).json({ success: false });
//             return next( new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404) );
//         }
    
//         res.status(200).json({ sucess: true, data: bootcamp });
//     } catch (err) {
//         next(err);
//     }
//   };
exports.updateBootcamp = asyncHandler(async(req, res, next) => {

      const bootcamp = await BootcampSchema.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
      });
  
      if(!bootcamp){
          // return res.status(400).json({ success: false });
          return next( new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404) );
      }
      res.status(200).json({ sucess: true, data: bootcamp });
});



// post and add bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
// exports.deleteBootcamp = async (req, res, next) => {
//     try {
//         const bootcamp = await BootcampSchema.findByIdAndDelete(req.params.id);

//         if (!bootcamp) {
//             // return res.status(400).json({ success: false });
//             return next( new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404) );
//         }

//         res.status(200).json({ success: true, data: {} });
        
//     } catch (err) {
//         next(err);
//     }
// };
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
      const bootcamp = await BootcampSchema.findByIdAndDelete(req.params.id);

      if (!bootcamp) {
          // return res.status(400).json({ success: false });
          return next( new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404) );
      }

      res.status(200).json({ success: true, data: {} });
});
