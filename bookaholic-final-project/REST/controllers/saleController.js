const createError = require('http-errors');
const { Request } = require("tedious");
const { modelSale } = require("../models/sale")
const connection = require("../database/connection");

module.exports.getSale = (userId, bookId, next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Reduceri] 
     WHERE utilizator = '${userId}' and isbn = '${bookId}'`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var sales = [];
  request.on("row", columns => {
    var sale = modelSale(columns);
    sales.push(sale);
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('requestCompleted', () => { 
    next(undefined, sales);
  });

  connection.execSql(request);
}