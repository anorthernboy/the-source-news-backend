const connection = require('../connection');

exports.fetchTopics = () => {
  return connection('topics')
    .select('*');
};

exports.addNewTopic = (topic) => {
  return connection('topics')
    .insert(topic)
    .returning('*')
};

exports.fetchArticlesByTopic = (topic) => {
  return connection('articles')
    .select('*')
    .where('articles.topic', topic);
};

exports.addNewArticle = (article) => {
  return connection('articles')
    .insert(article)
    .returning('*')
};