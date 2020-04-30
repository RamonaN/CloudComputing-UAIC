const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs')
const results = [];

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

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

    results.push(result);
  })
  .on('end', () => {
    for (var i = 0; i<500; i++)
    {
      console.log(results[i]['isbn'].toString());
      const book = admin.firestore().collection('books').doc(results[i]['isbn'].toString());
      let set = book.set(results[i]);
      console.log('done', results[i]);
    }
  });


