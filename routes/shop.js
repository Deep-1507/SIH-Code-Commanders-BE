import express from 'express';
import { createShop,loginShop  } from '../controllers/shop.js';

const router = express.Router();
router.post('/create-shop', createShop);
router.post('/login-shop', loginShop);






export default router;