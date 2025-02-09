var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openApiDocument = require('./openapi.json');

dotenv.config();

var app = express();

const postsRouter = require('./routes/posts');

const mongoURI = process.env.MONGO_URI;
//mongoose.set('debug', true);
mongoose.connect(mongoURI);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {customSiteTitle: "Posts Service"}));

app.use('/posts', postsRouter);

module.exports = app;
