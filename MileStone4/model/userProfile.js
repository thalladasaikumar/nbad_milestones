var userConnectionObj = require('./userConnection.js');
var connection = require('./connection.js');

module.exports = class userProfile{
  constructor(userId, connectionslist){
    this.userId=userId;
    this.userConnections=connectionslist;
  }

  getConnectionsList(){
    return this.userConnections;
  }
  setConnectionsList(conList){
    this.userConnections = conList;
  }

  get getUserId(){
    return this.userId;
  }
}
