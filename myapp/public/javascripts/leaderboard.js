document.addEventListener("DOMContentLoaded", async function () {
    try {
        const res = await fetch("/leaderboard/top");
        const data = await res.json();
        renderList("honest-rank", data.honestTop3, "debt", "債務");
        renderList("rich-rank", data.richTop3, "bankBalance", "存款");
    } catch (err) {
        console.error("載入排行榜失敗", err);
    }
});

function renderList(id, players, key, label) {
    const ol = document.getElementById(id);
    ol.innerHTML = "";

    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.username} - ${label}：${player[key]}`;
        ol.appendChild(li);
    });
}
