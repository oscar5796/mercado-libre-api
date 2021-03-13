var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

app.listen(8888, () => {
  console.log('Express server puerto 8888: \x1b[32m%s\x1b[0m', 'online');
});

