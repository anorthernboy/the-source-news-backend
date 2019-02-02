const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../data/index');
const {
  createRef,
  formatArticles,
  formatComments,
} = require('../utils/index');

exports.seed = function (connection, Promise) {
  return connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('topics')
      .insert(topicData)
      .returning('*'))
    .then(() => connection('users')
      .insert(userData)
      .returning('*'))
    .then(() => {
      const formattedArticles = formatArticles(articleData);
      return connection('articles')
        .insert(formattedArticles)
        .returning('*');
    })
    .then((articleRows) => {
      const articleRef = createRef(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(commentData, articleRef);
      return connection('comments')
        .insert(formattedComments)
        .returning('*');
    });
};
