const books = require("../database/book.js");
const createError = require('http-errors');

module.exports.getBook = (bookId, next) => {
  books.doc(bookId).get()
  .then(book => {
    if (!book.exists) {
      next(createError(404 , "Book does not exist"));
    } else {
      next(undefined, book.data());
    }
  })
  .catch(err => {
    next(createError(500, err));
  });
}

module.exports.getBooks = (next) => {
  books.get()
  .then((snapshot) => {
    var finalBooks = [];
    snapshot.forEach((book) => {
      finalBooks.push(book.data());
    })
    next(undefined, finalBooks);
  })
  .catch(err => {
    next(createError(500, err));
  });
}

module.exports.getRatingsByBook = (next) => {
  books.get()
  .then((snapshot) => {
    var finalBooks = [];
    snapshot.forEach((book) => {
      finalBooks.push(book.data());
    })
    next(undefined, finalBooks);
  })
  .catch(err => {
    next(createError(500, err));
  });
}