var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/');

  res.render('publish-book',{});
});

router.post('/', function(req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/')

  let file = req.files.file;
  file.mv('./uploads/' + file.md5);

  const userId = req.user.profile.id;
  let email = req.body.email;
  let title = req.body.title;
  let category = req.body.category;
  let phone = req.body.phone;
  let fileId = file.md5;

  publishController.publish(userId, email, title, category, phone, fileId, (err) => {
    if (err)
      return next(err);

    res.redirect('/blog/');
  })
});

module.exports=router;