const createError = require('http-errors');
const { Request } = require("tedious");
const { modelBook } = require("../models/books")
const connection = require("../database/connection");

module.exports.getBook = (bookId, next) => {
  let ok = true;

  const request = new Request(
    `SELECT *
     FROM [dbo].[Carte] 
     WHERE isbn like '${bookId}'`,
    (err, rowCount) => {
      if (err && ok)
      {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var books = []
  request.on("row", columns => {
    var book = modelBook(columns);
    books.push(book)
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
      return next(undefined, books);
    }
  });

  connection.execSql(request);
}

module.exports.getBooks = (next) => {
  let ok = true;

  const request = new Request(
    `SELECT TOP 50 *
     FROM [dbo].[Carte]`,
    (err, rowCount) => {
      if (err && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var books = []
  request.on("row", columns => {
    var book = modelBook(columns);
    books.push(book)
  });

  request.on("err", err => {
    if (ok)
    {
      ok = false;
      next(createError(500, err.message));
    }
  });

  request.on('requestCompleted', (rowCount,more,rows) => { 
    if (ok)
    {
      next(undefined, books);
    }
  });

  connection.execSql(request);

}