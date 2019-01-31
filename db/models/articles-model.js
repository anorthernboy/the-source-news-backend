const connection = require('../connection');


exports.fetchArticles = (limit = 10, sort_by = 'articles.created_at', order = 'DESC') => connection('articles')
  .select('articles.username', 'articles.title', 'articles.article_id', 'articles.body', 'articles.votes', 'articles.created_at', 'articles.topic')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .count('comments.article_id as comment_count')
  .groupBy('articles.article_id')
  .limit(limit)
  .orderBy(sort_by, order);

exports.fetchArticlesById = article_id => connection('articles')
  .select('articles.article_id', 'articles.username', 'articles.title', 'articles.votes', 'articles.body', 'articles.created_at', 'articles.topic')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .count('comments.article_id as comment_count')
  .groupBy('articles.article_id')
  .where('articles.article_id', article_id);

// exports.fetchArticlesById = article_id => connection('articles')
//   .select('*')
//   .where('articles.article_id', article_id);

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
