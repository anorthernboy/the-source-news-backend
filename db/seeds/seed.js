const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../data/index');

const {
  createRef,
  createArticleRef,
  formatArticles,
  formatComments,
} = require('../utils/index');

exports.seed = function (connection, Promise) {
  return connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('topics').insert(topicData).returning('*'))
    .then((topicRows) => {
      const userRows = connection('users').insert(userData).returning('*');
      return Promise.all([userRows, topicRows]);
    })
    .then(([userRows, topicRows]) => {
      const userRef = createRef(userRows, 'username');

      const topicRef = createRef(topicRows, 'slug');

      const formattedArticles = formatArticles(articleData, topicRef, userRef);

      const articleRows = connection('articles').insert(formattedArticles).returning('*');

      return Promise.all([articleRows, userRows]);
    })
    .then(([articleRows, userRows]) => {
      const articleRef = createArticleRef(articleRows, 'title', 'article_id');

      const userRef = createRef(userRows, 'username');

      const formattedComments = formatComments(commentData, userRef, articleRef);

      const commentRows = connection('comments').insert(formattedComments).returning('*');

      return Promise.all([commentRows, articleRows]);
    });
};
