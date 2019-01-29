const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-route');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({
    err
  })
})

module.exports = app;