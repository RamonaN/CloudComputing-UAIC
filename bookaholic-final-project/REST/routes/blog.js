var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');

pad = (nr) => {
  x = `${nr}`;
  if (x.length == 1)
    x = "0" + x;
  return x;
}

getDate = () => {
  let d = new Date();
  let ampm = 'AM';
  let hours = d.getHours();
  if (hours > 12)
  {
    ampm = 'PM';
    hours -= 12;
  }
  const data = pad(d.getMonth()+1) + "/" + pad(d.getDate()) + "/" + d.getFullYear() + " " + pad(hours)  + ":" + pad(d.getMinutes()) + " " + ampm;
  return data;
}

router.get('/:userId', function(req, res, next) {
  const userId = req.params.userId;

  console.log(userId);

  postController.getPostsByUser(userId, (err, posts) => {
    if (err) 
      return next(err);
    res.json(posts);
  })
});

router.post('/add-new-post/:userId', function(req, res, next) {
  const userId = req.params.userId;

  const title = req.body.title;
  const desc = req.body.description;
  
  const data = getDate();

  postController.post(userId, title, desc, data, (err) => {
    if (err)
        return next(err);

    res.send('POST is ok').end();
  });

});

module.exports = router;