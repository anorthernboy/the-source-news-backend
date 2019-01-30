const router = require('express').Router();

const {
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesByUsername,
} = require('../controllers/users-controller');


router.get('/', getUsers);

router.post('/', addUser);

router.get('/:username', getUserByUsername);

router.get('/:username/articles', getArticlesByUsername);


module.exports = router;