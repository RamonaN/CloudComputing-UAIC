const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs')
const results = [];
var nr = 0;

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

fs.createReadStream('dump/BX-Book-Ratings.csv')
.pipe(csv({ separator: ';' }))
.on('data', (data) => {
  var result = {};

  result.id = nr++; 
  result.utilizator = parseInt(data['User-ID']);
  result.isbn = parseInt(data['ISBN']);
  result.scor = parseInt(data['Book-Rating']);

  if(data['ISBN'] != undefined)
    results.push(result);
})
.on('end', () => {
  for (var i = 0; i<results.length; i++)
  {
    //console.log(ratings[i].isbn);
    //console.log(ratings[i].utilizator);
    console.log('done', results[i]);
    //const book = admin.firestore().collection('books').doc(results[i]['isbn'].toString());
    //let set = book.set(results[i]);
  }
})

