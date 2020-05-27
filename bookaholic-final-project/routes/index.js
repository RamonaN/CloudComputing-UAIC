var express = require('express');
var router = express.Router();

userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  let params = {
    active: { home: true }
  };

  res.render('index', params);
});

module.exports = router;
