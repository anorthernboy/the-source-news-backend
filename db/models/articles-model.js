const connection = require('../connection');


exports.fetchArticles = (limit = 10, sort_by = 'articles.created_at', order = 'DESC') => connection('articles')
  .select('*')
  .limit(limit)
  .orderBy(sort_by, order);

exports.fetchArticlesById = article_id => connection('articles')
  .select('*')
  .where('articles.article_id', article_id);

exports.updateArticle = (article_id, inc_votes) => connection('articles')
  .where('article_id', article_id)
  .update({
    votes: inc_votes,
  })
  .returning('*');

exports.removeArticle = article_id => connection('articles')
  .where('article_id', article_id)
  .del();

exports.fetchCommentsByArticleId = (article_id, limit = 10, sort_by = 'comments.created_at', order = 'DESC') => connection('comments')
  .select('*')
  .limit(limit)
  .orderBy(sort_by, order)
  .where('comments.article_id', article_id);

exports.addNewComment = comment => connection('comments')
  .insert(comment)
  .returning('*');

exports.updateVote = (article_id, comment_id, inc_votes) => connection('comments')
  .where('article_id', article_id)
  .andWhere('comment_id', comment_id)
  .update({
    votes: inc_votes,
  })
  .returning('*');

exports.removeComment = (article_id, comment_id) => connection('comments')
  .where('article_id', article_id)
  .andWhere('comment_id', comment_id)
  .del();
