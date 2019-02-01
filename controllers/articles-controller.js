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

exports.send405Error = (req, res, next) => next({
  status: 405,
  message: 'method not allowed',
});

exports.getArticles = (req, res, next) => {
  const {
    limit,
    sort_by,
    order,
  } = req.query;
  fetchArticles(limit, sort_by, order)
    .then((result) => {
      const articles = result.reduce((acc, curr) => {
        acc.articles.push(curr);
        return acc;
      }, {
        total_count: result.length,
        articles: [],
      });
      res.status(200).json(articles);
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return fetchArticlesById(article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }
      return res.status(200).json(article);
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
  if (!article_id) {
    return next({
      status: 404,
      message: 'not found',
    });
  }
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return updateArticle(article_id, inc_votes)
    .then(([article]) => res.status(200).json({
      article,
    }))
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  if (!article_id) {
    return next({
      status: 404,
      message: 'not found',
    });
  }
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return removeArticle(article_id)
    .then(() => res.status(204).send())
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
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return fetchCommentsByArticleId(article_id, limit, sort_by, sort_ascending)
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
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return addNewComment(req.body)
    .then(([comment]) => res.status(201).json({
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
  if (isNaN(+comment_id) || isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return updateVote(article_id, comment_id, inc_votes)
    .then(([comment]) => res.status(200).json({
      comment,
    }))
    .catch(next);
};

exports.deleteArticleCommentByCommentId = (req, res, next) => {
  const {
    article_id,
    comment_id,
  } = req.params;
  if (isNaN(+article_id) || isNaN(+comment_id)) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return removeComment(article_id, comment_id)
    .then(() => res.status(204).json())
    .catch(next);
};
