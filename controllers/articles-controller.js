const {
  fetchArticles,
  fetchArticlesById,
  updateArticle,
  removeArticle,
  fetchCommentsByArticleId,
  addNewComment,
  updateVote,
  deleteComment,
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

// exports.patchArticleById = (req, res, next) => {
//   updateArticle().then().catch(next);
// };

// exports.deleteArticleById = (req, res, next) => {
//   removeArticle().then().catch(next);
// };

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
      comment
    }))
    .catch(next)
};

// exports.patchArticleCommentVoteByCommentId = (req, res, next) => {
//   updateVote().then().catch();
// };

// exports.deleteArticleCommentByCommentId = (req, res, next) => {
//   deleteComment().then().catch(next);
// };