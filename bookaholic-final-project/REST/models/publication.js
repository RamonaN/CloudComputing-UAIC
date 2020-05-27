module.exports.modelPublication = (columns) => {
  var publication = {};
  publication.id = columns[0].value;
  publication.utilizator = columns[1].value;
  publication.titlu = columns[2].value;
  publication.categorie = columns[3].value;
  publication.email = columns[4].value;
  publication.phone = columns[5].value;
  publication.src = columns[6].value;
  publication.status = columns[7].value;
  return publication;
}