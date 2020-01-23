const BootcampSchema = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = {...req.query};

  //fields to exclude
  ['select'].forEach(param => delete reqQuery[param]);

  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );
  console.log(queryString);
  query = BootcampSchema.find(JSON.parse(queryString));

  //Select fields
  if(req.query.select) {
    const fieldsToFind = req.query.select.split(',');
    query = query.select(fieldsToFind);
  }

  //sort by fields
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootcampSchema.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //executing query
  const bootcamps = await query;
  // const bootcamps = await BootcampSchema.find();

  //pagination result
  const pagination = {};

  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
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
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
    );
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
  // add user to req.body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await BootcampSchema.findOne({ user: req.user.id });

  // if user is not admin, they can only add one bootcamp
  if(publishedBootcamp && req.user.role !== 'admin') {
    return next(new ErrorResponse(`the user with ID ${req.user.id} has already published a bootcamp`, 400));
  }
  
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
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!bootcamp) {
    // return res.status(400).json({ success: false });
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
    );
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
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
