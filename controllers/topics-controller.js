const {
  fetchTopics,
  addNewTopic,
  fetchArticlesByTopic,
  addNewArticle,
} = require('../db/models/topics-model');


exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => res.status(200).json({
      topics,
    }))
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  addNewTopic(req.body)
    .then(topic => res.status(201).json({
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
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'not found',
        });
      }

      const displayArticles = articles.reduce((acc, curr) => {
        acc.articles.push(curr);
        return acc;
      }, {
        total_count: articles.length,
        articles: [],
      });

      return res.status(200).json({
        displayArticles,
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
    .then(article => res.status(201).json({
      article,
    }))
    .catch(next);
};
