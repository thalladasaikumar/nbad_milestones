module.exports = class connection{
  constructor(connectionId, connection_name, connection_category, details, dateAndTime, hostedBy, image){
    this.connectionId = connectionId;
    this.connection_name = connection_name;
    this.connection_category = connection_category;
    this.details = details;
    this.dateAndTime = dateAndTime;
    this.hostedBy = hostedBy;
    this.image = image;
  }
  get getConnectionId(){
    return this.connectionId;
  }
  set setConnectionId(connectionId){
    this.connectionId = connectionId;
  }
  get getConnection_name(){
    return this.connection_name;
  }
  set setConnection_name(connectionName){
    this.connection_name = connectionName;
  }
  get getConnection_category(){
    return this.connection_category;
  }
  set setConnection_category(connectionCategory){
    this.connection_category=connectionCategory;
  }
  get getDetails(){
    return this.details;
  }
  set setDetails(details){
    this.details=details;
  }
  get getDateAndTime(){
    return this.dateAndTime;
  }
  set setDateAndTime(dateAndTime){
    this.dateAndTime = dateAndTime;
  }
  get getHostedBy(){
    return this.hostedBy;
  }
  set setHostedBy(hostedBy){
    this.hostedBy = hostedBy;
  }
  get getImage(){
    return this.image;
  }
  set setImage(image){
    this.image = image;
  }
}
