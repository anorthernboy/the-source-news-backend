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
  message: 'the method is not available on this path',
});

exports.send422 = (req, res, next) => next({
  status: 422,
  message: 'an element of the body is not valid',
});

exports.send500 = (req, res, next) => next({
  status: 500,
  message: 'internal server error',
});

exports.handle400 = (err, req, res, next) => {
  if (err.code === '42703') {
    res.status(400).json({
      status: 400,
      msg: 'the column does not exist',
    });
  }
  if (err.status === 400) {
    res.status(400).json({
      status: 400,
      msg: 'the body or parameter is not in the correct form',
    });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).json({
      status: 404,
      msg: 'the path does not exist in the api',
    });
  } else next(err);
};

exports.handle405 = (err, req, res, next) => {
  if (err.status === 405) {
    res.status(405).json({
      status: 405,
      msg: 'the method is not available on this path',
    });
  } else next(err);
};

exports.handle422 = (err, req, res, next) => {
  if (err.status === 422) {
    res.status(422).json({
      status: 422,
      msg: 'an element of the body is not valid',
    });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).json({
      status: 500,
      msg: 'internal server error',
    });
  } else next(err);
};
