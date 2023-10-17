import mongoose from "mongoose";

const drinkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Drink = mongoose.model("Drink", recipeSchema);
export default Drink;
