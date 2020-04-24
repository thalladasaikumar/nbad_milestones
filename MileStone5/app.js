var express = require('express');
var app = express();
var session = require('express-session');
app.set('trust proxy',1);
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
    }
  }
));

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use('/', require('./routes/controller'));
app.use('/', require('./routes/userController'));

app.listen(3000, function(){
  console.log('listening to port 3000');
});
