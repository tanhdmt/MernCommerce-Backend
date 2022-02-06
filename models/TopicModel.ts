export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const TopicModel = new Schema({
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
    parentTopic: { type: String },
    status: { type: String, default: "1", }
}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
TopicModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Topic', TopicModel);