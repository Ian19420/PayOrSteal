const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    character: { type: String, required: true, enum: ["character1", "character2"] },
    characterImage:{type: String, require: true},
    debt: { type: Number, default: 100000 },
    bankBalance: { type: Number, default: 0 },
    reputation: { type: Number, default: 100 },
    policeAttention: { type: Number, default: 0 }
});

Users = mongoose.model("User", UserSchema);

module.exports=
{
    Users
};