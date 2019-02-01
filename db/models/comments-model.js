const connection = require('../connection');

exports.fetchComments = () => connection('comments')
  .select('*');
