const {
  articleData,
  topicData,
  userData,
  commentData
} = require('../data/index');

const {
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

      // formats articles
      const formattedArticles = formatArticles(articleData, topicRows, userRows)

      console.log(topicRows)

      const articleRows = connection('articles').insert(formattedArticles).returning('*')
      return Promise.all([articleRows, userRows])
    })
    .then(([articleRows, userRows]) => {

      // formats comments
      const formattedComments = formatComments(commentData, userRows, articleRows)

      return connection('comments').insert(formattedComments).returning('*')
    });
};