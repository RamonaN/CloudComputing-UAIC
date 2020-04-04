const ratings = require("../database/rating.js");
const createError = require('http-errors');

module.exports.getRatingsByUser = (userId, next) => {
  ratings.where("utilizator", "==", parseInt(userId)).get()
  .then(querySnapshot => {
    var finalRatings = [];
    querySnapshot.forEach((rating) => {
      finalRatings.push(rating.data());
    });
    next(undefined, finalRatings);
  })
  .catch(err => {
    next(createError(500, err));
  });
}

module.exports.getRatingsByBook = (bookId, next) => {
  ratings.where("isbn", "==", parseInt(bookId)).get()
  .then(querySnapshot => {
    var finalRatings = [];
    querySnapshot.forEach((rating) => {
      finalRatings.push(rating.data());
    });
    next(undefined, finalRatings);
  })
  .catch(err => {
    next(createError(500, err));
  });
}