var express = require('express');
var router = express.Router();
userController = require('../controllers/userController');
ratingController = require('../controllers/ratingController');

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;

  userController.getUser(userId, (err, user) => {
    if (err) 
      return next(err);

    res.json(user).end();
  })
});

router.get('/:userId/ratings', function(req, res, next) {
  const userId = req.params.userId;

  ratingController.getRatingsByUser(userId, (err, ratings) => {
    if (err) 
      return next(err);
    
    res.json(ratings).end();
  })
});

module.exports = router;