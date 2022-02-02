import { Request, Response, RequestHandler } from 'express';
import crypto from 'crypto';
import { generateJWTToken } from '@utils/jwt';
import User from '@models/users.model';
import { hashPassword, comparePassword } from '@utils/passwordHandler';
import { validateEmail, validatePassword } from '@utils/validator';
import { emailTemplate, sendEmail } from '@utils/emailServices';
import generateToken from '@utils/tokenGenerator';
import type { IUser } from '../types/users';

const createSendToken = (user: IUser, statusCode: number, res: Response, msg: string) => {
  const token = generateJWTToken(user.userId, user.role);

  if (!token) {
    return res.status(401).json({ error: 'Cannot sign the token' });
  }

  return res
    .set('Authorization', token)
    .status(statusCode)
    .json({
      message: msg,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
      },
    });
};

const { NODE_ENV } = process.env;

// create user

const signUp: RequestHandler = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, confirmedPassword } = req.body;

  const hashedPassword = await hashPassword(password);

  if (!email || !firstName || !lastName || !password || !confirmedPassword || !phone) {
    return res.status(400).json({ error: 'Please enter all required data!' });
  }
  const passwordValidataResult = validatePassword(password);
  if (!passwordValidataResult) {
    return res.status(400).json({
      error:
        'Password should be 8-32 characters and include at least 1 letter, 1 number and 1 special character (@,#,$,%,^,_,&,*)!',
    });
  }

  if (password !== confirmedPassword) {
    return res.status(400).json({ error: "The passwords don't match." });
  }

  const emailValidateResult = validateEmail(email);
  if (!emailValidateResult) {
    return res.status(400).json({
      error: 'It should be a valid email address!"',
    });
  }

  // check if user exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(403).json({ error: 'This email has already been existed!' });
  }

  // send confirm email
  const confirmEmailToken = generateToken();

  let confirmEmailLink: string;
  if (NODE_ENV === 'production') {
    confirmEmailLink = `${'https://blueperiod.link'}/emailActivation?token=${confirmEmailToken}`;
  } else if (NODE_ENV === 'uat') {
    confirmEmailLink = `${'https://devilscrm.link'}/emailActivation?token=${confirmEmailToken}`;
  } else {
    confirmEmailLink = `${'http://localhost:8000'}/emailActivation?token=${confirmEmailToken}`;
  }

  const emailContent = emailTemplate.confirmEmail(firstName, confirmEmailLink);

  const sendEmailResult = await sendEmail(email, 'Verify you email', emailContent);

  if (!sendEmailResult) {
    return res.status(500).json({ error: 'Email server error' });
  }

  try {
    // create new user
    const newUser: IUser = await User.create({
      email,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      role: req.body.role,
      confirmEmailToken,
      emailVerified: false,
    });

    if (newUser.role === '') {
      return res.status(403).json({
        error: 'This user is failing to create!',
      });
    }

    createSendToken(newUser, 200, res, 'Congratulations! Check your email to verify!');
  } catch (error) {
    return res.status(403).json((error as Error).message);
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password!' });
  }

  try {
    const currentUser = await User.findOne({ email }).select('+password');

    if (!currentUser) {
      return res.status(401).json({ error: 'User does not exist!' });
    }
    if (currentUser.emailVerified === false) {
      return res.status(401).json({ error: 'Please verify your email' });
    }
    if (currentUser.active === false) {
      return res.status(401).json({ error: 'This email is inactive' });
    }

    const correctPassword = await comparePassword(password, currentUser.password);

    if (!correctPassword) {
      return res.status(401).json({ error: 'Invalid password!' });
    }

    createSendToken(currentUser, 200, res, 'Logged in');
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

const updatePassword: RequestHandler = async (req: Request, res: Response) => {
  const { email, currentPassword, password, confirmedPassword } = req.body;

  // Get user from collection
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ error: 'User does not exist!' });
  }

  try {
    // Check if POSTed current password is correct
    const correctPassword = await comparePassword(currentPassword, user.password);
    if (!correctPassword) {
      return res.status(401).json({ error: 'Your current password is wrong!' });
    }
    // Validate the password pattern
    const passwordValidataResult = validatePassword(password);
    if (!passwordValidataResult) {
      return res.status(400).json({
        error:
          'Password should be 8-32 characters and include at least 1 letter, 1 number and 1 special character (@,#,$,%,^,_,&,*)!',
      });
    }
    // Check confirmed Password is match
    if (password !== confirmedPassword) {
      return res.status(400).json({ error: "The passwords don't match." });
    }

    const hashedPassword = await hashPassword(password);
    // If so, update pasword
    user.password = hashedPassword;
    await user.save();
    // Keep user logged in
    createSendToken(user, 200, res, 'Seccessful! Please log in!');
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

const updateMe = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password, confirmedPassword, phone } = req.body;
  if (password || confirmedPassword) {
    return res.status(400).json({ error: 'This route is not for password updates.' });
  }
  const updateInfo = { firstName, lastName, phone };

  const updatedCurrentUser = await User.findOneAndUpdate({ email }, updateInfo, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    user: updatedCurrentUser,
  });
};

