import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import shop from "../models/shop.js";
import { errorHandler } from "../utils/error.js";

// create shop
export const createShop = async (req, res, next) => {
    
    try {
      const { name, email, password, address, phoneNumber, zipCode } = req.body;
      console.log("Request received:", req.body);
      
      // Create a new shop object with the incoming data
      const newShop = new shop({
        name,
        email,
        password,
        address,
        phoneNumber,
        zipCode,
      });

  
      // Save the new shop in the database
      const savedShop = await newShop.save();
  
      // Generate a token for the new shop
      const token = jwt.sign({ _id: savedShop._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiry time, can be adjusted as needed
      });
  
      // Return the token and shop details in the response
      res.status(201).json({
        success: true,
        message: "Shop created successfully",
        token,
        shop: {
          id: savedShop._id,
          name: savedShop.name,
          email: savedShop.email,
          address: savedShop.address,
          phoneNumber: savedShop.phoneNumber,
          zipCode: savedShop.zipCode,
        },
      });
  
    } catch (error) {
      return next(new errorHandler(error.message, 400));
    }
  }


// login shop
const sendShopToken = (shop, statusCode, res) => {
  // Generate a token
  const token = shop.getJwtToken(); // Ensure getJwtToken method is correctly implemented in shop model

  // Send response
  res.status(statusCode).json({
    success: true,
    token,
    shop: {
      id: shop._id,
      name: shop.name,
      email: shop.email,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      zipCode: shop.zipCode,
    },
  });
};

// Login route
export const loginShop = 
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new errorHandler("Please provide all fields!", 400));
      }

      const user = await shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new errorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new errorHandler("Invalid email or password", 400));
      }

      sendShopToken(user, 200, res); // Changed statusCode to 200 for successful login
    } catch (error) {
      return next( new errorHandler(error.message, 500));
    }
  }


 

// // load shop
// router.get(
//   "/getSeller",
//   isSeller,
// async (req, res, next) => {
//     try {
//       const seller = await shop.findById(req.seller._id);

//       if (!seller) {
//         return next(new errorhandler("User doesn't exists", 400));
//       }

//       res.status(200).json({
//         success: true,
//         seller,
//       });
//     } catch (error) {
//       return next(new errorhandler(error.message, 500));
//     }
//   })


// // log out from shop
// router.get(
//   "/logout",
//   async (req, res, next) => {
//     try {
//       res.cookie("seller_token", null, {
//         expires: new Date(Date.now()),
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//       });
//       res.status(201).json({
//         success: true,
//         message: "Log out successful!",
//       });
//     } catch (error) {
//       return next(new errorhandler(error.message, 500));
//     }
//   })

// // get shop info
// router.get(
//   "/get-shop-info/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const shop = await shop.findById(req.params.id);
//       res.status(201).json({
//         success: true,
//         shop,
//       });
//     } catch (error) {
//       return next(new errorhandler(error.message, 500));
//     }
//   })
// );



// // update seller info
// router.put(
//   "/update-seller-info",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { name, description, address, phoneNumber, zipCode } = req.body;

//       const shop = await shop.findOne(req.seller._id);

//       if (!shop) {
//         return next(new errorhandler("User not found", 400));
//       }

//       shop.name = name;
//       shop.description = description;
//       shop.address = address;
//       shop.phoneNumber = phoneNumber;
//       shop.zipCode = zipCode;

//       await shop.save();

//       res.status(201).json({
//         success: true,
//         shop,
//       });
//     } catch (error) {
//       return next(new errorhandler(error.message, 500));
//     }
//   })
// );
export default router;