var userConnectionObj = require('./userConnection.js');
var connectionDB = require('./connectionDB.js');
var connection = require('./connection.js');

module.exports = class userProfile{
  constructor(userId, connectionslist){
    this.userId=userId;
    this.userConnections=connectionslist;
  }

  addConnection(con, rsvp){
    var addingConnectionsList = [];
    var added = false;
    if(this.getConnectionsList() == undefined || this.getConnectionsList().length == 0){
      addingConnectionsList.push(new userConnectionObj(con, rsvp));
    } else {
        var activeUserConnectionsList = this.getConnectionsList();
        var i = 0;
        for(i=0;i<activeUserConnectionsList.length;i++){
          if(activeUserConnectionsList[i].getConnection.getConnectionId == con.getConnectionId){
            addingConnectionsList.push(this.updateConnection(activeUserConnectionsList[i], rsvp));
            added = true;
          } else{
              addingConnectionsList.push(activeUserConnectionsList[i]);
          }
        }
      if(!added){
          addingConnectionsList.push(new userConnectionObj(con, rsvp));
      }
    }
    this.setConnectionsList(addingConnectionsList);
  }

  updateConnection(toBeUpdatedUserCon, rsvp){
    toBeUpdatedUserCon.rsvp = rsvp;
    return toBeUpdatedUserCon;
  }

  removeConnection(connection){
    var activeUserConnList = this.getConnectionsList();
    this.setConnectionsList(activeUserConnList.filter(con => con.getConnection.getConnectionId!=connection.getConnectionId));
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
