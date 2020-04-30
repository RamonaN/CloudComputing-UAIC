const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');

const books = [];
const users = [];
const ratings = [];

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

var nr = 1;

fs.createReadStream('dump/BX-Books.csv')
.pipe(csv({ separator: ';' }))
.on('data', (data) => {
  var result = {};

  result.isbn = parseInt(data['ISBN']);
  result.titlu = data['Book-Title'];
  result.autor = data['Book-Author'];
  result.an = parseInt(data['Year-Of-Publication']);
  result.editor = data['Publisher'];
  result.imagine = data['Image-URL-L'];

  books.push(result);

})
.on('end', () => {
  fs.createReadStream('dump/BX-Users.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => {
    var result = {nume: 'generat', parola: 'parola', isAdmin: false};
    result.id = parseInt(data['User-ID']);
    if (data['Location'] != 'NULL')
      result.locatie = data['Location'];
    if (data['Age'] != 'NULL')
      result.varsta = parseInt(data['Age']);
    users.push(result);
  })
  .on('end', () => {
    fs.createReadStream('dump/BX-Book-Ratings.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => {
      var result = {};

      result.id = nr++; 
      result.utilizator = parseInt(data['User-ID']);
      result.isbn = parseInt(data['ISBN']);
      result.scor = parseInt(data['Book-Rating']);

      if (data['ISBN'] != undefined)
        ratings.push(result);
    })
    .on('end', () => {
      var validBooks = new Set();
      var validUsers = new Set();
      for (var i = 0; i<500; i++)
      {
        validBooks.add(books[i].isbn);
        validUsers.add(users[i].id);
      }
      for (var i = 0; i<ratings.length; i++)
      {
        if (validBooks.has(ratings[i].isbn) && validUsers.has(ratings[i].utilizator))
        {
          console.log(ratings[i]['id'].toString());
          const rating = admin.firestore().collection('ratings').doc(ratings[i]['id'].toString());
          let set = rating.set(ratings[i]);
          console.log('done', ratings[i]['id']);
        }
      }
    })
  })
});


