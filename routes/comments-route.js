const router = require('express').Router();
const {
  getComments,
} = require('../controllers/comments-controller');
const {
  send405,
} = require('../errors/index');

router.route('/')
  .get(getComments)
  .all(send405);

module.exports = router;
