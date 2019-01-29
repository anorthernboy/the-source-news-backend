const connection = require('../connection');

exports.fetchTopics = () => {
  return connection('topics')
    .select('*');
};

// exports.addNewTopic = (body) => {
//   return connection.insert({
//       slug: body.slug,
//       description: body.description,
//     }).into('topics')
//     .returning('*');
// };

exports.fetchArticlesByTopic = (topic) => {
  return connection('articles')
    .select('*')
    .where('articles.topic', topic);
};