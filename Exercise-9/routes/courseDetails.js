var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var findAllCourses = require('../db/findAllCourses');
var dbConnection = require('../db/dbConnection');
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const {check, validationResult} = require('express-validator');

var course = require('../models/course');

var count = 0;
function counter(req, res, next){
  count+=1;
  next();
}

router.get('/ajsfafk', async function(req, res){
  try{
    console.log('body value:',req.body.courseidValue);
    let findAllCoursesObj = new findAllCourses();
    let courInfo = await findAllCoursesObj.allCourses();
    if (req.session.theCourse == null) {
      res.render('index', {hits: count, savedCourses:courInfo, foundCourses:foundcoursList, errorMsg:new Array()});
    } else {
          var course = req.session.theCourse;
          res.render('details', {course: course});
    }
  }catch(err){
    console.error(err);
  }
});
router.post('/', urlencodedParser, [
  check('courseId','Enter valid number for courseId').isNumeric(),
  check('title', 'Enter Alphanumeric values for course title').not().isEmpty().trim().escape(),
  check('term', 'Enter Alphanumeric values for course term').not().isEmpty().trim().escape(),
  check('instructor', 'Enter Alphanumeric values for instructor name').not().isEmpty().trim().escape(),
  check('email', 'Invalid email Address').isEmail().normalizeEmail(),
  check('endTime').custom((endTime, {req}) => endTime>req.body.startTime).withMessage('Make sure end time is after start time'),
  check('startTime').custom((startTime, {req}) => startTime<req.body.endTime).withMessage('Make sure start time is before end time')
], counter, async function(req, res, next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('index', {hits: count, savedCourses:new Array(), foundCourses:new Array(), errorMsg: errors.array()});
  }
  let findAllCoursesObj = new findAllCourses();
  try{
    let courInfo = await findAllCoursesObj.allCourses();
      var courseObj = new course(req.body.courseId, req.body.title, req.body.term, req.body.instructor, req.body.startTime, req.body.endTime, req.body.email);
      req.session.theCourse = courseObj;
      let saveCourse = await findAllCoursesObj.saveCourse(courseObj);
      res.render('details', {course: courseObj});
  }catch(err){
    console.error(err);
  }
});

module.exports = router;
module.exports.formPostCounter = function(){
  return count;
}
