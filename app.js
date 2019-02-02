const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-route');
const {
  handle400,
  handle404,
  handle405,
  handle422,
  handle500,
} = require('./errors/index');
const {
  send404,
} = require('./errors/index');

app.use(bodyParser.json());
app.use('/', apiRouter);
app.use('/api', apiRouter);
app.use('/*', send404);
app.use(handle400);
app.use(handle404);
app.use(handle405);
app.use(handle422);
app.use(handle500);

module.exports = app;