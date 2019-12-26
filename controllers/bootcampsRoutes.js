const BootcampSchema = require("../models/Bootcamp");

// get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
// exports.getBootcamps = (req, res, next) => {
//     res.status(200).json({ success: true, msg: 'display all bootcamps' });
// }
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootcampSchema.find();

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps  });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// get all bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
// exports.getUniqueBootcamp = (req, res, next) => {
//     res.status(200).json({success: true, msg: `show bootcamp ID ${req.params.id}` });
// }

exports.getUniqueBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampSchema.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// post and add new bootcamp
// @route POST /api/v1/bootcamps
// @access private
// exports.createNewBootcamp = (req, res, next) => {
//     res.status(200).json({ success: true, msg: 'create and add new bootcamp'});
// }
exports.createNewBootcamp = async (req, res, next) => {
  const createNewBootcampToDB = await BootcampSchema.create(req.body);
  res.status(201).json({
    success: true,
    data: createNewBootcampToDB
  });
};

// update existing bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
// exports.updateBootcamp = (req, res, next) => {
//   res
//     .status(200)
//     .json({ success: true, msg: `update bootcamp ID ${req.params.id}` });
// };
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await BootcampSchema.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        if(!bootcamp){
            return res.status(400).json({ success: false });
        }
    
        res.status(200).json({ sucess: true, data: bootcamp });
    } catch (err) {
        res.status(400).json({ success: false });
    }
  };

// post and add bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await BootcampSchema.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false }); 
        }

        res.status(200).json({ success: true, data: {} });
        
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
