var express = require('express');
var app = express();
var session = require('express-session');

var helmet = require('helmet') //Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet())

var cookieParser = require('cookie-parser');
var csrf = require('csrf'); //Use csurf middleware to protect against cross-site request forgery (CSRF).... always pass csrf token to the view req.csrfToken()
var csrfProtection = csrf({ cookie: true }); // use this for reference 'https://www.npmjs.com/package/csurf'
// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

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
