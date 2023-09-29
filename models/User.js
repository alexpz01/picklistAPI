const { Model, Schema, default: mongoose } = require("mongoose");

const UserSchema = new Schema({
    _id : Schema.Types.ObjectId,
    name : String,
    user_name : String,
    mail : String,
    creation_date : Date,
    password : String,
    is_confirmed : Boolean,
    profile_img : String
})

const User = mongoose.model("user", UserSchema)

module.exports = User
