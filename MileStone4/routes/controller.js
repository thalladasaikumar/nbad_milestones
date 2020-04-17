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
const urlencodedParser = bodyParser.urlencoded({extended: false});
// ---------------------------------------------
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
    res.render('login',{session:undefined});
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
    res.render('newConnection', {session: sessionInput});
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
  res.render('signup',{session:undefined});
})

router.post('/createAccount', urlencodedParser, sessionCheck, async function(req, res){
  try{
    const userDBObj = new userDB();
    console.log('Signup form',req.body.username);
    const req_body = req.body;
    await userDBObj.createUser(new user(req_body.username, req_body.firstname,req_body.lastname,req_body.email,req_body.address1Field,req_body.address2Field,req_body.city,req_body.state,req_body.zip,req_body.country));
    res.redirect('login');
  } catch(err){
    console.error(err);
  }
});

router.post('/addConnection', urlencodedParser, sessionCheck, async function(req, res){
  try{
    const connectionDBObj = new connectionDB();
    const userProfileDBObj = new userProfileDB();
    const connectionId = await connectionDBObj.getNewSequenceNumber();
    const req_body = req.body;
    const con = new connection(connectionId, req_body.connection_name, req_body.connection_category, req_body.details, req_body.dateAndTime, req_body.hostedBy, req_body.image);
    await connectionDBObj.saveConnection(sessionInput.getUserId, con);
    await userProfileDBObj.addRSVP(sessionInput.getUserId, con, 'yes');
    res.redirect('savedConnections');
  } catch(err){
    console.error(err);
  }
});

module.exports = router;
