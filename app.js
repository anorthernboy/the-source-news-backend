const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-route');

const {
  handle400,
  handle404,
} = require('./errors/index');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
});

// app.use(handle400);

// app.use(handle404);

module.exports = app;