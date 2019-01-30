const connection = require('../connection');


exports.fetchArticles = () => {
  return connection('articles')
    .select('*');
};

exports.fetchArticlesById = (article_id) => {
  return connection('articles')
    .select('*')
    .where('articles.article_id', article_id);
};

// exports.updateArticle = () => {

// };

// exports.removeArticle = () => {

// };

exports.fetchCommentsByArticleId = (article_id) => {
  return connection('comments')
    .select('*')
    .where('comments.article_id', article_id);
};

exports.addNewComment = (comment) => {
  return connection('comments')
    .insert(comment)
    .returning('*');
};

// exports.updateVote = () => {

// };

// exports.deleteComment = () => {

// };