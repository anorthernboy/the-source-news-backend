const router = require('express').Router();
const {
  send405Error,
  getArticles,
  getArticlesById,
  patchArticleById,
  deleteArticleById,
  getCommentsByArticleId,
  addCommentByArticleId,
  patchArticleCommentVoteByCommentId,
  deleteArticleCommentByCommentId,
} = require('../controllers/articles-controller');

router.route('/').get(getArticles).all(send405Error);
router.route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(send405Error);
router.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(addCommentByArticleId)
  .all(send405Error);
router.route('/:article_id/comments/:comment_id')
  .patch(patchArticleCommentVoteByCommentId)
  .delete(deleteArticleCommentByCommentId)
  .all(send405Error);

module.exports = router;
