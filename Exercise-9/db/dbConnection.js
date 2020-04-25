var courseClass = require('../models/course');
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/Courses';

var courseModel;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));


  db.on('connected', function(){
    console.log("Mongoose default connection is open to ", url);
  });
  var courseSchema = new mongoose.Schema({
      code : String,
      title : String,
      instructor : String,
      term : String,
      startTime : String,
      endTime : String,
      email : String
  });

  courseModel = mongoose.model('courses', courseSchema);

module.exports.courseModel = courseModel;
