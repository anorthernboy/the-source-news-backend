const {
  fetchComments
} = require('../db/models/comments-model');


exports.getComments = (req, res, next) => {
  fetchComments()
    .then(comments => res.status(200).json({
      comments,
    }))
    .catch(next);
};