const users = require("../database/user.js");
const createError = require('http-errors');

module.exports.getUser = (userId, next) => {
  console.log(userId);
  users.doc(userId).get()
  .then(user => {
    if (!user.exists) {
      next(createError(404, "User does not exist"));
    } else {
      next(undefined, user.data());
    }
  })
  .catch(err => {
    next(createError(500, err));
  });
}