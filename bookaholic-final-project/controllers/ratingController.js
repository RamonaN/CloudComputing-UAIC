const createError = require('http-errors');
const { Request } = require("tedious");
const { modelRating } = require("../models/ratings")
const connection = require("../database/connection");

module.exports.getRatingsByUser = (userId, next) => {
  let ok = true;

  const request = new Request(
    `SELECT *
     FROM [dbo].[Scor] 
     WHERE utilizator = '${userId}'`,
    (err, rowCount) => {
      if (err && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var ratings = []
  request.on("row", columns => {
    var rating = modelRating(columns);
    ratings.push(rating)
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
      return next(undefined, ratings);
    }
  });

  connection.execSql(request);
}

module.exports.getRatingsByBook = (bookId, next) => {
  let ok = true;

  const request = new Request(
    `SELECT *
     FROM [dbo].[Scor] 
     WHERE isbn = '${bookId}'`,
    (err, rowCount) => {
      if (err && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var ratings = []
  request.on("row", columns => {
    var rating = modelRating(columns);
    ratings.push(rating)
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
      next(undefined, ratings);
    }
  });

  connection.execSql(request);
}

module.exports.rate = (bookId, userId, rate, next) => {
  let ok = true;

  const request = new Request(
      `INSERT INTO [dbo].[Scor] (utilizator, isbn, rating)
       VALUES (${userId}, '${bookId}', ${rate});`,
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
      return next(undefined);
    }
  });

  connection.execSql(request);
}