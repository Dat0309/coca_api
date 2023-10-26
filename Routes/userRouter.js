import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../Middleware/AuthMiddleware.js";
import User from "../Models/user.js";
import generateToken from "../utils/generateToken.js";

const userRouter = express.Router();

/**
 * login
 */
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        banking_number: user.banking_number,
        banking_balance: user.banking_balance,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Tài khoản hoặc mật khẩu sai! Xin hãy thử lại.");
    }
  })
);

/**
 * register
 */
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { 
      first_name,
      last_name, 
      phone_number, 
      username, 
      password, 
      banking_number
    } = req.body;
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error("Người dùng đã tồn tại");
    }

    const user = await User.create({
      first_name,
      last_name, 
      phone_number, 
      username, 
      password, 
      banking_number,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        password: user.password,
        banking_number: user.banking_number,
        banking_balance: 0,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Nhập sai định dạng dữ liệu người dùng");
    }
  })
);
userRouter.get(
  "/bankingNumber/:banking_number",
  asyncHandler(async (req, res) => {
    const bankingNumberExists = await User.findOne(req.params.banking_number)

    if(bankingNumberExists){
      res.status(400);
      throw new Error("Mã ngân hàng đã tồn tại");
    }else{
      res.status(200);
    }
  })
)

/**
 * profile
 */
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        banking_number: user.banking_number,
        banking_balance: user.banking_balance,
        token: generateToken(user._id),
      });
    } else {
      res.status(404);
      throw new Error("Không tìmg thấy User");
    }
  })
);

userRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy User");
    }
  })
);

userRouter.put(
  "/increateBalance",
  protect,
  asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
      user.banking_balance = user.banking_balance + req.body.banking_balance || user.banking_balance;

      const updatedUser = await user.save();
      if(updatedUser){
        res.json(updatedUser);
      }else{
        res.status(400);
        throw new Error("Không thể update user");
      }
      
    }else{
      res.status(404);
      throw new Error("Không tìm thấy User");
    }
  })
)

userRouter.put(
  "/decreateBalance",
  protect,
  asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
      if(req.body.banking_balance < user.banking_balance){
        user.banking_balance = user.banking_balance - req.body.banking_balance || user.banking_balance;
        const updatedUser = await user.save();

        res.status(200).json({
          _id: updatedUser._id,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          phone_number: updatedUser.phone_number,
          username: updatedUser.username,
          password: updatedUser.password,
          banking_number: updatedUser.banking_number,
          banking_balance: updatedUser.banking_balance,
          createdAt: updatedUser.createdAt,
          token: generateToken(updatedUser._id),
        });
      }else{
        res.status(400).json({message: "Người dùng không đủ số dư"});
      }
    }else{
      res.status(404);
      throw new Error("Không tìm thấy User");
    }
  })
)

/**
 * Update profile
 */
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.first_name = req.body.first_name || user.first_name;
      user.last_name = req.body.last_name || user.last_name;
      user.phone_number = req.body.phone_number || user.phone_number;
      user.username = req.body.username || user.username;
      user.password = req.body.password || user.password;
      user.banking_number = req.body.banking_number || user.banking_number;
      user.banking_balance = req.body.banking_balance || user.banking_balance;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone_number: updatedUser.phone_number,
        username: updatedUser.username,
        password: updatedUser.password,
        banking_number: updatedUser.banking_number,
        banking_balance: updatedUser.banking_balance,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy User");
    }
  })
);

export default userRouter;
