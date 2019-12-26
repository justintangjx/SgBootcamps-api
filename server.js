const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env'});

// connect to DB
connectDB();

const app = express();
app.use(express.json());

// middleware for logging dev
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// routing files
const bootcampsRoutes = require('./routes/bootcamps');

// mount routers
app.use('/api/v1/bootcamps', bootcampsRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server is running on ${process.env.NODE_ENV} mode on port ${PORT}`));

// global handler to handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));
});
 