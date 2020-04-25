var express = require('express');

var app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

var course = require('./routes/courseDetails.js');
var index = require('./routes/index.js');

app.use('/coursedetails',course);
app.use('/*', index);

app.listen(8084, function(){
  console.log('Listening port 8084');
});
