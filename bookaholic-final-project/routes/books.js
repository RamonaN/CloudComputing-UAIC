var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');

bookController = require('../controllers/bookController');
ratingController = require('../controllers/ratingController');
reviewController = require('../controllers/reviewController');

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/')
  }
  else{
    let params = {
      active: { books: true }
    };
    var accessToken;
      try {
        accessToken = await tokens.getAccessToken(req);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. Try signing out and signing in again.',
          debug: JSON.stringify(err)
        });
      }
  bookController.getBooks((err, books) => {
  
    if (err) 
      return next(err);

    params.books=books;
    res.render("books",params);
  })}
});

router.get('/:bookId', (req, res, next) => {
  if (!req.isAuthenticated())
    return res.redirect('/');

  const bookId = req.params.bookId;
  bookController.getBook(bookId, (err, book) => {
    if (err) 
      return next(err);

    ratingController.getRatingsByBook(bookId, (err, ratings) => {
      if (err) 
        return next(err);

      let size = ratings.length;
      let sum = 0;
      for (i=0; i<size; i++)
        sum += parseInt(ratings[i].scor);
      book[0].rating = parseFloat((sum / size) / 2).toFixed(2);
      book[0].revno = size;

      reviewController.getReviewsByBook(bookId, (err, reviews) => {
        if (err)
          return next(err);
        book[0].review = reviews;
        res.render("book", {'book': book});
      });
    });
  })
});

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

router.post('/:bookId/review', (req, res, next) => {
  if (!req.isAuthenticated())
    return res.redirect('/');

  const star = parseInt(req.body.rate) * 2;
  const descriere = req.body.descriere;
  const data = getDate();
  const bookId = req.params.bookId;
  const userId = req.user.profile.id;

  ratingController.rate(bookId, userId, star, (err) => {
    if (err)
      return next(err);

    reviewController.review(bookId, userId, data, descriere, (err) => {
      if (err)
        return next(err);
      
      res.redirect('/book/' + bookId + "/");
    })
  })
});

module.exports = router;
