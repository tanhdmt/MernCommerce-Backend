export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const PostModel = new Schema({
    title: { type: String, required: true },
    slug: { type: String, slug: "title", unique: true },
    image: { type: String, required: true },
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String, default: '' },
    status: { type: String, default: "1", }
}, {
    timestamps: true,
});

// At Plugin
mongoose.plugin(slug);
PostModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Post', PostModel);