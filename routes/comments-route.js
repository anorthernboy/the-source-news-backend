const router = require('express').Router();

const {
  getComments
} = require('../controllers/comments-controller');


router.get('/', getComments);


module.exports = router;