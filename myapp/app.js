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


app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message || "伺服器錯誤" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
});

module.exports = app;
