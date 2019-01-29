const connection = require('../connection');

exports.fetchArticles = () => {
  return connection('articles')
    .select('*');
};

exports.fetchArticlesById = (article_id) => {
  return connection('articles')
    .select('*')
    .where('articles.article_id', article_id);
};