var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

var controller = require('./routes/controller');
app.use('/',controller);

app.listen(2000, function(){
  console.log('listening to port 2000')
});
