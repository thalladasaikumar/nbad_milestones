var express = require('express');
var app = express();
var session = require('express-session');

app.use(session({secret: "secretID",
    resave: true,
    saveUninitialized: true}));

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use('/', require('./routes/controller'));
app.use('/', require('./routes/userController'));

app.listen(3000, function(){
  console.log('listening to port 3000');
});
