var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('blog',{});
  });
  router.get('/add-new-post', function(req, res, next) {
    res.render('add-new-post',{});
  });
  module.exports = router;