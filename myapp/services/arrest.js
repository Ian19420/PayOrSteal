async function arrestPlayer(userId) {
    try {
        await deleteUserFromDatabase(userId);

        return {
            message: "你被警察發現了，遊戲結束!。",
            gameOver: true
        };
    } catch (err) {
        console.error("刪除玩家帳號失敗:", err);
        return { error: "無法刪除帳號，請聯繫管理員。" };
    }
}


async function deleteUserFromDatabase(userId) {

    const model = require("../model");
    await model.Users.findByIdAndDelete(userId);
}

module.exports = {arrestPlayer};