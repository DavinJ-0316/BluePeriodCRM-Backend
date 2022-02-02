import express from 'express';
import { authValidator, isAdmin } from '@middleware/authAccess';
import {
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
} from '@controllers/users.controller';

const router = express.Router();

router.get('/', authValidator, getUsers);
router.get('/verifyEmail', verifyEmail);
router.get('/:email', getOneUser);
router.post('/signup', signUp);
router.post('/login', signIn);
router.post('/forgotPassword', forgotPassword);
router.put('/:email', updateUser);
router.patch('/resetPassword', resetPassword);
router.patch('/updateMe', updateMe);
router.patch('/updateMyPassword', updatePassword);
router.patch('/deleteMe', deleteMe);
router.delete('/:email', authValidator, isAdmin('admin'), deleteUser);

export default router;
