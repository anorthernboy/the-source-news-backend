const {
  fetchUsers,
  fetchUserByUsername,
  fetchArticlesByUsername,
} = require('../db/models/users-model');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => res.status(200).json({
      users
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
  fetchArticlesByUsername(username).then(articles => res.status(200).json({
    articles,
  })).catch(next);
};