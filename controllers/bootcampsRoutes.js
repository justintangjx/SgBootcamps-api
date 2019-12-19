// get all bootcamps
// @route GET /api/v1/bootcamps
// @access public 
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'display all bootcamps' });
}

// get all bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getUniqueBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `show bootcamp ID ${req.params.id}` });
}

// post and add new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createNewBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'create and add new bootcamp'});
}

// update existing bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `update bootcamp ID ${req.params.id}`});
}

// post and add bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `delete bootcamp ID ${req.params.id}` });
}
