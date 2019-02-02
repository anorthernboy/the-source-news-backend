exports.send400 = (req, res, next) => next({
  status: 400,
  message: 'bad request',
});

exports.send404 = (req, res, next) => next({
  status: 404,
  message: 'not found',
});

exports.send405 = (req, res, next) => next({
  status: 405,
  message: 'method not allowed',
});

exports.send422 = (req, res, next) => next({
  status: 422,
  message: 'unable to process',
});

exports.send500 = (req, res, next) => next({
  status: 500,
  message: 'internal server error',
});

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

exports.handle405 = (err, req, res, next) => {
  if (err.status === 405) {
    res.status(405).json({
      msg: 'method not allowed',
    });
  } else next(err);
};

exports.handle422 = (err, req, res, next) => {
  if (err.status === 422) {
    res.status(422).json({
      msg: 'unable to process',
    });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).json({
      msg: 'internal server error',
    });
  } else next(err);
};
