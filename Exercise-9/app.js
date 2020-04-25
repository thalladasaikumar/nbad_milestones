var express = require('express');
var app = express();
var session = require('express-session');
var mongoose = require('./db/dbConnection.js')
let expiryTime = new Date(Date.now() + 60*60*1000) //1 hour
app.use(session(
  {
    secret: "xYab32",
    name: 'sessionId',
    resave: true,
    saveUninitialized: true,
    cookie:{
      httpOnly: true,
      expires: expiryTime
    },
    useUnifiedTopology: true
  }
));

var index = require('./routes/index.js');
var courseDetails = require('./routes/courseDetails.js');

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.use('/courseDetails', courseDetails);

app.use('/*', index);

app.listen(8084);
