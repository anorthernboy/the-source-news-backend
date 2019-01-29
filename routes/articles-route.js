const router = require('express').Router();
const {
  getArticles
} = require('../controllers/articles-controller')


router.get('/', getArticles);


module.exports = router;