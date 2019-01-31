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
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }
      const displayUser = user.reduce((acc, curr) => {
        acc = curr;
        return acc;
      }, {});
      return res.status(200).json({
        displayUser,
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
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }
      const displayArticles = articles.reduce((acc, curr) => {
        acc.articles.push(curr);
        return acc;
      }, {
        total_count: articles.length,
        articles: [],
      });
      return res.status(200).json({
        displayArticles,
      });
    })
    .catch(next);
};
