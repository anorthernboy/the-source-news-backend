const {
  fetchArticles,
  fetchArticlesById,
  updateArticle,
  removeArticle,
  fetchCommentsByArticleId,
  addNewComment,
  updateVote,
  removeComment,
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

exports.patchArticleById = (req, res, next) => {

  const {
    article_id,
  } = req.params;

  const {
    inc_votes,
  } = req.body;

  updateArticle(article_id, inc_votes)
    .then(article => res.status(200).json({
      article,
    }))
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  removeArticle(article_id)
    .then(article => res.status(204).json({
      article,
    }))
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  fetchCommentsByArticleId(article_id)
    .then(comments => res.status(200).json({
      comments,
    }))
    .catch(next);
};

exports.addCommentByArticleId = (req, res, next) => {
  const {
    article_id,
  } = req.params;

  req.body.article_id = article_id;

  addNewComment(req.body)
    .then(comment => res.status(201).json({
      comment,
    }))
    .catch(next)
};

exports.patchArticleCommentVoteByCommentId = (req, res, next) => {

  const {
    article_id,
    comment_id,
  } = req.params;

  const {
    inc_votes,
  } = req.body;

  updateVote(article_id, comment_id, inc_votes)
    .then(comment => res.status(200).json({
      comment,
    }))
    .catch(next);
};

exports.deleteArticleCommentByCommentId = (req, res, next) => {
  const {
    article_id,
    comment_id,
  } = req.params;
  removeComment(article_id, comment_id)
    .then(comment => res.status(204).json({
      comment,
    }))
    .catch(next);
};