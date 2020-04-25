var express = require('express');
var app = express();
var session = require('express-session');
var mongoose = require('./db/dbConnection.js')
app.use(session({secret: "secretID"}));

var index = require('./routes/index.js');
var courseDetails = require('./routes/courseDetails.js');
app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.use('/courseDetails', courseDetails);

app.use('/*', index);

app.listen(8084);
