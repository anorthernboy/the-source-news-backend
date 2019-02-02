const router = require('express').Router();
const topicsRouter = require('./topics-route');
const usersRouter = require('./users-route');
const articlesRouter = require('./articles-route');
const commentsRouter = require('./comments-route');
const {
  getEndpoints,
} = require('../controllers/api-controller');
const {
  send404,
  send405,
} = require('../errors/index');

router.route('/')
  .get(getEndpoints)
  .all(send405);
router.use('/topics', topicsRouter);
router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('*', send404);

module.exports = router;