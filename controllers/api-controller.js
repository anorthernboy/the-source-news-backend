exports.getEndpoints = (req, res, next) => {
  res.status(200).json({
    '/api/topics': 'responds with an array of topic objects',
    '/api/topics/:topic/articles': 'responds with an array of article objects for the given topic',
    '/api/users': 'responds with an array of user objects',
    '/api/users/:username': 'responds with a username object for the given username',
    '/api/users/:username/articles': 'responds with an array of article objects for the given username',
    '/api/articles': 'responds with an array of article objects',
    '/api/articles/:article_id': 'responds with an article object for the given article_id',
    '/api/articles/:article_id/comments': 'responds with an array of comment objects for the given article_id',
    '/api/comments': 'responds with an array of comment objects',
  });
};
