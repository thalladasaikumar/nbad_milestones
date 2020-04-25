var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var findAllCourses = require('../db/findAllCourses');
var dbConnection = require('../db/dbConnection');
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var course = require('../models/course');

var count = 0;
function counter(req, res, next){
  count+=1;
  next();
}

router.get('/', async function(req, res){
  try{
    console.log('body value:',req.body.courseidValue);
    let findAllCoursesObj = new findAllCourses();
    let courInfo = await findAllCoursesObj.allCourses();
    if (req.session.theCourse == null) {
      res.render('index', {hits: count, savedCourses:courInfo});
    } else {
          var course = req.session.theCourse;
          res.render('details', {course: course});
    }
  }catch(err){
    console.error(err);
  }
});
router.post('/', urlencodedParser, counter, async function(req, res, next){
  let findAllCoursesObj = new findAllCourses();
  try{
    let courInfo = await findAllCoursesObj.allCourses();
    if(req.body.courseId=='' || req.body.title=='' || req.body.term=='' || req.body.instructor==''){
      res.render('index', {hits: count, savedCourses:courInfo});
    }else{
      var courseObj = new course(req.body.courseId, req.body.title, req.body.term, req.body.instructor);
      req.session.theCourse = courseObj;
      let saveCourse = await findAllCoursesObj.saveCourse(courseObj);
      res.render('details', {course: courseObj});
    }
  }catch(err){
    console.error(err);
  }
});

module.exports = router;
module.exports.formPostCounter = function(){
  return count;
}
