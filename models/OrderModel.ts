export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const OrderModel = new Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            inStock: { type: Number, required: true },
            size: { type: String, required: true },
            color: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        emailAddress: { type: String, required: true},
        phone: { type: String, required: true},
        note: { type: String },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email: String,
    },
    shippingFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    delivered: { type: String, default: "Preparing" },
    deliveredAt: { type: Date },
    status: { type: String, default: "Pending" }
}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
OrderModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Order', OrderModel);