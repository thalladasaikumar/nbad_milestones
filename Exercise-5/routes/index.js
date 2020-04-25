var express = require('express');
var router = express.Router();
var courseDetails = require('./courseDetails.js');

router.get('/', function (req, res) {
  res.render('index', {hits: courseDetails.formPostCounter()});
})
module.exports = router;
