const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const model = require('../model');
const {arrestPlayer} = require("../services/arrest");

router.post("/", auth, async (req, res) => {
    try {
        const me = await model.Users.findById(req.user.userId);
        if (!me) return res.status(404).json({ error: "使用者不存在" });
        if (me.job !== "黑幫") return res.status(403).json({ error: "你不是黑幫，不能搶劫！" });

        const top = await model.Users.findOne().sort({ bankBalance: -1 });
        if (!top || top.id === me.id) return res.status(400).json({ error: "無法搶自己或沒有目標" });
    
        const stolen = Math.floor(Math.min(top.bankBalance * 0.3, 10000));
        me.bankBalance += stolen;
        top.bankBalance -= stolen;
        me.policeAttention += 10;
        const attention = me.policeAttention;
        const target = top.username;
        await me.save();
        await top.save();
        if(attention > 100) return res.json(await arrestPlayer(req.user.userId));
        return res.json({ message: `搶劫成功！你偷了${target} $${stolen}！ 但這似乎引起警察的注意?`});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "搶劫出錯，請稍後再試" });
    }
});

module.exports = router;
