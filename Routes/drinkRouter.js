import express from "express";
import asyncHandler from "express-async-handler";
import Drink from "../Models/drinks.js";

const drinkRouter = express.Router();

/**
 * get all
 */
drinkRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Drink.countDocuments({ ...keyword });
    const drinks = await Drink.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({ drinks, count, page, pages: Math.ceil(count / pageSize) });
  })
);

/**
 * Get single
 */
drinkRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const drink = await Drink.findById(req.params.id);
    if (drink) {
      res.json(drink);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy đồ uống");
    }
  })
);

export default drinkRouter;
