const mongoose = require('mongoose');
const dbConnection = require('./dbConnection');
const userModel = dbConnection.userModel;
const userPasswordModel = dbConnection.userPasswordModel;
const bcrypt = require('bcrypt');
const saltRounds = Math.floor(Math.random()*10);

module.exports = class UserInfo{
  constructor(){} //default constructor

  /* Find all users from db
  * Params: -----
  * Return: usersList
  */
  async getAllUsers(){
    return new Promise(async (resolve, reject) => {
      userModel.find({}, function (err, usersList) {
        if(err) {
          console.error(err);
          reject('Could not find user details');
        } else{
          resolve(usersList);
        }
      })
    });
  }

  /* find a user
  * Param: userId or username
  * Return: user
  */
  async getAUser(userId){
    return new Promise(async (resolve, reject) => {
      userModel.find({userId:userId}, function (err, userDetails) {
        if(err) {
          console.error(err);
          reject('Could not find user details');
        } else{
          resolve(userDetails);
        }
      })
    });
  }

  /* Saving User details to DB
  * Param: user
  * return: --
  */
  async saveUsertoDB(user){
    return new Promise(async (resolve, reject) => {
      new userModel(
        {userId:user.getUserId,firstName:user.getFirstName,lastName:user.getLastName,emailAddress:user.getEmailAddress,
          address1Field:user.getAddress1Field,address2Field:user.getAddress2Field,city:user.getCity,state:user.getState,pinCode:user.getPinCode,country:user.getCountry})
          .save(function (err, data) {
            if (err) {console.error(err);
              reject('Could not save user');
            } else {
              resolve(data);
            }
          });
        });
  }

  async getUsers(){
    try{
      let usersList = await this.getAllUsers();
      return usersList;
    } catch (err){
      console.error(err);
    }
  }

  async getUser(userId){
    try{
      let userDetails = await this.getAUser(userId);
      return userDetails;
    } catch(err){
      console.error(err);
    }
  }

  async createUser(user){
    try{
      await this.saveUsertoDB(user);
    } catch(err){
      console.error(err);
    }
  }

  async validateUser(username, password){
    try{
      return new Promise(async (resolve, reject) => {
        userPasswordModel.find({username:username},async function (err, data){
          if(err){
            reject(err);
          } else if(data.length>0){
            let compared = await bcrypt.compare(password, data[0].password);
            console.log('Compare:',compared)
            if(compared){
              resolve(data);
            } else{
              reject(err);
            }
          } else{
            reject(err);
          }
        });
      })
    }
    catch (err){
      console.err(err);
    }
  }

  async getUserByEmail(email){
    try{
      return new Promise(async (resolve, reject) =>{
        userModel.find({emailAddress:email}, function(err, data){
          if(err){
            reject(err);
          } else{
            resolve(data);
          }
        })
      })
    } catch(err){
      console.error(err);
    }
  }

  async addUserCredentials(username, password){
    try{
      let hash = await bcrypt.hash(password,saltRounds);
      return new Promise(async (resolve, reject) => {
        new userPasswordModel({username:username, password:hash}).save(function (err, data){
          if(err){
            reject(err);
          } else{
            resolve(data);
          }
        });
      });
    } catch(err){
      console.error(err);
    }
  }
}
