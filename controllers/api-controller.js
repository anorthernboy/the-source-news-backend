exports.getEndpoints = (req, res, next) => {
  res.status(200).json({
    nc_knews: {
      1: 'topics',
      2: 'users',
      3: 'articles',
      4: 'comments',
    },
  });
};
