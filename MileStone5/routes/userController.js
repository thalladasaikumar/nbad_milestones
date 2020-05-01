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
const dbConnection = require('../model/db/dbConnection');
//--------------------------------
const {check, validationResult} = require('express-validator');
//--------------------------------
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

const validation = [
  check('username').trim().not()
    .isEmpty().withMessage('username is required')
    .matches(/[\w]+/).withMessage('Username can\'t be just spaces').escape(),
  check('password').trim().not().isEmpty().withMessage('password is required').escape()
];

async function handleValidationErrors(req, res, next){
  const errors = validationResult(req);
  let errorMsg;
  if(!errors.isEmpty()){
    return res.render('login',{session: undefined, errorMsg:errors.array(), successMsg: new Array()});
  } else{
    try{
      let userDetails = await new userDB().validateUser(req.body.username, req.body.password);
    if(userDetails.length>0){
      userProfileObj = new userProfile(req.body.username, new Array());
      req.session.userSession = userProfileObj;
    } else{
      errorMsg = new Array({msg:'Username and password mismatch, please login again!!'});
      return res.render('login',{session: undefined, errorMsg:errorMsg, successMsg:new Array()});
    }
    } catch(err){
      errorMsg = new Array({msg:'Username and password mismatch, please login again!!'});
      return res.render('login',{session: undefined, errorMsg:errorMsg, successMsg:new Array()});
    }
    
  }
  next();
}

router.post('/login', urlencodedParser, validation, handleValidationErrors, assignSession, async function(req, res){
  try{
    if(req.session.userSession){
      res.redirect('savedConnections');
    } else{
      res.redirect('login');
    }
  } catch(err){
    console.error(err);
    return res.render('login',{session: undefined, errorMsg: err, successMsg:new Array()});
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

router.get('/savedConnections', assignSession, async function (req, res) {
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
