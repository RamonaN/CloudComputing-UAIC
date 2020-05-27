var express = require('express');
var router = express.Router();

postController = require('../controllers/postController');

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

router.get('/', function(req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect(300, '/');

  const userId = req.user.profile.id;

  postController.getPostsByUser(userId, (err, posts) => {
    if (err) 
      return next(err);
    
    res.render('blog', {'posts': posts});
  })
});


router.get('/add-new-post', function(req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect(300, '/');

  res.render('add-new-post',{});
});

router.post('/add-new-post', function(req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect(300, '/');

  const userId = req.user.profile.id;
  const title = req.body.title;
  const desc = req.body.description;
  const data = getDate();

  postController.post(userId, title, desc, data, (err) => {
    if (err)
      return next(err);
    res.redirect('/blog/');
  });

});


module.exports = router;