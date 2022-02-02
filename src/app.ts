import 'dotenv/config';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import morgan from 'morgan';
import cors from 'cors';
import apiRouter from '@routes/api.route';
import indexRouter from '@routes/index.route';
import { error404, routeError, otherError } from '@middleware/error';

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('./utils/swagger');

const app = express();

app.use(helmet());

const morganLog =
  process.env.NODE_ENV === 'development'
    ? morgan('dev')
    : morgan('common', {
        skip(req: Request, res: Response) {
          if (req.url === '/health') {
            return res.statusCode < 400;
          }
          return false;
        },
      });

app.use(morganLog);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    exposedHeaders: 'Authorization',
    origin: [
      'http://localhost:8000',
      'https://devilscrm.link',
      'http://localhost:3000',
      'https://blueperiod.link',
      'http://blueperiod.link',
      '*',
    ],
    credentials: true,
  }),
);

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

app.all('*', routeError);
app.use(error404);
app.use(otherError);

export default app;
