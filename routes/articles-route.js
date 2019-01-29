const router = require('express').Router();
const {
  getArticles,
  getArticlesById,
} = require('../controllers/articles-controller')


router.get('/', getArticles);

router.get('/:article_id', getArticlesById)


module.exports = router;