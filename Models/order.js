import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
        },
    ],
    phone_number:{
        type: String,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paid_at: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;