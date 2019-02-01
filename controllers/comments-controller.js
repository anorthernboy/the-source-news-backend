const {
  fetchComments,
} = require('../db/models/comments-model');

exports.send405Error = (req, res, next) => next({
  status: 405,
  message: 'method not allowed',
});

exports.getComments = (req, res, next) => {
  fetchComments()
    .then(comments => res.status(200).json({
      comments,
    }))
    .catch(next);
};
