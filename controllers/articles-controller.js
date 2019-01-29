const {
  fetchArticles
} = require('../db/models/articles-model');

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then(articles => res.status(200).json({
      articles
    }))
    .catch(next);
};