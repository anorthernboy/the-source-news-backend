const router = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
} = require('../controllers/topics-controller');

router.get('/', getTopics);

// router.post('/', addTopic);

router.get('/:topic/articles', getArticlesByTopic);

module.exports = router;