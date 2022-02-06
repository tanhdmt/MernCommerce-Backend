export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const ColorModel = new Schema({
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
    code: { type: String, required: true },
}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
ColorModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Color', ColorModel);