exports.handle400 = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).json({
      msg: 'bad request',
    });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).json({
      msg: 'not found',
    });
  } else next(err);
};
