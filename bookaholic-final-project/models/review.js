module.exports.modelReview = (columns) => {
  var review = {};
  review.utilizator = columns[0].value;
  review.isbn = columns[1].value;
  review.descriere = columns[2].value;
  review.dataPostarii = columns[3].value;
  review.nume = columns[4].value;
  return review;
}