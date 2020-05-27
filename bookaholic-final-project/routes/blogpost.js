var express = require('express');
var router = express.Router();

postController = require('../controllers/postController');

router.get('/',(req,res, next)=> {
  if (!req.isAuthenticated())
    return res.redirect('/');
  
  postController.getTopPosts((err, posts) => {
    if (err)
      return next(err);
    res.render('blogposts.hbs', {'posts': posts});
  })
})

module.exports = router;