exports.getEndpoints = (req, res, next) => {
  res.status(200).json({
    cw_news: {
      1: 'topics',
      2: 'users',
      3: 'articles',
      4: 'comments',
    },
  });
};