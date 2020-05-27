const createError = require('http-errors');
const { Request } = require("tedious");
const { modelPost } = require("../models/post")
const connection = require("../database/connection");

module.exports.getPostsByUser = (userId, next) => {
  var ok = true;

  const request = new Request(
    `SELECT TOP 10 p.id, titlu, descriere, dataPostarii, utilizator, nume
     FROM [dbo].[Postari] as p
     JOIN [dbo].[Utilizator] as u ON p.utilizator = u.id
     WHERE p.utilizator = '${userId}'`,
    (err, rowCount) => {
      if (err) {
        ok = false;
        console.log(err);
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var posts = [];
  request.on("row", columns => {
    var post = modelPost(columns);
    posts.push(post)
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
      next(undefined, posts);
  });

  connection.execSql(request);
}


module.exports.post = (userId, title, desc, data, next) => {

   const request = new Request(
      `INSERT INTO [dbo].[Postari] (titlu, descriere, dataPostarii, utilizator)
       VALUES ('${title}', '${desc}', '${data}', ${userId});`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('requestCompleted', () => { 
    next(undefined);
  });

  connection.execSql(request);
}

module.exports.getTopPosts = (next) => {
    const request = new Request(
    `SELECT TOP 10 p.id, titlu, descriere, dataPostarii, utilizator, nume
     FROM [dbo].[Postari] as p
     JOIN [dbo].[Utilizator] as u ON p.utilizator = u.id;`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var posts = [];
  request.on("row", columns => {
    var post = modelPost(columns);
    posts.push(post)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('requestCompleted', () => { 
    next(undefined, posts);
  });

  connection.execSql(request);
}