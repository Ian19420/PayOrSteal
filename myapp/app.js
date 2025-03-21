require("dotenv").config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const getConnect = require('./db/connect');
const authRouter = require('./routes/auth');
const leaderRouter = require('./routes/leaderboard');
const stealRouter = require('./routes/steal');
const paydebtRouter = require('./routes/paydebt');
const bankRouter = require('./routes/bank');
const gangRouter = require("./routes/gang");

const cron = require("node-cron");
const model = require("./model");

const app = express();

getConnect();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'recommand 128 bytes random string',
    cookie: { maxAge: 20 * 60 * 1000 },
    resave: false,
    saveUninitialized: false
}));


app.use('/', authRouter);
app.use('/leaderboard', leaderRouter);
app.use('/steal', stealRouter);
app.use('/paydebt',paydebtRouter);
app.use("/bank", bankRouter);
app.use("/heist", gangRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message || "伺服器錯誤" });
});
cron.schedule("0 0 * * *", async () => {
    console.log("正在執行每日發薪水和提升聲譽的任務...");
    try {
        const baseSalary = 1000;
        const workerSalary = 5000; 
        const reputationBoost = 10;
        const policeReduction = 5;
        const result = await model.Users.updateMany(
            {},
            [
                {
                    $set: {
                        bankBalance: {
                            $add: [
                                "$bankBalance",
                                {
                                    $cond: {
                                        if: { $eq: ["$job", "worker"] }, // 如果是工人，薪水 = 5000
                                        then: workerSalary,
                                        else: baseSalary
                                    }
                                }
                            ]
                        },
                        reputation: {
                            $cond: {
                                if: { $gte: [{ $add: ["$reputation", reputationBoost] }, 100] }, 
                                then: 100,
                                else: { $add: ["$reputation", reputationBoost] }
                            }
                        },
                        policeAttention: {
                            $cond: {
                                if: { $lte: [{ $subtract: ["$policeAttention", policeReduction] }, 0] }, 
                                then: 0,
                                else: { $subtract: ["$policeAttention", policeReduction] }
                            }
                        }
                    }
                }
            ]
        );
    
        console.log(`成功發薪水給 ${result.modifiedCount} 位玩家，工人 +${workerSalary}，其他職業 +${baseSalary} 金錢，每人 +${reputationBoost} 聲譽, 警示度降低 ${policeReduction}`);
    } catch (error) {
        console.error("每日發薪水失敗:", error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
});

module.exports = app;
