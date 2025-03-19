let correctCode = [];
let timer;
let timeLeft = 30; // عدد الثواني
let gameActive = false;

const inputs = document.querySelectorAll(".code-input");
const startBtn = document.getElementById("start-btn");
const message = document.getElementById("message");
const progress = document.getElementById("progress");

// تعطيل جميع المدخلات حتى يبدأ المستخدم اللعبة
function disableInputs(state) {
    inputs.forEach(input => {
        input.disabled = state;
        if (state) input.value = ""; // مسح القيم عند التعطيل
    });
}

// توليد كود عشوائي جديد
function generateCode() {
    correctCode = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString());
    console.log("Code:", correctCode.join("")); // للديباغ فقط
}

// بدء اللعبة
function startGame() {
    if (gameActive) return; // منع إعادة التشغيل أثناء اللعبة

    generateCode();
    gameActive = true;
    timeLeft = 30;
    startBtn.textContent = "Restart";
    message.textContent = "";
    
    disableInputs(false);
    inputs.forEach(input => input.classList.remove("green", "yellow"));

    inputs[0].focus();
    startTimer();
}

// تشغيل المؤقت
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        progress.style.width = (timeLeft / 30) * 100 + "%";
        
        // تحديث الوقت المتبقي في العنصر
        document.getElementById("time-left").innerHTML = `${timeLeft} <span>sec</span>`; // تغيير "ثانية" إلى "sec"

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// إنهاء اللعبة
function endGame(won) {
    clearInterval(timer);
    gameActive = false;

    if (won) {
        message.textContent = "🎉 Congratulations! You cracked the code!";
    } else {
        message.textContent = "⏳ Time is up! Try again.";
    }

    disableInputs(true);
    startBtn.textContent = "Start"; // إعادة تسمية الزر إلى "ابدأ"
}

// التحقق من الإدخال عند إدخال جميع الأرقام
function checkCode() {
    if (!gameActive) return;

    let userGuess = Array.from(inputs).map(input => input.value);
    if (userGuess.includes("")) return; // لا يتم التحقق حتى يتم إدخال 4 أرقام

    let correctPositions = 0;

    inputs.forEach((input, index) => {
        if (userGuess[index] === correctCode[index]) {
            input.classList.add("green");
            correctPositions++;
        } else if (correctCode.includes(userGuess[index])) {
            input.classList.add("yellow");
        }
    });

    // إبقاء القيم لمدة ثانيتين قبل المسح
    setTimeout(() => {
        inputs.forEach(input => {
            input.value = "";
            input.classList.remove("green", "yellow");
        });
        inputs[0].focus();
    }, 2000);

    // إذا كان جميع الأرقام صحيحة، يفوز المستخدم
    if (correctPositions === 4) {
        endGame(true);
    }
}

// التحكم في الإدخال والتنقل بين الحقول
inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        if (e.target.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }

        // يتم التحقق فقط عندما يتم إدخال جميع الأرقام
        if (index === 3 && inputs[3].value) {
            checkCode();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && index > 0 && !e.target.value) {
            inputs[index - 1].focus();
        }
    });

    // منع إدخال أي حرف
    input.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault(); // منع الإدخال إذا لم يكن رقمًا
        }
    });
});

// تشغيل اللعبة عند الضغط على Enter
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startGame();
    }
});

// عند الضغط على إعادة، لا تبدأ اللعبة حتى يتم الضغط على "ابدأ"
startBtn.addEventListener("click", () => {
    if (gameActive) {
        location.reload(); // إعادة تحميل الصفحة لإعادة التشغيل
    } else {
        startGame();
    }
});

// تعطيل الإدخال في البداية
disableInputs(true);