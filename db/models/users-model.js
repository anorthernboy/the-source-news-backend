const connection = require('../connection');


exports.fetchUsers = () => connection('users')
  .select('*');

exports.addNewUser = user => connection('users')
  .insert(user)
  .returning('*');

exports.fetchUserByUsername = username => connection('users')
  .select('*')
  .where('users.username', username);

exports.fetchArticlesByUsername = (username, limit = 5, sort_by = 'articles.created_at', order = 'DESC') => connection('articles')
  .select('*')
  .limit(limit)
  .orderBy(sort_by, order)
  .where('articles.username', username);
