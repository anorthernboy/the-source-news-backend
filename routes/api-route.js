const router = require('express').Router();

const topicsRouter = require('./topics-route');

const usersRouter = require('./users-route');

const articlesRouter = require('./articles-route');

const commentsRouter = require('./comments-route');


router.use('/topics', topicsRouter);

router.use('/users', usersRouter);

router.use('/articles', articlesRouter);

router.use('/comments', commentsRouter);


module.exports = router;