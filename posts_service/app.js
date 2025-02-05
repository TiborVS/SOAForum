var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

dotenv.config();

var app = express();

const postsRouter = require('./routes/posts');

const mongoURI = process.env.MONGO_URI;
//mongoose.set('debug', true);
mongoose.connect(mongoURI);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/posts', postsRouter);

module.exports = app;
