const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const user = require('../model/user');
const connection = require('../model/connection');
// ---------------------------------------------
const userDB = require('../model/db/userDB');
const connectionDB = require('../model/db/connectionDB');
const utilObjClass = require('../model/util/objClass');
const userProfileDB = require('../model/db/userProfileDB');
const userConnection = require('../model/userConnection');
const urlencodedParser = bodyParser.urlencoded({extended: false});
// ---------------------------------------------
const {check, validationResult} = require('express-validator');


var sessionInput = undefined;
async function sessionCheck(req, res, next) {
  sessionInput = undefined;
  var userSession = req.session.userSession;
  if(userSession!=undefined){
    const userDBObj = new userDB();
    let u = await userDBObj.getUser(userSession.userId);
    sessionInput = new user(u[0].userId,u[0].firstName,u[0].lastName,u[0].emailAddress,u[0].address1Field,u[0].address2Field, u[0].city, u[0].state, u[0].pinCode, u[0].country);
  }
  next();
}

router.get('/',sessionCheck, function(req,res){
  res.render('index', {session: sessionInput});
});

router.get('/login',sessionCheck, function(req,res){
  if(sessionInput==undefined){
    res.render('login',{session:undefined, errorMsg: new Array(), successMsg: new Array()});
  } else{
    res.render('index', {session: sessionInput});
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy(function (err) {
  if (err) {
    console.error("--> session destroy failed err -> ", err);
  }
  });
  res.render('index', {session: undefined});
});

router.get('/about',sessionCheck, function(req,res){
  res.render('about', {session: sessionInput});
});

router.get('/contact', sessionCheck, function(req,res){
  res.render('contactus', {session: sessionInput});
});

router.get('/newConnection', sessionCheck, function(req,res){
  if(sessionInput!=undefined){
    res.render('newConnection', {session: sessionInput, errorMsg:new Array()});
  } else{
    res.redirect('login');
  }
});

router.get('/connections', sessionCheck, async function(req, res) {
  const connectionDBObj = new connectionDB();
  const utilObjClassObj = new utilObjClass();
  let connectionsList = await connectionDBObj.getConnections();
  let categories = utilObjClassObj.getCategoriesList(connectionsList);
  res.render('connections', {connections:utilObjClassObj.getConnectionsObjList(connectionsList), categories:categories, session: sessionInput});
});

router.all('/connection', sessionCheck, async function(req, res){
  if(Object.keys(req.query).length != 0 && /^\d+$/.test(req.query.id)){
    let action = req.query.action;
    const connectionDBObj = new connectionDB();
    const connectionDetails = await connectionDBObj.getConnection(req.query.id);
    if(connectionDetails.getConnectionId == undefined){
      res.redirect('connections');
    } else {
      res.render('connection', {connection: connectionDetails, session: sessionInput, action:action ? action : 'save'});
    }
  } else{
    res.redirect('connections');
  }
});

router.get('/signup', sessionCheck, function (req, res) {
  res.render('signup',{session:undefined, errorMsg: new Array()});
})

const validation = [
  check('username', 'Username is should be alphanumeric').trim().not().isEmpty().isAlphanumeric(),
  check('firstname', 'Firstname is required').trim().not().isEmpty().escape(),
  check('lastname', 'Lastname is required').trim().not().isEmpty().escape(),
  check('email', 'Email is required').isEmail().normalizeEmail(),
  check('password').trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password didn\'t meet the criteria').escape(),
  check('password', 'Password  and confirm password doesn\'t match').custom((password, {req}) => password === req.body.confirm_password).escape(),
  check('address1Field', 'Address-1 Field is required').trim().not().isEmpty().escape(),
  check('city', 'City is required').trim().not().isEmpty().escape(),
  check('state', 'State is required').trim().not().isEmpty().escape(),
  check('zip').trim().not().isEmpty()
    .withMessage('Zip is required').isNumeric()
    .withMessage('Zip should be numeric').isLength({min:5})
    .withMessage('Zip should be of 5 numbers'),
  check('country', 'Country is required').trim().not().isEmpty().escape(),
];

