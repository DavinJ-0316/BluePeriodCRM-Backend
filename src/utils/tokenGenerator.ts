import { randomBytes } from 'crypto';

const generateToken = (): string => randomBytes(32).toString('hex');

export default generateToken;
