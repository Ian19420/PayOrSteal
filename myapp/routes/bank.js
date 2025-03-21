const express = require("express");
const router = express.Router();
const model = require("../model");
const authMiddleware = require("../middleware/auth");

router.post("/deposit", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: "請輸入有效存款金額！" });

        const user = await model.Users.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "用戶未找到！" });

        if (user.bankBalance < amount) {
            return res.status(400).json({ error: "存款金額超過可用餘額！" });
        }

        user.bankBalance -= amount;
        user.bankDeposit = (user.bankDeposit || 0) + amount;
        await user.save();

        res.json({ message: `成功存款 $${amount}！`, bankDeposit: user.bankDeposit, bankBalance: user.bankBalance });
    } catch (error) {
        console.error("存款錯誤:", error);
        res.status(500).json({ error: "存款失敗，請稍後再試！" });
    }
});

router.post("/withdraw", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ error: "請輸入有效提款金額！" });

        const user = await model.Users.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "用戶未找到！" });

        if (user.bankDeposit < amount) {
            return res.status(400).json({ error: "提款金額超過銀行存款！" });
        }

        user.bankDeposit -= amount;
        user.bankBalance += amount;
        await user.save();

        res.json({ message: `成功提款 $${amount}！`, bankDeposit: user.bankDeposit, bankBalance: user.bankBalance });
    } catch (error) {
        console.error("提款錯誤:", error);
        res.status(500).json({ error: "提款失敗，請稍後再試！" });
    }
});


router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const user = await model.Users.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "用戶未找到！" });

        res.json({ bankDeposit: user.bankDeposit || 0, bankBalance: user.bankBalance });
    } catch (error) {
        console.error("獲取銀行存款失敗:", error);
        res.status(500).json({ error: "無法獲取銀行存款資訊！" });
    }
});

module.exports = router;
