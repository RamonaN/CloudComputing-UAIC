var express = require('express');
var router = express.Router();

router.post('/:userId', function(req, res, next) {

  let file = req.files.file;
  file.mv('./uploads/' + file.md5);

  const userId = req.params.userId;

  let email = req.body.email;
  let title = req.body.title;
  let category = req.body.category;
  let phone = req.body.phone;

  let fileId = file.md5;

  publishController.publish(userId, email, title, category, phone, fileId, (err) => {
    if (err)
      return next(err);

    res.send('Post is ok').end();
  })
});

module.exports=router;