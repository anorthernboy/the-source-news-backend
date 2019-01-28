const {
  articleData,
  topicData,
  userData,
  commentData
} = require('../data/index');

const {
  createRef,
  formatArticles,
  formatComments
} = require('../data/utils/index');

exports.seed = function (connection, Promise) {
  return connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => {
      return connection('topics').insert(topicData).returning('*')
    })
    .then((topicRows) => {
      const userRows = connection('users').insert(userData).returning('*')
      return Promise.all([userRows, topicRows])
    })
    .then(([userRows, topicRows]) => {

      const userRef = createRef(userRows, 'username');

      const topicRef = createRef(topicRows, 'slug');

      const formattedArticles = formatArticles(articleData, topicRef, userRef);

      console.log(formattedArticles)

      const articleRows = connection('articles').insert(formattedArticles).returning('*')
      return Promise.all([articleRows, userRows])
    })
    .then(([articleRows, userRows]) => {

      const articleRef = createRef(articleRows, 'article_id');

      const userRef = createRef(userRows, 'username');

      const formattedComments = formatComments(commentData, userRef, articleRef)

      return connection('comments').insert(formattedComments).returning('*')
    });
};