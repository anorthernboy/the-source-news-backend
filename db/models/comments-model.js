const connection = require('../connection');


exports.fetchComments = () => {
  return connection('comments')
    .select('*');
};