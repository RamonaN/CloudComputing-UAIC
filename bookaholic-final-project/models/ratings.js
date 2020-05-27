module.exports.modelRating = (columns) => {
  var rating = {};
  rating.utilizator = columns[0].value;
  rating.isbn = columns[1].value;
  rating.scor = columns[2].value;
  return rating;
}