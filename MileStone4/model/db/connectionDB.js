const mongoose = require('mongoose');
const dbConnection = require('./dbConnection');
const connection = require('../connection');

const connectionModel = dbConnection.connectionModel;


module.exports = class ConnectionDB {

  /* Find all Connections from db
  * Params: -----
  * Return: connections List
  */
  async getAllConnections(){
    return new Promise(async (resolve, reject) => {
      connectionModel.find({}, function (err, connectionsList) {
        if(err) {
          console.error(err);
          reject('Could not find user details');
        } else{
          resolve(connectionsList);
        }
      })
    })
  }

  /* Find a Connection from db
  * Params: connectionId
  * Return: connection
  */
  async getAConnection(connectionId){
    return new Promise(async (resolve, reject) => {
      connectionModel.find({connectionId: connectionId}, function (err, connectionDB) {
        if(err) {
          console.error(err);
          reject('Could not find user details');
        } else{
          resolve(connectionDB);
        }
      })
    });
  }

  /* create new connection or update existing connecction
  * Params: userId, connection_obj
  * return: ---
  */
  async createOrUpdateConnection(userId, connection){
    return new Promise(async (resolve, reject) => {
      new connectionModel(
        {userId: userId, connectionId: connection.getConnectionId, connection_name: connection.getConnection_name,
          connection_category: connection.getConnection_category, details: connection.getDetails, dateAndTime: connection.getDateAndTime,
          hostedBy: connection.getHostedBy, image: connection.getImage})
          .save(function (err, data) {
            if(err){
              console.error(err);
              reject('Couldn\'t save connection');
            } else{
              resolve(data);
            }
        })
    });
  }

  /* Get next Sequence number
  * Param: ----
  * Return : sequenceNumber
  */
  async getSequenceNumber(){
    return new Promise(async (resolve, reject) => {
      connectionModel.find({}, {connectionId:1}, function (err, data) {
        if(err){
          console.error(err);
          reject('Couldn\'t find sequence number');
        } else{
          resolve(data);
        }
      }).sort({connectionId:-1}).limit(1);
    });
  }

  async getConnections(){
    try{
      let connectionsList = await this.getAllConnections();
      return connectionsList;
    } catch(err){
      console.error(err);
    }
  }

  async getConnection(connectionId){
    try{
      let connectionDB = await this.getAConnection(connectionId);
      if(connectionDB.length>0){
        return new connection(connectionDB[0].connectionId, connectionDB[0].connection_name, connectionDB[0].connection_category, connectionDB[0].details, connectionDB[0].dateAndTime, connectionDB[0].hostedBy, connectionDB[0].image);
      } else{
        return new connection();
      }

    } catch(err){
      console.error(err);
    }
  }

  async saveConnection(userId, connection){
    try{
      await this.createOrUpdateConnection(userId, connection);
    } catch(err){
      console.error(err);
    }
  }

  async getNewSequenceNumber(){
    try{
      let list = await this.getSequenceNumber();
      if(list.length!=0){
        return list[0].connectionId+1;
      } else{
        return 1001;
      }
    } catch(err){
      console.error(err);
    }
  }

}
