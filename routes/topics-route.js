const router = require('express').Router();
const {
  send405Error,
  getTopics,
  addTopic,
  getArticlesByTopic,
  addArticleByTopic,
} = require('../controllers/topics-controller');

router.route('/')
  .get(getTopics)
  .post(addTopic)
  .all(send405Error);
router.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticleByTopic)
  .all(send405Error);

module.exports = router;
