export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const ImageModel = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    categoryId: { type: String },
    content: { type: String },
    promotion: { type: String },
    position: { type: String, required: true },
    status: { type: String, default: "1", }
}, {
    timestamps: true,
});

// At Plugin
ImageModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Image', ImageModel);