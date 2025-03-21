const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const model = require("../model");
const { getPayDebtMessage } = require("../services/paydebtMessage");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "無效的還款金額" });
        }

        const user = await model.Users.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "用戶不存在" });

        if (user.bankBalance < amount) {
            return res.status(400).json({ error: "存款不足" });
        }

        if (user.debt <= 0) {
            return res.status(400).json({ error: "你沒有債務需要還款" });
        }

        user.bankBalance -= amount;
        user.debt -= amount;
        if(user.job ==="worker") user.reputation += 5;
        user.reputation += Math.floor(amount/1000);
        if (user.debt < 0) user.debt = 0;

        await user.save();
        const payDebtMessage = getPayDebtMessage(amount);

        res.json({
            bankBalance: user.bankBalance,
            debt: user.debt,
            payDebtMessage
        });
    } catch (err) {
        console.error("還款時發生錯誤:", err);
        res.status(500).json({ error: "伺服器錯誤" });
    }
});
module.exports = router;