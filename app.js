const express = require('express');
const cors = require('cors');

const app = express();

const apiRoutes = require('./routes/api');

app.use(cors());
app.use('/api', apiRoutes);

app.listen(8888, () => {
  console.log('Express server puerto 8888: \x1b[32m%s\x1b[0m', 'online');
});

