const {
  fetchUsers,
  addNewUser,
  fetchUserByUsername,
  fetchArticlesByUsername,
} = require('../db/models/users-model');

exports.send405Error = (req, res, next) => next({
  status: 405,
  message: 'method not allowed',
});

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => res.status(200).json({
      users,
    }))
    .catch(next);
};

exports.addUser = (req, res, next) => {
  addNewUser(req.body)
    .then(([user]) => res.status(201).json({
      user,
    }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const {
    username,
  } = req.params;
  fetchUserByUsername(username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }
      return res.status(200).json({
        user,
      });
    })
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
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }
      const articles = result.reduce((acc, curr) => {
        acc.articles.push(curr);
        return acc;
      }, {
        total_count: result.length,
        articles: [],
      });
      return res.status(200).json(articles);
    })
    .catch(next);
};
