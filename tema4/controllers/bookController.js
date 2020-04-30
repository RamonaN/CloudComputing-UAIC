const createError = require('http-errors');
const { Request } = require("tedious");
const { modelBook } = require("../models/books")
const connection = require("../database/connection");
var tokens = require('../tokens.js');
var graph = require('../graph.js');
module.exports.getBook = (bookId, next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Carte] 
     WHERE isbn like '${bookId}'`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var books = []
  request.on("row", columns => {
    var book = modelBook(columns);
    books.push(book)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('doneProc', (rowCount, more, rows) => { 
    next(undefined, books);
  });

  connection.execSql(request);
}

module.exports.getBooks = (next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Carte]`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var books = []

  request.on("row", columns => {
    var book = modelBook(columns);
    books.push(book)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('doneProc', (rowCount, more, rows) => { 
    next(undefined, books);
  });

  connection.execSql(request);

}