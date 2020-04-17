var express = require('express');
var router = express.Router();

var connectionDB = require('../model/connectionDB');

router.get('/',function(req,res){
  res.render('index');
});

router.get('/about',function(req,res){
  res.render('about');
});

router.get('/contact',function(req,res){
  res.render('contactus');
});

router.get('/savedConnections',function(req,res){
  res.render('savedConnections', {savedConnections:connectionDB.getSavedConnections()});
});

router.get('/newConnection',function(req,res){
  res.render('newConnection');
});

router.get('/connections', function(req, res) {
  var myConnections = connectionDB.getConnections();
  res.render('connections', {connections:myConnections, categories:connectionDB.categories()});
});

router.get('/connection', function(req, res){
  if(Object.keys(req.query).length != 0){
    var connectionDetails = connectionDB.getConnection(req.query.id);
    if(connectionDetails.connectionId == undefined){
      var myConnections = connectionDB.getConnections();
      res.render('connections', {connections:myConnections, categories:connectionDB.categories()});
    } else{
      res.render('connection', {connection: connectionDetails});
    }
  } else{
    res.render('connections', {connections:connectionDB.getConnections(), categories:connectionDB.categories()});
  }
});

module.exports = router;
