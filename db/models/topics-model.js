const connection = require('../connection');

exports.fetchTopics = () => connection('topics')
  .select('*');

exports.addNewTopic = topic => connection('topics')
  .insert(topic)
  .returning('*');

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'articles.created_at', order = 'DESC') => connection('articles')
  .select('articles.username as author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .count('comments.article_id as comment_count')
  .groupBy('articles.article_id')
  .limit(limit)
  .orderBy(sort_by, order)
  .where('articles.topic', topic);

exports.addNewArticle = article => connection('articles')
  .insert(article)
  .returning('*');
