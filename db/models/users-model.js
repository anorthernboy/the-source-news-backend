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
  .select('articles.username as author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .count('comments.article_id as comment_count')
  .groupBy('articles.article_id')
  .limit(limit)
  .orderBy(sort_by, order)
  .where('articles.username', username);
