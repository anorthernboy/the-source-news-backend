const {
  fetchTopics,
  addNewTopic,
  fetchArticlesByTopic,
  addNewArticle,
} = require('../db/models/topics-model');

exports.send405Error = (req, res, next) => next({
  status: 405,
  message: 'method not allowed',
});

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => res.status(200).json({
      topics,
    }))
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  addNewTopic(req.body)
    .then(([topic]) => res.status(201).json({
      topic,
    }))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const {
    topic,
  } = req.params;
  const {
    limit,
    sort_by,
    order,
  } = req.query;

  fetchArticlesByTopic(topic, limit, sort_by, order)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }

      const articles = result.reduce((acc, curr) => {
        acc.result.push(curr);
        return acc;
      }, {
        total_count: result.length,
        articles: [],
      });

      return res.status(200).json({
        articles,
      });
    })
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  const {
    topic,
  } = req.params;

  req.body.topic = topic;

  addNewArticle(req.body)
    .then(([article]) => res.status(201).json({
      article,
    }))
    .catch(next);
};
