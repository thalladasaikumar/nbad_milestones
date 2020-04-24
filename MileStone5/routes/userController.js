const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const session = require('express-session');
const connection = require('../model/connection');
const userConnection = require('../model/userConnection');
const user = require('../model/user');
const userProfile = require('../model/userProfile');
const userProfileDB = require('../model/db/userProfileDB');
const connectionDB = require('../model/db/connectionDB');
const utilObjClass = require('../model/util/objClass');
const userDB = require('../model/db/userDB');

const urlencodedParser = bodyParser.urlencoded({extended: false});
let randomUser;
async function assignSession(req, res, next){
  let userProfileObj = undefined;
  const userDBObj = new userDB();
  if(req.session.userSession==undefined && req.body!=undefined){
    let u = await userDBObj.getUser(req.body.username);
    if(u.length>0){
      randomUser = new user(u[0].userId,u[0].firstName,u[0].lastName,u[0].emailAddress,u[0].address1Field,u[0].address2Field, u[0].city, u[0].state, u[0].pinCode, u[0].country);
      userProfileObj = new userProfile(randomUser.getUserId, new Array());
      req.session.userSession = userProfileObj;
    }
  } else if(req.session.userSession!=undefined){
    let u = await userDBObj.getUser(req.session.userSession.userId);
    randomUser = new user(u[0].userId,u[0].firstName,u[0].lastName,u[0].emailAddress,u[0].address1Field,u[0].address2Field, u[0].city, u[0].state, u[0].pinCode, u[0].country);
  }
  next();
}

function conObjList(activeUserProfile){
  var activeConsList = [];
  activeUserProfile.userConnections.forEach(function(item) {
    const con = item.connection;
    let conObj = new connection(con.connectionId, con.connection_name, con.connection_category, con.details, con.dateAndTime, con.hostedBy, con.hostedBy, con.image);
    let userConObj = new userConnection(conObj, item.rsvp);
    activeConsList.push(userConObj);
  });
  return activeConsList;
}

router.post('/login', urlencodedParser, assignSession, async function(req, res){
  try{
    if(req.session.userSession){
      res.redirect('savedConnections');
    } else{
      res.redirect('login');
    }
  } catch(err){
    console.error(err);
    res.redirect('login');
  }
});

router.post('/savedConnections*', urlencodedParser, assignSession, async function(req, res){
  try{
    const utilObjClassObj = new utilObjClass();
    const userProfileDBObj = new userProfileDB();
    const connectionDBObj = new connectionDB();
    const activeUserProfile = req.session.userSession;
    let activeUserProfileList = conObjList(activeUserProfile);
    let userProfileObj = new userProfile(randomUser.getUserId, activeUserProfileList);
    let action = req.query.action;
    if(!action){
      userProfileObj = await utilObjClassObj.stubProfilesToObj(activeUserProfile.userId);
      res.render('savedConnections', {session: randomUser, userProfileSession: userProfileObj});
    } else{
      var connid = req.query.id;
      var connectionResponse = req.body.response;
      if(action == 'save' || action == 'update' || action == 'delete'){
        const connectionDetails = await connectionDBObj.getConnection(req.query.id);
        if(action == 'save'){
          if(activeUserProfileList.length>0){
            let flag = false;
            for(let i=0; i<activeUserProfileList.length; i++){
              if(activeUserProfileList[i].getConnection.getConnectionId == connectionDetails.getConnectionId){
                await userProfileDBObj.updateExistingConn(activeUserProfile.userId, connectionDetails, connectionResponse);
                flag = true;
                break;
              }
            }
            if(!flag){
              await userProfileDBObj.addRSVP(activeUserProfile.userId, connectionDetails, connectionResponse);
            }
          }else{
            await userProfileDBObj.addNewUserProfile(activeUserProfile.userId, connectionDetails, connectionResponse);
          }

        } else if(action == 'update'){
          await userProfileDBObj.updateRSVP(activeUserProfile.userId, connectionDetails, connectionResponse);
        } else if(action == 'delete'){
          await userProfileDBObj.removeConnection(activeUserProfile.userId, connectionDetails);
        }
        userProfileObj = await utilObjClassObj.stubProfilesToObj(activeUserProfile.userId);
        req.session.userSession = userProfileObj;
        res.render('savedConnections',{session: randomUser, userProfileSession: userProfileObj});
      } else{
        res.redirect('connections');
      }
    }
  } catch(err){
    console.error(err);
  }

});

router.get('/savedConnections*',assignSession, async function (req, res) {
  var activeUserProfile = req.session.userSession;
  if(activeUserProfile==undefined){
    res.redirect('login');
  } else{
    const utilObjClassObj = new utilObjClass();
    const userProfileDBObj = new userProfileDB();
    const userProfileObj = await utilObjClassObj.stubProfilesToObj(activeUserProfile.userId);

    res.render('savedConnections', {session: randomUser, userProfileSession: userProfileObj});
  }
});

router.get('/*', function (req, res) {
  res.redirect('/');
});

module.exports = router;
