const {
  articleData,
  topicData,
  userData,
  commentData
} = require('../data/index');

exports.seed = function (connection, Promise) {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('topics').insert(topicData).returning('*'))
    .then(topicRows => {
      console.log(topicRows)
    });
};