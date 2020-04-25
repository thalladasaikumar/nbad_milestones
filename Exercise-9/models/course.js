module.exports = class course{
  constructor(courseId, title, term, instructor, startTime, endTime, email){
    this.courseId = courseId;
    this.title = title;
    this.term = term;
    this.instructor = instructor;
    this.startTime = startTime;
    this.endTime = endTime;
    this.email = email;
    }
}
