const router = require('express').Router();

const {
  getUsers,
  getUserByUsername,
  getArticlesByUsername,
  addUser,
} = require('../controllers/users-controller');

router.get('/', getUsers);

router.get('/:username', getUserByUsername);

router.get('/:username/articles', getArticlesByUsername);

router.post('/', addUser);

module.exports = router;