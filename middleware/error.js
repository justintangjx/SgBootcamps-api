const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message;

    //log to console
    console.log(err);

    //Mongoose bad objectID
    if(err.name === 'CastError'){
        const message = `Resource not found with ID of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key ie submitting the same entry
    if(err.code === 11000) {
        const message = 'Duplicate field value entered or identical submission';
        error = new ErrorResponse(message, 400);
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    });
}

module.exports = errorHandler;
