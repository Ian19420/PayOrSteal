const stealMethods = {
    low: {
        successRate: 0.9,
        minAmount: 100,
        maxAmount: 3000,
        minPenalty: 100,
        maxPenalty: 3000,
        reputationPenalty: -10,
        policeIncrease: 0,
        scenarios: [
            {
                scenario: "你在路邊撿到了一個紅包。",
                success: "這運氣好得讓你自己都感到驚訝！真是走路都能撿到錢！",
                failure: "紅包是撿到了，倒霉的是你，裡面全是過期的優惠券！"
            },
            {
                scenario: "聚餐時，你趁朋友去上廁所，偷偷拿走他錢包裡的鈔票。",
                success: "一招偷心又偷錢，這次真是會賺的朋友！",
                failure: "原以為自己是偷天換日的高手，結果只偷到了朋友的懷疑眼神！"
            },
            {
                scenario: "你在ATM附近發現有人忘記拿走的紙鈔。",
                success: "你絕對是‘天上掉錢’的那種人，真是幸運！",
                failure: "運氣太差，結果那鈔票只是舊的假鈔，還被ATM抓了回去！"
            },
            {
                scenario: "假裝向朋友借錢，實則打算不還。",
                success: "你不僅借了錢，還讓朋友成了你‘銀行’的一部分！",
                failure: "計劃失敗，朋友已經在社交媒體上公開你的‘信用紀錄’了！"
            }
        ]
    },
    medium: {
        successRate: 0.6,
        minAmount: 1000,
        maxAmount: 10000,
        minPenalty: 1000,
        maxPenalty: 10000,
        reputationPenalty: -20,
        policeIncrease: 20,
        scenarios: [
            {
                scenario: "你假裝是募款團體，打算騙取一筆捐款。",
                success: "你成功了，不僅騙到了錢，還可能獲得‘慈善家’的名號！",
                failure: "結果沒騙到錢，還被報警，‘善良’的募款團體給抓了！"
            },
            {
                scenario: "你利用網購詐騙賣出一個假商品！",
                success: "虧心事做得這麼成功，這筆錢賺得真是‘無道德’！",
                failure: "這招差點得逞，結果收到了所有客戶的負評，還被退款。"
            },
            {
                scenario: "你在夜市假扮店員，收走了別人的錢！",
                success: "你還真能變成‘無良店員’，手法這麼熟練，真該給你發名片！",
                failure: "你成功了，但回頭卻發現自己被夜市老板抓住了，得付雙倍賠償！"
            },
            {
                scenario: "你向一位老奶奶說「我是你孫子」。",
                success: "這招妙啊！老奶奶給了你零用錢，這筆賺得真是老少皆宜！",
                failure: "你還真敢！結果老奶奶一聽覺得有點怪，給了你兩個巴掌，還讓你‘滾’！"
            }
        ]
    },
    high: {
        successRate: 0.3,
        minAmount: 5000,
        maxAmount: 20000,
        minPenalty: 5000,
        maxPenalty: 20000,
        reputationPenalty: -30,
        policeIncrease: 50,
        scenarios: [
            {
                scenario: "你打算利用愛情詐騙吸乾對方的錢包！",
                success: "你不僅偷了錢，還偷走了心！",
                failure: "結果你反而成了‘金光黨’的犧牲品！"
            },
            {
                scenario: "你黑入了某人的銀行帳戶，轉走一大筆錢！",
                success: "有了這筆錢，你可以自稱為‘金融大亨’了！",
                failure: "警察的通知信比你的收據還多！"
            },
            {
                scenario: "你在地下賭場成功偷走了別人的籌碼！",
                success: "你的運氣比賭博機還好，賺翻了！",
                failure: "結果你丟了錢，還被追著跑！"
            },
            {
                scenario: "你計畫10年，打算偷走你女兒男朋友的公司!",
                success: "小心，這年輕人會讓你成為資本家！",
                failure: "這一切都成了空談，還是被當場識破了！"
            }
        ]
    }
};

function getRandomStealMethod(riskLevel) {
    const methods = stealMethods[riskLevel].scenarios;
    const randomIndex = Math.floor(Math.random() * methods.length);
    return methods[randomIndex];
}
function getStealOptions() {
    return {
        low: getRandomStealMethod("low"),
        medium: getRandomStealMethod("medium"),
        high: getRandomStealMethod("high"),
    };
}

async function Steal(riskLevel, scenarioText, userReputation) {
    const methodData = stealMethods[riskLevel];
    if (!methodData) return { error: "無效的風險等級" };

    const scenario = methodData.scenarios.find(s => s.scenario === scenarioText);
    if (!scenario) return { error: "無效的情境" };
    let baseSuccessRate = methodData.successRate;
    const adjustedSuccessRate = Math.max(0.1, baseSuccessRate + (userReputation / 200));
    const success = Math.random() < adjustedSuccessRate;
    const addAmount = success ? Math.floor(Math.random() * (methodData.maxAmount - methodData.minAmount) + methodData.minAmount) : 0;
    const delAmount = success ? 0 : Math.floor(Math.random()*(methodData.maxPenalty - methodData.minPenalty) + methodData.minPenalty);
    const reputationChange = success ? methodData.reputationPenalty : 0;
    const policeChange = success ? 0 : methodData.policeIncrease;
    const message = success ? scenario.success : scenario.failure;
    const amount = addAmount - delAmount;
    try {
        return {
            message,
            amount,
            reputationChange,
            policeChange
        };
    } catch (err) {
        console.error("更新用戶數據時發生錯誤:", err);
        return { error: "數據庫更新失敗" };
    }
}
module.exports = { getStealOptions, Steal };
