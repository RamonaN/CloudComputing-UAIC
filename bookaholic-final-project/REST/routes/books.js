var express = require('express');
var router = express.Router();

bookController = require('../controllers/bookController');
ratingController = require('../controllers/ratingController');
reviewController = require('../controllers/reviewController');

router.get('/', async (req, res) => {
  bookController.getBooks((err, books) => {
    if (err) 
      return next(err);
    
    res.json(books).end();
  })
});

router.get('/:bookId', (req, res, next) => {
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
        res.json(book[0]).end();
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

router.post('/:bookId/review/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  const star = parseInt(req.body.rate) * 2;
  const descriere = req.body.descriere;

  const data = getDate();

  ratingController.rate(bookId, userId, star, (err) => {
    if (err)
      return next(err);

    reviewController.review(bookId, userId, data, descriere, (err) => {
      if (err)
        return next(err);
        
      res.send("POST is ok").end();
    })
  })
});

module.exports = router;
