const createError = require('http-errors');
const { Request } = require("tedious");
const { modelSale } = require("../models/sale")
const connection = require("../database/connection");

module.exports.getSale = (userId, bookId, next) => {
  let ok = true;

  const request = new Request(
    `SELECT *
     FROM [dbo].[Reduceri] 
     WHERE utilizator = '${userId}' and isbn = '${bookId}'`,
    (err, rowCount) => {
      if (err && ok) {
        ok = false;
        return next(createError(500, err.message));
      }
    }
  );

  var sales = [];
  request.on("row", columns => {
    var sale = modelSale(columns);
    sales.push(sale);
  });

  request.on("err", err => {
    if (ok)
    {
      ok = false;
      next(createError(500, err.message));
    }
  });

  request.on('requestCompleted', () => { 
    if (ok)
    {
      return next(undefined, sales);
    }
  });

  connection.execSql(request);
}