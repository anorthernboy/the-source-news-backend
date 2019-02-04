const {
  fetchAllArticles,
  fetchArticles,
  fetchArticlesById,
  updateArticle,
  removeArticle,
  fetchCommentsByArticleId,
  addNewComment,
  fetchAllArticlesAndComments,
  updateVote,
  removeComment,
} = require('../db/models/articles-model');

exports.getArticles = (req, res, next) => {
  const {
    limit,
    sort_by,
    order,
    p,
  } = req.query;

  fetchAllArticles()
    .then(allArticles => fetchArticles(limit, sort_by, order, p)
      .then((result) => {
        const articles = result.reduce((acc, curr) => {
          acc.articles.push(curr);
          return acc;
        }, {
          total_count: allArticles.length,
          articles: [],
        });
        res.status(200).json(articles);
      }))
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'the body or parameter is not in the correct form',
    });
  }
  return fetchArticlesById(article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          message: 'the path does not exist in the api',
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
  if (isNaN(+article_id) || !inc_votes || typeof inc_votes !== 'number') {
    return next({
      status: 400,
      message: 'the body or parameter is not in the correct form',
    });
  }
  return fetchAllArticles()
    .then((articles) => {
      const allowedArticles = articles.filter(articleObject => articleObject.article_id === (+article_id));
      if (allowedArticles.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'the path does not exist in the api',
        });
      }
      return updateArticle(article_id, inc_votes)
        .then(([article]) => {
          res.status(200).json(article);
        });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const {
    article_id,
  } = req.params;
  if (!article_id) {
    return next({
      status: 404,
      message: 'the path does not exist in the api',
    });
  }
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'the body or parameter is not in the correct form',
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
    order,
    p,
  } = req.query;
  if (isNaN(+article_id)) {
    return next({
      status: 400,
      message: 'the body or parameter is not in the correct form',
    });
  }
  return fetchCommentsByArticleId(article_id, limit, sort_by, order, p)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'the path does not exist in the api',
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
  const {
    body,
    username,
  } = req.body;
  req.body.article_id = article_id;
  if (isNaN(+article_id) || !body || !username) {
    return next({
      status: 400,
      message: 'the body or parameter is not in the correct form',
    });
  }
  return fetchAllArticles()
    .then((articles) => {
      const allowedArticles = articles.filter(articleObject => articleObject.article_id === (+article_id));
      if (allowedArticles.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'the path does not exist in the api',
        });
      }
      return addNewComment(req.body)
        .then(([comment]) => {
          res.status(201).json(comment);
        });
    })
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
  if (isNaN(+comment_id) || isNaN(+article_id) || !inc_votes || typeof inc_votes !== 'number') {
    return next({
      status: 400,
      message: 'the body or parameter is not in the correct form',
    });
  }
  return fetchAllArticlesAndComments()
    .then((artAndCom) => {
      const allowedArticles = artAndCom.filter(artAndComObject => artAndComObject.article_id === (+article_id));
      const allowedComments = artAndCom.filter(artAndComObject => artAndComObject.comment_id === (+comment_id));
      if (allowedArticles.length === 0 || allowedComments.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'the path does not exist in the api',
        });
      }
      return updateVote(article_id, comment_id, inc_votes)
        .then(([comment]) => {
          res.status(200).json(comment);
        });
    })
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
      message: 'the body or parameter is not in the correct form',
    });
  }
  return fetchAllArticlesAndComments()
    .then((artAndCom) => {
      const allowedArticles = artAndCom.filter(artAndComObject => artAndComObject.article_id === (+article_id));
      const allowedComments = artAndCom.filter(artAndComObject => artAndComObject.comment_id === (+comment_id));
      if (allowedArticles.length === 0 || allowedComments.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'the path does not exist in the api',
        });
      }
      return removeComment(article_id, comment_id)
        .then(() => {
          res.status(204).json();
        });
    })
    .catch(next);
};
