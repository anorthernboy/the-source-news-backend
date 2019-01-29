const router = require('express').Router();

const {
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
  addCommentByArticleId,
} = require('../controllers/articles-controller');

router.get('/', getArticles);

router.get('/:article_id', getArticlesById);

// router.patch

// router.delete

router.get('/:article_id/comments', getCommentsByArticleId);

router.post('/:article_id/comments', addCommentByArticleId)

module.exports = router;