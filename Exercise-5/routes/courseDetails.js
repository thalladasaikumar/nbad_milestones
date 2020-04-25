var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');

var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var course = require('../models/course');

var count = 0;
function counter(req, res, next){
  count+=1;
  // console.log(count,' : times the post called.');
  next();
}

router.get('/', function(req, res){
  if (req.session.theCourse == null) {
    res.render('index', {hits: count});
  } else {
        var course = req.session.theCourse;
        res.render('details', {course: course});
  }
});
router.post('/', urlencodedParser, counter, function(req, res, next){
  // console.log(req.body);
  if(req.body.courseId=='' || req.body.title=='' || req.body.term=='' || req.body.instructor==''){
    res.render('index', {hits: count});
  }else{
    var courseObj = new course(req.body.courseId, req.body.title, req.body.term, req.body.instructor);
    req.session.theCourse = courseObj;
    res.render('details', {course: courseObj});
  }
});

module.exports = router;
module.exports.formPostCounter = function(){
  return count;
}
