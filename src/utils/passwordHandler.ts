import bcrypt from 'bcryptjs';
import logger from '@config/winston';

const hashPassword = async (pw: string) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(pw, salt);
    return hashedPassword;
  } catch (error: unknown) {
    logger.error(error);
    throw new Error('password must be provided');
  }
};

const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    if (await bcrypt.compare(candidatePassword, hashedPassword)) {
      return true;
    }
    return false;
  } catch (error: unknown) {
    logger.error(error);
    throw new Error('password and hash is required to compare');
  }
};

export { hashPassword, comparePassword };