// inactive current User
const deleteMe = async (req: Request, res: Response) => {
  const { email } = req.body;
  await User.findOneAndUpdate({ email }, { active: false });
  res.status(204).json({ data: null });
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().exec();
    if (!users) {
      res.status(400).json({ error: 'User does not exist!' });
    }
    return res.status(200).json(users);
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

const forgotPassword: RequestHandler = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ error: `There is no user with this email address.` });
  }

  const resetToken = generateToken();

  const passwordExpires = new Date(Date.now() + 10 * 60 * 1000);

  // expired 10mins
  try {
    await User.findOneAndUpdate(
      { email: user.email },
      { $set: { resetPasswordToken: resetToken, resetPasswordExpires: passwordExpires } },
    );
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }

  let resetPasswordLink: string;
  if (NODE_ENV === 'production') {
    resetPasswordLink = `${'https://blueperiod.link'}/resetPassword?token=${resetToken}`;
  } else if (NODE_ENV === 'uat') {
    resetPasswordLink = `${'https://devilscrm.link'}/resetPassword?token=${resetToken}`;
  } else {
    resetPasswordLink = `${'http://localhost:8000'}/resetPassword?token=${resetToken}`;
  }

  const emailContent = emailTemplate.resetPasswordEmail(user.firstName, resetPasswordLink);
  const sendEmailResult = await sendEmail(req.body.email, 'Password change request', emailContent);
  if (!sendEmailResult) {
    return res.status(500).json({ error: 'Email server error' });
  }

  return res.status(200).json({
    message: `A reset password email has been sent to ${req.body.email}, please check your email.`,
  });
};

const resetPassword: RequestHandler = async (req: Request, res: Response) => {
  const { password, confirmedPassword, token } = req.body;

  if (!password || !confirmedPassword) {
    return res.status(400).json({ error: 'Please enter all required data!' });
  }
  if (token === '') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const passwordValidataResult = validatePassword(password);
  if (!passwordValidataResult) {
    return res.status(400).json({
      error:
        'Password should be 8-32 characters and include at least 1 letter, 1 number and 1 special character (@,#,$,%,^,_,&,*)!',
    });
  }

  if (password !== confirmedPassword) {
    return res.status(400).json({ error: "The passwords don't match." });
  }
  try {
    const requestUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date(Date.now()) },
    });
    if (!requestUser) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }

  const user = { resetPasswordToken: token };

  const hashedPassword = await hashPassword(password);
  const updatedPassword = { password: hashedPassword };
  const removeToken = { $unset: { resetPasswordToken: '' } };
  const removeTokenExpires = { resetPasswordExpires: undefined };

  try {
    await User.findOneAndUpdate(user, updatedPassword, { new: true });
    await User.findOneAndUpdate(user, removeToken, { new: true });
    await User.findOneAndUpdate(user, removeTokenExpires, { new: true });
    return res.status(200).json({ message: 'Password reset successfully! Please login' });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getOneUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: `${email}` }).exec();
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    return res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

const deleteUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: String(email) }).exec();
    if (user) {
      await User.deleteOne({ email: String(email) });
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: `${email} not found` });
    }
  } catch (e) {
    res.status(400).json((e as Error).message);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { firstName, lastName, phone, password } = req.body;

  if (!firstName || !lastName || !password || !phone) {
    return res.status(400).json({ error: 'Input fields cannot be empty.' });
  }

  try {
    const userByEmail = await User.findOne({ email: `${email}` });
    if (!userByEmail) {
      res.status(404).json({ error: `${email} not found` });
    } else {
      const userUpdate = await User.findOneAndUpdate(
        { email: `${email}` },
        {
          firstName,
          lastName,
          phone,
          password,
        },
        { new: true },
      ).exec();
      return res.status(200).json(userUpdate);
    }
  } catch (e) {
    return res.status(400).json((e as Error).message);
  }
};

const verifyEmail: RequestHandler = async (req: Request, res: Response) => {
  const { token } = req.query;
  const tokenString = token?.toString();
  if (tokenString?.trim() === '') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const user = { confirmEmailToken: tokenString };

    const existingUser = await User.findOne(user);
    if (!existingUser) return res.status(401).json({ error: 'Invalid token.' });

    const updateEmailVerification = { $set: { emailVerified: true } };
    const removeConfirmToken = { $unset: { confirmEmailToken: '' } };

    await User.findOneAndUpdate(user, updateEmailVerification, { new: true });
    await User.findOneAndUpdate(user, removeConfirmToken, { new: true });

    return res.status(201).json({ email: existingUser.email, message: 'Email verified. Please Login!' });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

export {
  getUsers,
  getOneUser,
  deleteUser,
  updateUser,
  signUp,
  signIn,
  updatePassword,
  updateMe,
  deleteMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
