const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs')
const results = [];

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

fs.createReadStream('dump/BX-Users.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => {
    var result = {nume: 'generat', parola: 'parola', isAdmin: false};
    result.id = parseInt(data['User-ID']);
    if (data['Location'] != 'NULL')
      result.locatie = data['Location'];
    if (data['Age'] != 'NULL')
      result.varsta = parseInt(data['Age']);
    results.push(result);
  })
  .on('end', () => {
    for (var i = 0; i<500; i++)
    {
      console.log(results[i]['id'].toString());
      const user = admin.firestore().collection('users').doc(results[i]['id'].toString());
      let set = user.set(results[i]);
      console.log('done', results[i]);
    }
  });


