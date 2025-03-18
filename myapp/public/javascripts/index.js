document.addEventListener("DOMContentLoaded", () => { 
    gsap.to("#headline h1", {
        scale: 1.2,  
        duration: 1.5, 
        ease: "power1.inOut",
        yoyo: true, 
        repeat: -1 
    });
    const registerBtn = document.getElementById("createAccount");
    const loginBtn = document.getElementById("login");
    const authDiv = document.getElementById("auth");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const cancelButtons = document.querySelectorAll(".cancel");
    const logoutBtn = document.getElementById("logout");
    const leaderboardBtn = document.getElementById("leaderboard-btn");

    checkLogin();

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            authDiv.style.display = "none";
            registerBtn.classList.add("hidden");
            loginBtn.classList.add("hidden");
            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
            gsap.fromTo(registerForm, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            authDiv.style.display = "none"
            registerBtn.classList.add("hidden");
            loginBtn.classList.add("hidden");
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
            gsap.fromTo(loginForm, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
        });
    }

    cancelButtons.forEach(button => {
        button.addEventListener("click", () => {
            authDiv.style.display = "flex";
            registerBtn.classList.remove("hidden");
            loginBtn.classList.remove("hidden");
            registerForm.classList.add("hidden");
            loginForm.classList.add("hidden");
        });
    });

    const regBtn = document.getElementById("register-btn");
    if (regBtn) regBtn.addEventListener("click", register);

    const logBtn = document.getElementById("login-btn");
    if (logBtn) logBtn.addEventListener("click", login);

    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    if (leaderboardBtn) {
        leaderboardBtn.addEventListener("click", () => {
            window.location.href = "/leaderboard";
        });
    }
    document.getElementById("steal-money-btn").addEventListener("click", fetchStealOptions);
    document.getElementById("pay-debt-btn").addEventListener("click", openPayDebtModal);
    document.getElementById("cancel-pay-debt").addEventListener("click", closePayDebtModal);

});

async function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const character = document.getElementById("character").value;

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, character}),
    });

    const data = await res.json();
    if (data.message) {
        document.getElementById("registerForm").classList.add("hidden");
        document.getElementById("loginForm").classList.remove("hidden");
    } else {
        alert(data.error);
    }
}
function updateCharacterImage() {
    const character = document.getElementById("character").value;
    const characterImg = document.getElementById("character-img");

    switch (character) {
        case "character1":
            characterImg.src = "/images/character1.png";
            break;
        case "character2":
            characterImg.src = "/images/character2.png";
            break;
        default:
            characterImg.src = "/images/character1.png";
    }
}

async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        setTimeout(() => location.reload(), 500);
    } else {
        alert(data.error);
    }
}

async function checkLogin() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("/profile", {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        if (data.username) {
            document.getElementById("auth").style.display = "none";
            document.getElementById("user-panel").style.display = "flex";
            const userName = document.getElementById('user-name');
            userName.innerText = `${data.username}`;
            userName.classList.remove("hidden"); 
            const userInfo = document.getElementById('user-info');
            userInfo.innerText = `存款: ${data.bankBalance} 債務: ${data.debt} 聲譽: ${data.reputation} 警示度: ${data.policeAttention}`;
            userInfo.classList.remove("hidden");
            const characterImg = document.getElementById("user-character-img");
            characterImg.src = data.characterImage;
            characterImg.classList.remove("hidden");
            document.getElementById("logoutForm").style.display = "flex";
            document.getElementById("logout").classList.remove("hidden");
        }
    } catch (err) {
        console.log("登入已過期，請重新登入");
        localStorage.removeItem("token");
    }
}

async function logout() {
    await fetch("/logout", { method: "POST" });

    localStorage.removeItem("token");

    document.getElementById("user-panel").style.display = "none";
    document.getElementById("logoutForm").style.display = "none";
    document.getElementById("logout").classList.add("hidden");


    document.getElementById("auth").style.display = "flex";


    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.add("hidden");

    location.reload();
}
async function fetchStealOptions() {
    try {
        const res = await fetch("/steal/random-options", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();

        document.getElementById("low-risk-text").innerText = data.low.scenario;
        document.getElementById("medium-risk-text").innerText = data.medium.scenario;
        document.getElementById("high-risk-text").innerText = data.high.scenario;
    
        document.getElementById("low-risk-btn").innerText = "選擇";
        document.getElementById("medium-risk-btn").innerText = "選擇";
        document.getElementById("high-risk-btn").innerText = "選擇";

        document.getElementById("low-risk-btn").onclick = () => executeSteal("low", data.low);
        document.getElementById("medium-risk-btn").onclick = () => executeSteal("medium", data.medium);
        document.getElementById("high-risk-btn").onclick = () => executeSteal("high", data.high);
        document.getElementById("steal-options").style.display = "flex";

    } catch (err) {
        console.error("取得偷錢選項失敗", err);
    }
}
function showStealResult(title, message) {
    const modal = document.getElementById("steal-result-modal");
    const modalTitle = document.getElementById("steal-result-title");
    const modalMessage = document.getElementById("steal-result-message");

    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.classList.add("show");

    setTimeout(() => {
        modal.classList.remove("show");
    }, 3000);
}
async function executeSteal(riskLevel, scenarioData) {
    try {
        const res = await fetch("/steal/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ riskLevel, scenario:  scenarioData.scenario})
        });

        const data = await res.json();
        if (data.error) {
            alert(`錯誤: ${data.error}`);
            return;
        }
        const resultMessage = `${data.message}\n金額變化：${data.amount}\n聲譽變化：${data.reputationChange}\n警察示度變化：${data.policeChange}`;
        showStealResult("行動結果", resultMessage);
        document.getElementById("steal-options").style.display = "none";

        checkLogin();
    } catch (err) {
        console.error("執行偷錢失敗", err);
    }
}
function openPayDebtModal() {
    document.getElementById("debt-amount").value = "";
    document.getElementById("paydebt-modal").classList.add("show");
    document.getElementById("confirm-pay-debt").onclick = () => confirmPayDebtHandler();
}

function closePayDebtModal() {
    document.getElementById("paydebt-modal").classList.remove("show");
}

async function confirmPayDebtHandler() {
    const debtAmountInput = document.getElementById("debt-amount");
    const amount = parseInt(debtAmountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("請輸入有效的還款金額！");
        return;
    }

    try {
        const res = await fetch("/paydebt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ amount })
        });

        const data = await res.json();
        if (data.error) {
            alert(data.error);
        } else {
            closePayDebtModal();
            checkLogin();
        }
    } catch (err) {
        console.error("還款失敗:", err);
        alert("還款時發生錯誤，請稍後再試！");
    }
}