const createError = require('http-errors');
const { Request } = require("tedious");
const { modelReview } = require("../models/review")
const connection = require("../database/connection");

module.exports.getReviewsByUser = (userId, next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Review] 
     WHERE utilizator = '${userId}'`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var reviews = [];
  request.on("row", columns => {
    var review = modelReview(columns);
    reviews.push(review)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('requestCompleted', () => { 
    next(undefined, reviews);
  });

  connection.execSql(request);
}

module.exports.getReviewsByBook = (bookId, next) => {

  const request = new Request(
   `SELECT utilizator, isbn, descriere, dataPostarii, nume
    FROM [dbo].[Review]
    JOIN [dbo].[Utilizator] ON [dbo].[Review].utilizator = [dbo].[Utilizator].id
    WHERE isbn = '${bookId}';`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var reviews = []
  request.on("row", columns => {
    var review = modelReview(columns);
    reviews.push(review)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('requestCompleted', () => { 
    next(undefined, reviews);
  });

  connection.execSql(request);
}

module.exports.review = (bookId, userId, dataPostarii, descriere, next) => {

  const request = new Request(
      `INSERT INTO [dbo].[Review] (utilizator, isbn, descriere, dataPostarii)
       VALUES (${userId}, '${bookId}', '${descriere}', '${dataPostarii}');`,
    (err, rowCount) => {
      if (err) {
        if (!err.message.includes("PRIMARY"))
        {
          next(createError(500, err.message));
        }
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("err", err => {
    if (err.message.includes("PRIMARY"))
    {
      return next(undefined);
    }
    next(createError(500, err.message));
  });

  request.on('requestCompleted', () => { 
    next(undefined);
  });

  connection.execSql(request);
}