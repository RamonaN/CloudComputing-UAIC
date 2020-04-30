module.exports.modelUser = (columns) => {
    var user = {};
    user.id = columns[0].value;
    user.nume = columns[1].value;
    user.locatie = columns[3].value;
    user.varsta = columns[4].value;
    user.isAdmin = columns[5].value;
    return user;
  }