const router = require('express').Router();
const {
  getComments,
} = require('../controllers/comments-controller');
const {
  send404,
  send405,
} = require('../errors/index');

router.route('/')
  .get(getComments)
  .all(send405);
router.use('/*', send404);

module.exports = router;