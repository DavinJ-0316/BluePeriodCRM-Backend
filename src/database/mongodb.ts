import mongoose from 'mongoose';
import logger from '@config/winston';

export default async () => {
  const {
    DB_HOST_LOCAL,
    DB_PORT,
    DB_DATABASE_LOCAL,
    NODE_ENV,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DATABASE,
    DB_HOST_UAT,
  } = process.env;

  let connectionString: string;

  if (NODE_ENV === 'production') {
    connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;
  } else if (NODE_ENV === 'uat') {
    connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST_UAT}/${DB_DATABASE}`;
  } else {
    connectionString = `mongodb://${DB_HOST_LOCAL}:${DB_PORT}/${DB_DATABASE_LOCAL}`;
  }

  if (!connectionString) {
    logger.error('connection string not defined');
    process.exit(1);
  }

  const connect = async (): Promise<void> => {
    try {
      await mongoose.connect(connectionString);
      logger.info(`Successfully connected to database: ${DB_NAME}, ${connectionString}`);
      return;
    } catch (error) {
      logger.error('Error connecting to database: ', error);
      process.exit(1);
    }
  };
  connect();

  mongoose.connection.on('disconnected', () => {
    logger.info('mongodb connection lost');
  });
};
