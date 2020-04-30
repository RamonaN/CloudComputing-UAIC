var express = require('express');
var router = express.Router();

bookController = require('../controllers/bookController');
ratingController = require('../controllers/ratingController');

router.get('/', (req, res, next) => {
  bookController.getBooks((err, books) => {
    if (err) 
    {
      return next(err);
    }
    res.json(books);
  })
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
