const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// load env vars
dotenv.config({ path: './config/config.env'});

const app = express();

//middleware for logging dev
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

//routing files
const bootcampsRoutes = require('./routes/bootcamps');

//mount routers
app.use('/api/v1/bootcamps', bootcampsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is running on ${process.env.NODE_ENV} mode on port ${PORT}`));
