import express from "express";
import asyncHandler from "express-async-handler";
import users from "./data/userData.js";
import User from "./Models/user.js";
import Drink from "./Models/drinks.js";
import drinks from "./data/drinkData.js";

const ImportData = express.Router();

ImportData.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.deleteMany({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

ImportData.post(
  "/drink",
  asyncHandler(async (req, res) => {
    await Drink.deleteMany({});
    const importDrinks = await Drink.insertMany(drinks);
    res.send({ importDrinks });
  })
);

export default ImportData;
