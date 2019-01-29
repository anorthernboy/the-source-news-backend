const router = require('express').Router();

const {
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
} = require('../controllers/articles-controller');

router.get('/', getArticles);

router.get('/:article_id', getArticlesById);

router.get('/:article_id/comments', getCommentsByArticleId);

module.exports = router;