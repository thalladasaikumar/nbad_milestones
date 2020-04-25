
var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
  console.log(Object.keys(req.query).length);
  if(Object.keys(req.query).length == 0){
      res.render('nocourse');
  }
  else{
    var course = require('../models/course');
    var courseQuery = new course(req.query.courseID, req.query.title, req.query.term, req.query.instructor);
    res.render('details', {course:courseQuery});
  }
});
module.exports = router;
