var express = require('express');
var router = express.Router();

bookController = require('../controllers/bookController');
ratingController = require('../controllers/ratingController');

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    // Redirect unauthenticated requests to home page
    res.redirect('/')
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
    {
      return next(err);
    }
    params.books=books;
    res.render("books",params);
  })}
});

router.get('/:bookId', (req, res, next) => {
  const bookId = req.params.bookId;
  bookController.getBook(bookId, (err, book) => {
    if (err) 
    {
      return next(err);
    }
    res.json(book).end();
  })
});

router.get('/:bookId/ratings', (req, res, next) => {
  const bookId = req.params.bookId;
  ratingController.getRatingsByBook(bookId, (err, ratings) => {
    if (err) 
    {
      return next(err);
    }
    res.json(ratings).end();
  })
});

module.exports = router;
