const router = require('express').Router();

const {
  getArticles,
  getArticlesById,
  patchArticleById,
  deleteArticleById,
  getCommentsByArticleId,
  addCommentByArticleId,
  patchArticleCommentVoteByCommentId,
  deleteArticleCommentByCommentId,
} = require('../controllers/articles-controller');


router.get('/', getArticles);

router.get('/:article_id', getArticlesById);

router.put('/:article_id', patchArticleById);

router.delete('/:article_id', deleteArticleById);

router.get('/:article_id/comments', getCommentsByArticleId);

router.post('/:article_id/comments', addCommentByArticleId);

router.put('/:article_id/comments/:comment_id', patchArticleCommentVoteByCommentId);

router.delete('/:article_id/comments/:comment_id', deleteArticleCommentByCommentId);


module.exports = router;
