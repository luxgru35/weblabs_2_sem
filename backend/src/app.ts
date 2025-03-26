//app.ts
import express, { json } from 'express';
import cors from 'cors';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import routes from '@routes/index';
import morganLogger from '@middlewares/morganLogger';
import passport from '@config/passport';
import errorHandler from '@middlewares/errorHandler';

const app = express();

// Swagger
const swaggerDocument = load(
  readFileSync('./config/swagger.yaml', 'utf8'),
) as JsonObject;
app.use('/api-docs', serve, setup(swaggerDocument));

// Middleware
app.use(json());
app.use(cors());
app.use(morganLogger);
app.use('/api', routes);
app.use(passport.initialize());
app.use(errorHandler);

export default app;
