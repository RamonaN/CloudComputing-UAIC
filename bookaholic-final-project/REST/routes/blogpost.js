var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');

router.get('/', (req, res)=> {
  postController.getTopPosts((err, posts) => {
    if (err)
      return next(err);
    res.json(posts).end();
  })
})

module.exports = router;