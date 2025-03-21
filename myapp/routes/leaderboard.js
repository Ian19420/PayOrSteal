const express = require("express");
const router = express.Router();
const model = require('../model');
router.get("/", (req, res) => {
    res.render("leaderboard");
});
router.get("/top", async (req, res) => {
    try {
      const honestTop3 = await model.Users.find().sort({ debt: 1 }).limit(3);
      const richTop3 = await model.Users.find().sort({ balance: -1 }).limit(3);
  
      res.json({
        honestTop3,
        richTop3,
      });
    } catch (err) {
      console.error("讀取排行榜錯誤", err);
      res.status(500).json({ error: "伺服器錯誤" });
    }
  });
  
module.exports = router;