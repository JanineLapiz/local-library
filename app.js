var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// import mongoose
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/*--------------------------MONGOOSE------------------------*/
// set up default mongoose connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});
// get the default connection
var db = mongoose.connection;
// bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// define schema
var Schema = mongoose.Schema;
var librarySchema = new Schema(
  {
    name: String,
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, default: Date.now() },
    age: { type: Number, min: 18, max: 65, required: true },
    mixed: Schema.Types.Mixed,
    _bookId: Schema.Types.ObjectId,
    array: [],
    ofString: [String],   // an array of strings
    nested: { stuff}
  }
);

/*--------------------------MONGOOSE------------------------*/



// view engine setup
app.set('views', path.join(__dirname, 'views')); //perhaps you may try joining these two like so:
app.set('view engine', 'pug');					 //app.use({'views': `__dirname/views`, 'view-engine': 'pug'});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