async function handleValidationErrors(req, res, next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('signup',{session:undefined, errorMsg:errors.array()});
  } else{
    let usernameCheck = await new userDB().getUserByEmail(req.body.email);
    if(usernameCheck.length>0){
      if(req.body.username === usernameCheck[0].userId && req.body.email === usernameCheck[0].emailAddress){
        return res.render('signup',{session:undefined, errorMsg: new Array({msg:'Username and is already taken'})});
      } else if(req.body.email === usernameCheck[0].emailAddress){
        return res.render('signup',{session:undefined, errorMsg: new Array({msg:'Email is already used'})});
      } else {
        return res.render('signup',{session:undefined, errorMsg: new Array({msg:'Username is already used'})});
      }
    }
  }
  next()
}

router.post('/signup', urlencodedParser, validation, handleValidationErrors, /*sessionCheck,*/ async function(req, res){
  try{
    const userDBObj = new userDB();
    console.log('Signup form',req.body);
    const req_body = req.body;
    await userDBObj.createUser(new user(req_body.username, req_body.firstname,req_body.lastname,req_body.email,
      req_body.address1Field,req_body.address2Field,req_body.city,req_body.state,req_body.zip,req_body.country));
    await userDBObj.addUserCredentials(req_body.username, req_body.password);
    res.render('login',{session:undefined, errorMsg: new Array(), successMsg: new Array({msg:'Signed up successfully, please login'})});
  } catch(err){
    console.error(err);
  }
});

function conObjList(activeUserProfile){
  var activeConsList = [];
  activeUserProfile.userConnections.forEach(function(item) {
    const con = item.connection;
    let conObj = new connection(con.connectionId, con.connection_name, con.connection_category, con.details, con.dateAndTime, con.hostedBy, con.hostedBy, con.image);
    let userConObj = new userConnection(conObj, item.rsvp);
    activeConsList.push(userConObj);
  });
  return activeConsList;
}

router.post('/newConnection', urlencodedParser, [
  check('connection_name','Connection name should if minimum length 5 characters').trim().not().isEmpty().isLength({min:5}).escape(),
  check('connection_category','Connection Category should if minimum 2 characters').trim().not().isEmpty().isLength({min:2}).escape(),
  check('details').trim().not().isEmpty()
    .withMessage('Connection details is required').isLength({min:10})
    .withMessage('Connection details should be minimum 10 characters').escape(),
  check('dateAndTime').trim().not().isEmpty()
  .withMessage('Connection date and time is mandatory').isAfter(new Date().toString())
  .withMessage('Connection date and time should be future date').escape(),
  check('hostedBy','Connection hosted by is mandatory').trim().not().isEmpty().escape(),
  check('image').trim().escape()
],sessionCheck, async function(req, res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('newConnection',{session: sessionInput, errorMsg:errors.array()});
  } else{
    try{
      const connectionDBObj = new connectionDB();
      const userProfileDBObj = new userProfileDB();
      const connectionId = await connectionDBObj.getNewSequenceNumber();
      const req_body = req.body;
      const con = new connection(connectionId, req_body.connection_name, req_body.connection_category, req_body.details, req_body.dateAndTime, req_body.hostedBy, req_body.image);
      await connectionDBObj.saveConnection(sessionInput.getUserId, con);
  
      const activeUserProfileList = await userProfileDBObj.getUserProfile(sessionInput.userId);
      if(activeUserProfileList.length>0){
        await userProfileDBObj.addRSVP(sessionInput.getUserId, con, 'yes');
      } else{
        await userProfileDBObj.addNewUserProfile(sessionInput.userId, con, 'yes');
      }
  
      res.redirect('savedConnections');
    } catch(err){
      console.error(err);
    }
  }
});

module.exports = router;
