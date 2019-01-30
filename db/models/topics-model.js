const connection = require('../connection');


exports.fetchTopics = () => {
  return connection('topics')
    .select('*');
};

exports.addNewTopic = (topic) => {
  return connection('topics')
    .insert(topic)
    .returning('*');
};

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'articles.created_at', order = 'DESC') => {
  return connection('articles')
    .select('*')
    .limit(limit)
    .orderBy(sort_by, order)
    .where('articles.topic', topic);
};

exports.addNewArticle = (article) => {
  return connection('articles')
    .insert(article)
    .returning('*');
};