export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const PageModel = new Schema({
    title: { type: String, required: true },
    slug: { type: String, slug: "title", unique: true },
    content: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String, default: '' },
    status: { type: String, default: "1", },
}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
PageModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Page', PageModel);