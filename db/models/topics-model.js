const connection = require('../connection');


exports.fetchTopics = () => connection('topics')
  .select('*');

exports.addNewTopic = topic => connection('topics')
  .insert(topic)
  .returning('*');

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'articles.created_at', order = 'DESC') => connection('articles')
  .select('*')
  .limit(limit)
  .orderBy(sort_by, order)
  .where('articles.topic', topic);

exports.addNewArticle = article => connection('articles')
  .insert(article)
  .returning('*');
