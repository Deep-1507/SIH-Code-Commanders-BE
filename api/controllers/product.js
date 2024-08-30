import { Router } from "express";
const router = Router();
import { v2 } from "cloudinary";
import errorHandler from "../utils/error";
import shop from "../models/shop";
import product from "../models/product";

// create product
router.post(
  "/create-product",
  async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const newShop = await shop.findById(shopId);
      if (!newShop) {
        return next(new errorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
      
        for (let i = 0; i < images.length; i++) {
          const result = await v2.uploader.upload(images[i], {
            folder: "products",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;

        const products = await product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new errorHandler(error, 400));
    }
  }
);

export default router;