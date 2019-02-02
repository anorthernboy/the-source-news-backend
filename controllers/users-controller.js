const {
  fetchUsers,
  addNewUser,
  fetchUserByUsername,
  fetchAllArticlesByUsername,
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
  const {
    username,
    avatar_url,
    name,
  } = req.body;
  if (!username || !avatar_url || !name) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return fetchUsers()
    .then((users) => {
      const allowedUsers = users.filter(userObject => userObject.username === req.body.username);
      if (allowedUsers.length !== 0) {
        return Promise.reject({
          status: 422,
          message: 'unable to process',
        });
      }
      return addNewUser(req.body)
        .then(([user]) => {
          res.status(201).json(user);
        });
    })
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
          status: 400,
          message: 'bad request',
        });
      }
      return res.status(200).json(user);
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
    p,
  } = req.query;
  fetchAllArticlesByUsername(username)
    .then((usernames) => {
      const allowedUsernames = usernames.filter(userObject => userObject.username === username);
      if (allowedUsernames.length === 0) {
        return Promise.reject({
          status: 400,
          message: 'bad request',
        });
      }
      return fetchArticlesByUsername(username, limit, sort_by, order, p)
        .then((result) => {
          if (result.length === 0) {
            return Promise.reject({
              status: 400,
              message: 'bad request',
            });
          }
          const articles = result.reduce((acc, curr) => {
            acc.articles.push(curr);
            return acc;
          }, {
            total_count: usernames.length,
            articles: [],
          });
          return res.status(200).json(articles);
        });
    })
    .catch(next);
};
