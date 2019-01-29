const {
  fetchArticles,
  fetchArticlesById,
} = require('../db/models/articles-model');

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then(articles => res.status(200).json({
      articles,
    }))
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  fetchArticlesById(article_id)
    .then(article => res.status(200).json({
      article,
    }))
    .catch(next);
};