import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/order.js";
import User from "../Models/user.js";

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      phone_number,
      total_price,
    } = req.body;
    const user = await User.findById(req.user._id);

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("Không có hàng trong giỏ");
      return;
    } else {
      if(total_price < req.user.banking_balance){
        const order = new Order({
          orderItems,
          user: req.user._id,
          phone_number,
          total_price,
        });
  
        const createOrder = await order.save();
        if(createOrder){
          user.banking_balance = user.banking_balance - total_price;
          const updatedUser = await user.save();
          res.status(201).json({createOrder, updatedUser});
        }
      }else{
        res.status(404);
        throw new Error("Số tiền vượt quá số dư, vui lòng nạp thêm");
      }
      
    }
  })
);

// USER LOGIN ORDERS
orderRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// GET USER ORDER
orderRouter.get(
  "/user/:uid",
  protect,
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req. query.pageNumber) || 1;
    const uid = req.params.uid;
    const order = await Order.find({"user": uid})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ _id: 1});

    res.json({order, page});
  })
);

// GET ORDER BY ID
orderRouter.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

export default orderRouter;