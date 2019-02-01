const router = require('express').Router();
const {
  send405Error,
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesByUsername,
} = require('../controllers/users-controller');

router.route('/')
  .get(getUsers)
  .post(addUser)
  .all(send405Error);
router.route('/:username').get(getUserByUsername).all(send405Error);
router.route('/:username/articles').get(getArticlesByUsername).all(send405Error);

module.exports = router;
