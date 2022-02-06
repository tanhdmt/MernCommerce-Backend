export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const CategoryModel = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
    parentCate: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: "1", }

}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
CategoryModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Category', CategoryModel);