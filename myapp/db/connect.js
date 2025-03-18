const mongoose = require("mongoose");

// 連接 MongoDB
const getConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB 連線成功");
    } catch (err) {
        console.error("MongoDB 連線失敗:", err);
        process.exit(1);
    }
};

module.exports = getConnect;
