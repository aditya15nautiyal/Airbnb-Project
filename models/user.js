const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});
// passport-local-mongoose automatically adds username, hash and salt fields for passwords

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);