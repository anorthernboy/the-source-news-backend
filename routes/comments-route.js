const router = require('express').Router();
const {
  send405Error,
  getComments,
} = require('../controllers/comments-controller');

router.route('/').get(getComments).all(send405Error);

module.exports = router;
