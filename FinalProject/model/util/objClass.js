const connection = require('../connection');
const userConnection = require('../userConnection');
const user = require('../user.js');
const userProfileDB = require('../db/userProfileDB');
const connectionDB = require('../db/connectionDB');
const userProfile = require('../userProfile');

module.exports = class objExportClass{
  constructor(){}

  /* Connections Array List to ConnectionObj list
  * Params: connectionList
  * Returns: connectionsObjList
  */
  getConnectionsObjList(connectionsList){
    let connectionsObjList= [];
    connectionsList.forEach(function(item){
      connectionsObjList.push(new connection(item.connectionId, item.connection_name, item.connection_category, item.details, item.dateAndTime, item.hostedBy));
    });
    return connectionsObjList;
  }

  /* User array list to UserObj list
  * Params: userList
  * Returns: usersObjList
  */
  getUsersObjList(userList){
    let usersObjList= [];
    userList.forEach(function(item){
      usersObjList.push(new user(item.userId,item.firstName,item.lastName,item.emailAddress,item.address1Field,item.address2Field,item.city,item.state,item.pinCode,item.country));
    });
    return connectionsObjList;
  }

  /* geting Categories from connections list
  * Param: connections list
  * Returns: categoriesList
  */
  getCategoriesList(connectionsList){
    let topics = [];
    connectionsList.forEach(function(item){
      if(!topics.includes(item.connection_category)){
        topics.push(item.connection_category);
      }
    });
    return topics;
  }

  /* Stubbing all connections from db to userProfileObj
  * Params: userId
  * return: userProfileObj
  */
  async stubProfilesToObj(userId){
    const userProfileDBObj = new userProfileDB();
    const connectionDBObj = new connectionDB();
    let list = await userProfileDBObj.getUserProfile(userId);
    let userConnectionList = new Array();
    if(list.length>0){
      let userConList = list[0].userConnection;
      for(let i=0; i<userConList.length;i++){
        let con = await connectionDBObj.getConnection(userConList[i].connectionId);
        userConnectionList.push(new userConnection(new connection(con.connectionId, con.connection_name, con.connection_category, con.details, con.dateAndTime, con.hostedBy, con.image),userConList[i].rsvp));
      }
    }
    return new userProfile(userId, userConnectionList);
  }
}
