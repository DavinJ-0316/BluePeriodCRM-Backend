import express from 'express';
import IndexController from '@controllers/index.controller';

const router = express.Router();

router.get('/', IndexController);

export default router;
