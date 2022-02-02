import connectToDB from '@database/mongodb';
import logger from '@config/winston';
import app from './app';

connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}`);
});
