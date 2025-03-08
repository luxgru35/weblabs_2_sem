const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const morganLogger = require('./middlewares/morganLogger');

const app = express();

// Swagger
const swaggerDocument = yaml.load(fs.readFileSync('./src/docs/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(express.json());
app.use(cors());
app.use(morganLogger);
app.use('/api', routes);
app.use(errorHandler);


module.exports = app;
