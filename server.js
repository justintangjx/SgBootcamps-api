const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');

// load env vars
dotenv.config({ path: './config/config.env'});

// connect to DB
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// middleware for logging dev
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// sanitize login data to prevent no-sql injection with operator
app.use(mongoSanitize());

// routing files
const bootcampsRoutes = require('./routes/bootcamps');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const reviewsRoutes = require('./routes/reviews');

// mount routers
app.use('/api/v1/bootcamps', bootcampsRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reviews', reviewsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server is running on ${process.env.NODE_ENV} mode on port ${PORT}`));

// global handler to handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERRORSERVER: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));
});
