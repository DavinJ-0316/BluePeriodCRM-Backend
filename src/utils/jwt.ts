import jwt, { Secret } from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: string;
}

const generateJWTToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET as Secret;
  const token = jwt.sign({ id, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  return token;
};

const validateToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET as Secret;

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return error as JwtPayload;
  }
};
export { generateJWTToken, validateToken };
