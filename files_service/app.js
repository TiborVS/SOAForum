var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose')
var cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openApiDocument = require('./openapi.json');

dotenv.config();

var app = express();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

var imagesRouter = require('./routes/images');
var textRouter = require('./routes/text');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/images', imagesRouter);
app.use('/text', textRouter);

module.exports = app;
