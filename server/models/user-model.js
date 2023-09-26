const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, unique: true, require: true },
    username: { type: String, unique: true, require: false },
    password: { type: String, require: true },
    age: { type: Number, require: false },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String, require: true }
});

module.exports = model("User", UserSchema);