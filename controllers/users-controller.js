const {
  fetchUsers,
  addNewUser,
  fetchUserByUsername,
  fetchArticlesByUsername,
} = require('../db/models/users-model');


exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => res.status(200).json({
      users,
    }))
    .catch(next);
};

exports.addUser = (req, res, next) => {
  addNewUser(req.body)
    .then(user => res.status(201).json({
      user,
    }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const {
    username,
  } = req.params;
  fetchUserByUsername(username)
    .then(user => res.status(200).json({
      user,
    }))
    .catch(next);
};

exports.getArticlesByUsername = (req, res, next) => {
  const {
    username,
  } = req.params;
  const {
    limit,
    sort_by,
    order,
  } = req.query;
  fetchArticlesByUsername(username, limit, sort_by, order)
    .then(articles => res.status(200).json({
      articles,
    }))
    .catch(next);
};
