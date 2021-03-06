var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/nbad';

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true}); //Establishing new connection to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.on('connected', function(){
  console.log("Mongoose connection is open to ", url);
});

// User Schema
const userSchema = new mongoose.Schema({
  userId:String,
  firstName:String,
  lastName:String,
  emailAddress:String,
  address1Field:String,
  address2Field:String,
  city:String,
  state:String,
  pinCode:Number,
  country:String
});

// Connection Schema
const connectionSchema = new mongoose.Schema({
  userId: String,
  connectionId : Number,
  connection_name : String,
  connection_category : String,
  details : String,
  dateAndTime : String,
  hostedBy : String,
  image : String
});

//UserProfile Schema
const userProfileSchema = new mongoose.Schema({
  userId: String,
  userConnection:[
    {
      connectionId: Number,
      rsvp: String
    }
  ]
});

const userModel = mongoose.model('user', userSchema); //Model for User
const connectionModel = mongoose.model('connections', connectionSchema); //Model for Connection
const userProfileModel = mongoose.model('userprofile', userProfileSchema); //Model for User Profile

module.exports.userModel = userModel;
module.exports.connectionModel = connectionModel;
module.exports.userProfileModel = userProfileModel;
