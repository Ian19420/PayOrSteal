const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    debt: { type: Number, default: 100000 },
    bankBalance: { type: Number, default: 0 },
    reputation: { type: Number, default: 100 },
    policeAttention: { type: Number, default: 0 },
    job: { type: String, enum: ["工人", "銀行家", "小偷", "黑幫"], required: true },
    jobImg: {type: String},
    bankDeposit: { type: Number, default: 0 }
});

Users = mongoose.model("User", UserSchema);

module.exports=
{
    Users
};