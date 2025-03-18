const payDebtMessages = [
    {
        min: 1,
        max: 1000,
        messages: [
            "還這麼少？怕不是還款界的蜻蜓點水！",
            "這也太摳了吧，銀行帳戶都笑你了。",
            "小額還款，果然是個精打細算的人！"
        ]
    },
    {
        min: 1001,
        max: 5000,
        messages: [
            "還可以，這筆錢剛好能讓你多撐幾天。",
            "勉強及格，不過債主還是不會放過你。",
            "這筆還款算是誠意十足，繼續努力吧！"
        ]
    },
    {
        min: 5001,
        max: 10000,
        messages: [
            "有錢人還款就是大氣，讚啦！",
            "這手筆有點狠，該不會搶銀行來的吧？",
            "這麼一筆還款，你終於開始走上正軌了！"
        ]
    },
    {
        min: 10001,
        max: Infinity,
        messages: [
            "這還款數字太誇張了，你真的不用吃飯了？",
            "這下你的債主可能都感動到流淚了！",
            "這麼還，你是想提前退休嗎？"
        ]
    }
];

function getPayDebtMessage(amount) {
    const category = payDebtMessages.find(c => amount >= c.min && amount <= c.max);
    if (!category) return "你成功還款了，但我無話可說。";
    const randomIndex = Math.floor(Math.random() * category.messages.length);
    return category.messages[randomIndex];
}

module.exports = {getPayDebtMessage};
