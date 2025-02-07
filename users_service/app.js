var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var cors = require('cors');

dotenv.config();

var app = express();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/admins', adminsRouter);

module.exports = app;
