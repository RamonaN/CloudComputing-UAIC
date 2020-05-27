var express = require('express');
var router = express.Router();

publishController = require('../controllers/publishController');

router.get('/user/:userId', function(req, res, next) {
  const userId = req.params.userId;

  publishController.getPublicationsByUser(userId, (err, publicari) => {
    if (err) 
      return next(err);
    
    res.json(publicari).end();
  });
});

router.get('/file/:id', function(req, res, next) {
  const fileid = req.params.id;
  const file = `./uploads/${fileid}`;
  
  res.download(file);
});

module.exports = router;