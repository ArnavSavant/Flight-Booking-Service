const express = require('express');

const {serverConfig, Logger} = require('./config');
const routes = require('./routes');
const {CRONS} = require('./utils/common')
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use('/api',routes);

app.listen(serverConfig.PORT, () => {
	console.log(`Succesfully listening on PORT: ${serverConfig.PORT}`);
	CRONS();
});