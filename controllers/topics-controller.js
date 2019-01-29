const {
  fetchTopics,
  addNewTopic,
  fetchArticlesByTopic,
  addNewArticle,
} = require("../db/models/topics-model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics =>
      res.status(200).json({
        topics
      })
    )
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
  fetchArticlesByTopic(topic)
    .then(articles => res.status(200).json({
      articles,
    }))
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  const {
    topic
  } = req.params;

  req.body.topic = topic;

  addNewArticle(req.body)
    .then(article => res.status(201).json({
      article
    }))
    .catch(next);
};