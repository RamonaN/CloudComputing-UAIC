var createError = require('http-errors');
var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var bodyParser=require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

userController = require('./controllers/userController');


var usersRouter = require('./routes/users');
var books=require('./routes/books');
var blog=require('./routes/blog');
var publish=require('./routes/publish');
var publications=require('./routes/publications');
var blogpost=require('./routes/blogpost');
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());

app.use('/users', usersRouter);
app.use('/books', books);
app.use('/blog',blog);
app.use('/publisher', publish);
app.use('/publications', publications);
app.use('/blogpost', blogpost);

// error page 
app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.render('err.hbs'); 
})

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