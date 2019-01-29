const router = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
  addArticleByTopic,
} = require('../controllers/topics-controller');

router.get('/', getTopics);

router.post('/', addTopic);

router.get('/:topic/articles', getArticlesByTopic);

router.post('/:topic/articles', addArticleByTopic),

  module.exports = router;