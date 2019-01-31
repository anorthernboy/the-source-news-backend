const {
  fetchArticles,
  fetchArticlesById,
  updateArticle,
  removeArticle,
  fetchCommentsByArticleId,
  addNewComment,
  updateVote,
  removeComment,
} = require('../db/models/articles-model');


exports.getArticles = (req, res, next) => {
  const {
    limit,
    sort_by,
    order,
  } = req.query;
  fetchArticles(limit, sort_by, order)
    .then((articles) => {
      const displayArticles = articles.reduce((acc, curr) => {
        acc.articles.push(curr);
        return acc;
      }, {
        total_count: articles.length,
        articles: [],
      });

      res.status(200).json({
        displayArticles,
      });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }

      const displayArticle = article.reduce((acc, curr) => {
        acc = curr;
        return acc;
      }, {});

      return res.status(200).json({
        displayArticle,
      });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;

  const {
    inc_votes,
  } = req.body;

  updateArticle(article_id, inc_votes)
    .then(article => res.status(200).json({
      article,
    }))
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  removeArticle(article_id)
    .then(article => res.status(204).json({
      article,
    }))
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  const {
    limit,
    sort_by,
    sort_ascending,
  } = req.query;
  fetchCommentsByArticleId(article_id, limit, sort_by, sort_ascending)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }
      return res.status(200).json({
        comments,
      });
    })
    .catch(next);
};

exports.addCommentByArticleId = (req, res, next) => {
  const {
    article_id,
  } = req.params;

  req.body.article_id = article_id;

  addNewComment(req.body)
    .then(comment => res.status(201).json({
      comment,
    }))
    .catch(next);
};

exports.patchArticleCommentVoteByCommentId = (req, res, next) => {
  const {
    article_id,
    comment_id,
  } = req.params;

  const {
    inc_votes,
  } = req.body;

  updateVote(article_id, comment_id, inc_votes)
    .then(comment => res.status(200).json({
      comment,
    }))
    .catch(next);
};

exports.deleteArticleCommentByCommentId = (req, res, next) => {
  const {
    article_id,
    comment_id,
  } = req.params;
  removeComment(article_id, comment_id)
    .then(comment => res.status(204).json({
      comment,
    }))
    .catch(next);
};
