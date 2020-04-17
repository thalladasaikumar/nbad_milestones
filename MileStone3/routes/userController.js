var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
var connection = require('../model/connection');
var userConnection = require('../model/userConnection');
var user = require('../model/user');
var connectionDB = require('../model/connectionDB');
var userProfileClass = require('../model/userProfile');

var urlencodedParser = bodyParser.urlencoded({extended: false});
var randomUser;
function assignSession(req, res, next){
  var userProfileObj = undefined;
  randomUser = new user('sthallad@uncc.edu','Sai Kumar','Thallada','sthallad@uncc.edu','Creek Drive','Apt#B','Charlotte','NC',28262,'US');
  if(!req.session.userSession){
      userProfileObj = new userProfileClass(randomUser.getUserId, new Array());
      req.session.userSession = userProfileObj;
  }
  next();
}

function conObjList(activeUserProfile){
  var activeConsList = [];
  activeUserProfile.userConnections.forEach(function(item) {
    var con = item.connection;
    var conObj = new connection(con.connectionId, con.connection_name, con.connection_category, con.details, con.dateAndTime, con.hostedBy, con.hostedBy, con.image);
    var userConObj = new userConnection(conObj, item.rsvp);
    activeConsList.push(userConObj);
  });
  return activeConsList;
}

router.post('/savedConnections*', urlencodedParser, assignSession, function(req, res){
  var activeUserProfile = req.session.userSession;
  var list = conObjList(activeUserProfile);
  var userProfileObj = new userProfileClass(randomUser.getUserId, list);
  var action = req.query.action;
  if(!action){
    res.render('savedConnections', {session: randomUser, userProfileSession: userProfileObj});
  } else{
    var connid = req.query.id;
    var connectionResponse = req.body.response;
    console.log('abcdv: ',req.body.viewConnection);
    if(req.body.viewConnection==connid && (action == 'save' || action == 'update')){
      if(action == 'save'){
        userProfileObj.addConnection(connectionDB.getConnection(connid), connectionResponse);
      } else if(action == 'update'){
        userProfileObj.updateConnection(connectionDB.getConnection(connid), connectionResponse);
      }
      req.session.userSession = userProfileObj;
      res.render('savedConnections',{session: randomUser, userProfileSession: userProfileObj});
    } else if(action == 'delete'){
      userProfileObj.removeConnection(connectionDB.getConnection(connid));
      req.session.userSession = userProfileObj;
      res.render('savedConnections',{session: randomUser, userProfileSession: userProfileObj});
    } else{
      res.redirect('connections');
    }
  }
});

router.get('/savedConnections*',assignSession, function (req, res) {
  var activeUserProfile = req.session.userSession;
  if(activeUserProfile==undefined){
    res.redirect('login');
  } else{
    var list = conObjList(activeUserProfile);
    var userProfileObj = new userProfileClass(randomUser.getUserId, list);
    res.render('savedConnections', {session: randomUser, userProfileSession: userProfileObj});
  }
});

router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
