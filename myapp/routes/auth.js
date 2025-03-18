const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model = require("../model");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

router.get("/", (req, res) => {
    res.render('index');
});

router.post("/register", async (req, res) => {
    try {
        const { username, password, character } = req.body;

        if (!username || !password || !character) {
            return res.status(400).json({ error: "帳號、密碼和角色不能為空" });
        }


        const existingUser = await model.Users.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ error: "帳號已存在" });
        }
        let bankBalance = 2500;
        switch (character) {
            case "character1":
                bankBalance = 2500;
                break;
            case "character2":
                bankBalance = 5000;
                break;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new model.Users({
            username,
            password: hashedPassword,
            character,
            characterImage: `/images/${character}.png`,
            bankBalance,
            debt: 100000,
            reputation: 100,
            policeAttention: 0
        });
        await newUser.save();

        res.json({ message: "註冊成功 角色: "+ character });
    } catch (err) {
        console.error("註冊錯誤:", err);
        res.status(500).json({ error: "伺服器錯誤，請稍後再試" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "請輸入帳號和密碼" });
        }

        const user = await model.Users.findOne({ username: username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "帳號或密碼錯誤" });
        }

        const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.json({ message: "登入成功", token });
    } catch (err) {
        console.error("登入錯誤:", err);
        res.status(500).json({ error: "伺服器錯誤，請稍後再試" });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {

        const user = await model.Users.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "用戶不存在" });

        res.json({ 
            username: user.username, 
            character: user.character, 
            bankBalance: user.bankBalance, 
            debt: user.debt,
            reputation: user.reputation,
            policeAttention: user.policeAttention,
            characterImage: user.characterImage
        });

    } catch (err) {
        res.status(401).json({ error: "無效的 Token" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "登出成功" });
});


module.exports = router;