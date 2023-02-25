let count = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".spans");
let Question_Div = document.querySelector(".questoin");
let Answer_Div = document.querySelector(".answer-area");
let submit_btn = document.querySelector(".btn-submit");
let bullets_container = document.querySelector(".bullets-time");
let result = document.querySelector(".result");
let time = document.querySelector(".time");
let start_btn = document.querySelector(".btn-start");
let quiz_aria = document.querySelector(".q-aria");
let category = document.querySelector("#category");
let category_options = document.querySelectorAll("#category option");
let counter = 0;
let score = 0;
let countDownInterval;



function GetData() {
    let myrequest = new XMLHttpRequest();
    myrequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            start_btn.onclick = () => {
                // show data of quiz
                quiz_aria.classList.remove("hide");
                start_btn.classList.add("hide");
                // start of quiz
                let Q_data = JSON.parse(this.responseText);
                get_bullets_count(Q_data.length);
                get_Q_A(Q_data[counter], Q_data.length);
                submit_btn.innerHTML = "Submit Answers";
                // countDown
                countDown(5, Q_data.length);
                // submit_valid();
                submit_btn.onclick = () => {
                    let R_answer = Q_data[counter].right_answer;
                    checkAnswer(R_answer);
                    counter++;
                    Question_Div.innerHTML = "";
                    Answer_Div.innerHTML = "";
                    get_Q_A(Q_data[counter], Q_data.length);
                    handel_bullets();
                    clearInterval(countDownInterval);
                    countDown(5, Q_data.length);
                    showResult(Q_data.length);
                }
            }
        }
    }
    category.addEventListener("click", () => {
        let index = category.selectedIndex;
        let option = category[index].value;
        myrequest.open("GET", `../Data/${option}.json`, true);
        myrequest.send();
    });
};
GetData();

// Get bullets and count
function get_bullets_count(num) {
    count.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i == 0) {
            theBullet.className = "on";
        }
        bullets.appendChild(theBullet);
    }
}

// Add answers and questions
function get_Q_A(obj, objs_count) {
    if (counter < objs_count) {
        // add question
        let Q_h2 = document.createElement("h2");
        let Q_text = document.createTextNode(obj.Question);
        Q_h2.appendChild(Q_text);
        Question_Div.appendChild(Q_h2);
        // add answers
        for (let i = 1; i <= 4; i++) {
            let ans_div = document.createElement("div");
            ans_div.className = "answer";
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.id = `answer_${i}`;
            input.dataset.ans = obj[`answer_${i}`];
            if (i === 1) {
                input.checked = true;
            }
            let ans_label = document.createElement("label");
            ans_label.htmlFor = `answer_${i}`;
            // let label_text = document.createTextNode(obj.answer_`${i}`);
            let label_text = document.createTextNode(obj[`answer_${i}`]);
            ans_label.appendChild(label_text);
            ans_div.appendChild(input);
            ans_div.appendChild(ans_label);
            Answer_Div.appendChild(ans_div);
        }
    }
}

// check answer
function checkAnswer(r_answer) {
    let answers = document.getElementsByName("answer");
    let choosen_ans;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            choosen_ans = answers[i].dataset.ans;
        }
    }
    if (choosen_ans === r_answer) {
        score++;
    }
}

// handel BUllets
function handel_bullets() {
    let bulletsSpans = document.querySelectorAll(".bullets-time .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (counter === index) {
            span.className = "on";
        }
    });
}

// show results of the quiz
function showResult(q_count) {
    let val;
    if (counter === q_count) {
        Question_Div.remove();
        Answer_Div.remove();
        submit_btn.remove();
        bullets_container.remove();
        if (score >= parseInt(q_count / 2) && score < q_count) {
            val = `<span class="good">Good</span> You answerd ${score} / ${q_count} `;
        }
        else if (score == q_count) {
            val = `<span class="perfect">Perfect</span> You answerd ${score} / ${q_count} `;
        }
        else {
            val = `<span class="bad">Bad</span> You answerd ${score} / ${q_count} `;
        }
        result.innerHTML = val;
    }
}

// countDownInterval
function countDown(duration, count) {
    if (counter < count) {
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            time.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submit_btn.click();
            }
        }, 1000);
    }
}