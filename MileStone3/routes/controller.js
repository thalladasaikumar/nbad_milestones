var express = require('express');
var router = express.Router();
var connectionDB = require('../model/connectionDB');
var user = require('../model/user');

var sessionInput = undefined;

function sessionCheck(req, res, next) {
  sessionInput = undefined;
  var userSession = req.session.userSession;
  if(userSession!=undefined){
    sessionInput = new user('sthallad@uncc.edu','Sai Kumar','Thallada','sthallad@uncc.edu','Creek Drive','Apt#B','Charlotte','NC',28262,'US');
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

router.get('/connections', sessionCheck, function(req, res) {
  var myConnections = connectionDB.getConnections();
  res.render('connections', {connections:myConnections, categories:connectionDB.categories(), session: sessionInput});
});

router.all('/connection', sessionCheck, function(req, res){
  if(Object.keys(req.query).length != 0){
    var connectionDetails = connectionDB.getConnection(req.query.id);
    if(connectionDetails.connectionId == undefined){
      var myConnections = connectionDB.getConnections();
      res.redirect('connections');
    } else{
      res.render('connection', {connection: connectionDetails, session: sessionInput});
    }
  } else{
    res.redirect('connections');
  }
});

module.exports = router;
