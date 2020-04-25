var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var course = require('../models/course');

router.get('/', function(req, res){
  if (req.session.theCourse == null) {
    res.render('index');
  } else {
        var course = req.session.theCourse;
        res.render('details', {course: course});
  }
});
router.post('/', urlencodedParser, function(req, res){
  console.log(req.body);
  var courseObj = new course(req.body.courseId, req.body.title, req.body.term, req.body.instructor);
  req.session.theCourse = courseObj;
  res.render('details', {course: courseObj});
});

module.exports = router;
