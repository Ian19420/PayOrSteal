const express = require("express");
const router = express.Router();
const { getStealOptions, Steal } = require("../services/stealMethod");
const authMiddleware = require("../middleware/auth"); 
const model = require("../model");

router.get("/random-options", authMiddleware, (req, res) => {
    const options = getStealOptions();
    res.json(options);
});

router.post("/execute", authMiddleware, async (req, res) => {
    try {
        const { riskLevel, scenario } = req.body;
        if (!riskLevel || !scenario) {
            return res.status(400).json({ error: "缺少必要的參數" });
        }

        const userId = req.user.userId; 
        const result = await Steal(riskLevel, scenario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        const user = await model.Users.findById(userId);
        if (!user) return { error: "用戶不存在" };
        user.bankBalance += result.amount;
        user.reputation += result.reputationChange;
        user.policeAttention += result.policeChange;
        await user.save();
        res.json(result);
    } catch (err) {
        console.error("執行偷錢時發生錯誤:", err);
        res.status(500).json({ error: "伺服器錯誤" });
    }
});

module.exports = router;
