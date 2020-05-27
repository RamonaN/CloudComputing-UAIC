const createError = require('http-errors');
const { Request } = require("tedious");
const { modelReview } = require("../models/review")
const connection = require("../database/connection");

module.exports.getReviewsByUser = (userId, next) => {
  let ok = true;

  const request = new Request(
    `SELECT *
     FROM [dbo].[Review] 
     WHERE utilizator = '${userId}'`,
    (err, rowCount) => {
      if (err && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var reviews = [];
  request.on("row", columns => {
    var review = modelReview(columns);
    reviews.push(review)
  });

  request.on("err", err => {
    if (ok)
    {
      ok = false;
      return next(createError(500, err.message));
    }
  });

  request.on('requestCompleted', () => { 
    if (ok)
    {
      return next(undefined, reviews);
    }
  });

  connection.execSql(request);
}

module.exports.getReviewsByBook = (bookId, next) => {
  let ok = true;

  const request = new Request(
   `SELECT utilizator, isbn, descriere, dataPostarii, nume
    FROM [dbo].[Review]
    JOIN [dbo].[Utilizator] ON [dbo].[Review].utilizator = [dbo].[Utilizator].id
    WHERE isbn = '${bookId}';`,
    (err, rowCount) => {
      if (err && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var reviews = []
  request.on("row", columns => {
    var review = modelReview(columns);
    reviews.push(review)
  });

  request.on("err", err => {
    if (ok)
    {
      ok = false;
      return next(createError(500, err.message));
    }
  });

  request.on('requestCompleted', () => { 
    if (ok)
    {
      return next(undefined, reviews);
    }
  });

  connection.execSql(request);
}

module.exports.review = (bookId, userId, dataPostarii, descriere, next) => {
  let ok = true;

  const request = new Request(
      `INSERT INTO [dbo].[Review] (utilizator, isbn, descriere, dataPostarii)
       VALUES (${userId}, '${bookId}', '${descriere}', '${dataPostarii}');`,
    (err, rowCount) => {
      if (err && !err.message.includes("PRIMARY") && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  request.on("err", err => {
    if (!err.message.includes("PRIMARY") && ok)
    {
      ok = false;
      return next(createError(500, err.message));
    }
  });

  request.on('requestCompleted', () => {
    if (ok)
    {
      next(undefined);
    } 
  });

  connection.execSql(request);
}