import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import Product from '../models/product.js';
import Shop from '../models/shop.js';

const router = express.Router();

router.use(fileUpload({
  createParentPath: true,
}));

const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, tags, originalPrice, discountPrice, stock, shopId } = req.body;
    const images = req.files?.images; // Handle multiple files
console.log(images)
    // Check if shop ID is valid
    const existingShop = await Shop.findById(shopId);
    if (!existingShop) {
      return res.status(400).json({ message: 'Shop ID is invalid!' });
    }

    // Handle image uploads
    const imageLinks = [];

    if (images && Array.isArray(images)) {
      for (const image of images) {
        const uploadPath = path.join(__dirname, '../uploads/products', image.name);
        await image.mv(uploadPath);
        imageLinks.push(`/uploads/products/${image.name}`);
      }
    }

    // Create product
    const productData = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      image: imageLinks.length > 0 ? { url: imageLinks[0] } : {}, // Save first image URL or empty object
      shopId,
    };
    console.log(productData)

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default createProduct;
