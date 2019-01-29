const connection = require('../connection');

exports.fetchUsers = () => {
  return connection('users')
    .select('*');
};

exports.fetchUserByUsername = (username) => {
  return connection('users')
    .select('*')
    .where('users.username', username);
};

exports.fetchArticlesByUsername = (username) => {
  return connection('articles')
    .select('*')
    .where('articles.username', username);
};

exports.addNewUser = (user) => {
  return connection('users')
    .insert(user)
    .returning('*')
};