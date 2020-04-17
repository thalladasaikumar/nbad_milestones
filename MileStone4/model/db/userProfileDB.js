const mongoose = require('mongoose');
const dbConnection = require('./dbConnection');

const userProfileModel = dbConnection.userProfileModel;

module.exports = class userProfileDB {

  /* creating New userProfile
  * Params: userId, conn, rsvp
  * return: ---
  */
  async addNewUserProfile(userId, conn, rsvp){
    return new Promise(async (resolve, reject) => {
      new userProfileModel({userId:userId, userConnection:[{connectionId:conn.getConnectionId, rsvp: rsvp}]}).save(function(err, data){
          if(err){
            console.error(err);
            reject('-----------');
          } else{
            resolve(data);
          }
        })
    });
  }

  /* Finding a userProfile
  * Params: userId
  * Return: promise Object
  */
  async getAUserProfile(userId){
    return new Promise(async (resolve, reject) => {
      userProfileModel.find({userId:userId},{userConnection:1}, function(err, data){
        if(err){
          console.error(err);
          reject('Couldn\'t get user profile');
        } else{
          resolve(data);
        }
      })
    });
  }

  /* Adding connection to user
  * Params: userId, connectionId, rsvp
  * return: ---
  */
  async addNewConnToUser(userId, conn, rsvp){
    return new Promise(async (resolve, reject) => {
      userProfileModel.updateOne({userId:userId, "userConnection.connectionId": {$ne: conn.getConnectionId}},
        {$push:{userConnection:{connectionId:conn.getConnectionId, rsvp: rsvp}}}, function(err, data){
          if(err){
            console.error(err);
            reject('-----------');
          } else{
            resolve(data);
          }
        })
    });
  }

  /* Updaing existing connection rsvp
  * Params: userId, connectionId, rsvp
  * return: ---
  */
  async updateExistingConn(userId, conn, rsvp){
    return new Promise(async (resolve, reject) => {
      userProfileModel.updateOne({userId:userId, "userConnection.connectionId":conn.getConnectionId},
      {$set:{"userConnection.$.rsvp":rsvp}}, function(err, data){
        if(err){
          console.error(err);
          reject('-----------');
        } else{
          resolve(data);
        }
      })
    });
  }

  /* Removing a connection from user profile
  * Params: userId, connection
  * return: ---
  */
  async removeConnFromUserProfile(userId, conn){
    return new Promise(async (resolve, reject) => {
      userProfileModel.updateOne({userId:userId},
      {$pull:{userConnection:{connectionId:conn.getConnectionId}}}, function(err, data){
        if(err){
          console.error(err);
          reject('-----------');
        } else{
          resolve(data);
        }
      })
    })
  }

  async getUserProfile(userId){
    try{
      let userProfileDetails = await this.getAUserProfile(userId);
      return userProfileDetails;
    } catch(err){
      error.console(err);
    }
  }

  async addRSVP(userId, conn, rsvp){
    try{
      let respo = await this.addNewConnToUser(userId, conn, rsvp);
    } catch(err){
      console.error(err);
    }
  }

  async updateRSVP(userId, conn, rsvp){
    try{
      let respo = await this.updateExistingConn(userId, conn, rsvp);
    } catch(err){
      console.error(err);
    }
  }

  async removeConnection(userId, conn){
    try{
      let respo = await this.removeConnFromUserProfile(userId, conn);
    } catch(err){
      console.error(err);
    }
  }
}
