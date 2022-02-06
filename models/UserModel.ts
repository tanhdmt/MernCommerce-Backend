export{};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const UserModel = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // avartar: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    sex: { type: Number, required: true },
    phone: { type: String, required: true, unique: true},
    address: { type: String, required: true }
}, {
    timestamps: true,
});

// At Plugin
// mongoose.plugin(slug);
UserModel.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('User', UserModel);