const {
  fetchTopics,
  addNewTopic,
  fetchAllArticlesByTopic,
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
  const {
    slug,
    description,
  } = req.body;
  if (!slug || !description) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return addNewTopic(req.body)
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

  fetchAllArticlesByTopic(topic)
    .then((topics) => {
      const allowedTopics = topics.filter(topicObject => topicObject.topic === topic);
      if (allowedTopics.length === 0) {
        return Promise.reject({
          status: 400,
          message: 'bad request',
        });
      }
      return fetchArticlesByTopic(topic, limit, sort_by, order)
        .then((result) => {
          if (result.length === 0) {
            return Promise.reject({
              status: 404,
              message: 'not found',
            });
          }
          const articles = result.reduce((acc, curr) => {
            acc.articles.push(curr);
            return acc;
          }, {
            total_count: topics.length,
            articles: [],
          });
          return res.status(200).json(articles);
        });
    })
    .catch(next);
};

//   fetchArticlesByTopic(topic, limit, sort_by, order)
//     .then((result) => {
//       if (result.length === 0) {
//         return Promise.reject({
//           status: 404,
//           message: 'not found',
//         });
//       }
//       const articles = result.reduce((acc, curr) => {
//         acc.articles.push(curr);
//         return acc;
//       }, {
//         total_count: result.length,
//         articles: [],
//       });

//       return res.status(200).json(articles);
//     })
//     .catch(next);
// };

exports.addArticleByTopic = (req, res, next) => {
  const {
    topic,
  } = req.params;
  const {
    title,
    body,
    username,
  } = req.body;

  req.body.topic = topic;

  if (!title || !body || !username) {
    return next({
      status: 400,
      message: 'bad request',
    });
  }
  return addNewArticle(req.body)
    .then(([article]) => res.status(201).json({
      article,
    }))
    .catch(next);
};
