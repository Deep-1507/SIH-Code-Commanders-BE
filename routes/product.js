import express from 'express';
import createProduct from '../controllers/product.js';
const router = express.Router();

router.post('/create-product', createProduct);


export default router;
