var mongoose = require('mongoose');
var courseModel = require('./dbConnection');

module.exports = class coursesInfo{
  constructor(){
  }
  // finding all the courses
  async getCourses () {
    return new Promise(async (resolve, reject)=> {
      courseModel.courseModel.find({}, function(err, courses){
        if (err) {console.error(err);
          reject('Could not find any goal');
        } else {
          resolve(courses);
        };
      });
    });
  }
  //finding one course
  async getCourse (courseId) {
    return new Promise(async (resolve, reject)=> {
      courseModel.courseModel.find({code:{$regex:"^"+courseId}}, function(err, courses){
        if (err) {console.error(err);
          reject('Could not find any goal');
        } else {
          resolve(courses);
        };
      });
    });
  }
  //saving course to db
  async saveCourseToDB (course, duplicateId) {
      if(duplicateId.length>0){
        return new Promise(async (resolve, reject)=> {
          courseModel.courseModel.findByIdAndUpdate(duplicateId[0]._id,
            {code:course.courseId, title:course.title, term:course.term, instructor:course.instructor},
            function(err, data){
            if (err) {console.error(err);
              reject('Could not find any goal');
            } else {
              resolve(data);
            }
          });
        });
      }else{
        return new Promise(async (resolve, reject)=> {
          new courseModel.courseModel({code:course.courseId, title:course.title, term:course.term, instructor:course.instructor}).save( function(err, data){
            if (err) {console.error(err);
              reject('Could not find any goal');
            } else {
              resolve(data);
            }
          });
        });
      }
  }
  //finding duplicates
  async findDuplicates(course){
    return new Promise(async (resolve, reject)=>{
      courseModel.courseModel.find({code:course.courseId, term:course.term, instructor:course.instructor}, {'_id':1}, function(err, data){
        if(err){
          console.error(err);
          reject('Could not find any goal');
        } else{
          resolve(data);
        }
      });
    });
  }

  async allCourses(){
    try{
      var savedCourseList = await this.getCourses();
      return savedCourseList;
    } catch(err){
      console.error(err);
    }
  }

  async findCourse(courseId){
    try{
      let savedCourseList=[];
      if(courseId){
        savedCourseList = await this.getCourse(courseId);
      }
      return savedCourseList;
    } catch(err){
      console.error(err);
    }
  }

  async saveCourse(course){
    try{
      let duplicateId = await this.findDuplicates(course);
      console.log('findDuplicates:',duplicateId)
      await this.saveCourseToDB(course, duplicateId);
      console.log('saved!!!');
    }catch(err){
      console.error(err);
    }
  }
}
