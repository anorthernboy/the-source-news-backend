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

exports.updateArticle = (article_id, inc_votes) => {
  return connection('articles')
    .where('article_id', article_id)
    .update({
      votes: inc_votes,
    })
    .returning('*')
};

exports.removeArticle = (article_id) => {
  return connection('articles')
    .where('article_id', article_id)
    .del();
};

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

exports.updateVote = (article_id, comment_id, inc_votes) => {
  return connection('comments')
    .where('article_id', article_id)
    .andWhere('comment_id', comment_id)
    .update({
      votes: inc_votes,
    })
    .returning('*');
};

exports.removeComment = (article_id, comment_id) => {
  return connection('comments')
    .where('article_id', article_id)
    .andWhere('comment_id', comment_id)
    .del();
};