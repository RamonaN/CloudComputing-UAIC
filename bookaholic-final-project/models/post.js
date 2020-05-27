module.exports.modelPost = (columns) => {
  var post = {};
  post.id = columns[0].value;
  post.titlu = columns[1].value;
  post.descriere = columns[2].value;
  post.dataPostarii = columns[3].value;
  post.utilizator = columns[4].value;
  post.nume = columns[5].value;
  return post;
}