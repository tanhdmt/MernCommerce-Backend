export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const ProductModel = new Schema({
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
    image: { type: String, required: true },
    categoryId: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String },
    size: { type: String, required: true },
    details: { type: String, required: true },
    price: { type: Number, required: true },
    priceDiscount: { type: Number, default: 0 },
    quantity: { type: Number, default: 0, },
    status: { type: String, default: "1", }
}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
ProductModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Product', ProductModel);