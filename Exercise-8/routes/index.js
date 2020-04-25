var express = require('express');
var router = express.Router();
var courseDetails = require('./courseDetails.js');
var findAllCourses = require('../db/findAllCourses');

router.get('/', async function (req, res) {
  try{
    let findAllCoursesObj = new findAllCourses();
    let courList = await findAllCoursesObj.allCourses();
    var findCourseVal = req.query.courseidValue;
    if(findCourseVal!=undefined){
      let foundcoursList = await findAllCoursesObj.findCourse(findCourseVal);
      res.render('index', {hits: courseDetails.formPostCounter(), savedCourses:courList, foundCourses:foundcoursList });
    } else{
      res.render('index', {hits: courseDetails.formPostCounter(), savedCourses:courList, foundCourses:[] });
    }
  }catch(err){
    console.error(err);
  }
});

module.exports = router;
