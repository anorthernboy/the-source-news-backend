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
router.get('/:username', getUserByUsername);
router.get('/:username/articles', getArticlesByUsername);

module.exports = router;
