const router = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
  addArticleByTopic,
} = require('../controllers/topics-controller');
const {
  send405,
} = require('../errors/index');

router.route('/')
  .get(getTopics)
  .post(addTopic)
  .all(send405);
router.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticleByTopic)
  .all(send405);

module.exports = router;
