const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const config = require('./config.sample');
const routes = require('./routes.js');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));

routes(app);
app.use(history());
app.use(express.static('./images'));
app.use(express.static('../report-viewer/dist'));

app.listen(config.API_SERVER_PORT, () => console.log(`Server is listening on port ${config.API_SERVER_PORT}`));
