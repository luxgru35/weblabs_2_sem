//app.js
import express, { json } from 'express';
import cors from 'cors';
import { serve, setup } from 'swagger-ui-express';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import morganLogger from './middlewares/morganLogger.js';
import passport from '../config/passport.js';

const app = express();

// Swagger
const swaggerDocument = load(readFileSync('./config/swagger.yaml', 'utf8'));
app.use('/api-docs', serve, setup(swaggerDocument));

// Middleware
app.use(json());
app.use(cors());
app.use(morganLogger);
app.use('/api', routes);
app.use(errorHandler);
app.use(passport.initialize());


export default app;
