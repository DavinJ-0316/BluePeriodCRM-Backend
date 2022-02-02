import express from 'express';
import {
  getAllProducts,
  getProductBySku,
  createProduct,
  updateProductBySku,
  deleteProductBySku,
} from '@controllers/products.controller';

const productRouter = express.Router();

productRouter.get('', getAllProducts);
productRouter.post('', createProduct);
productRouter.put('/:sku', updateProductBySku);
productRouter.delete('/:sku', deleteProductBySku);
productRouter.get('/:sku',   getProductBySku);

export default productRouter;
