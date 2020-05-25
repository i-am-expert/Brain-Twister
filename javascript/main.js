getCategories();
async function getCategories() {
    categories = []
    await fetch('https://opentdb.com/api_category.php')
        .then(response => {
            return response.json()
        })
        .then(data => {
            categories = data;
        })
        .catch(err => {
            console.log("Error in getting categories")
        })
    categories = categories['trivia_categories'];
    select = document.getElementById('category');
    for(var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = categories[i]['name'];
        option.value = categories[i]['id'];
        select.appendChild(option);
    }
}

document.getElementById('form-id').addEventListener('submit', getValues)

let numOfQuestions;
let category;
let difficulty;

function getValues() {
    numOfQuestions = document.getElementById('numberOfQuestions').value;
    category = document.getElementById('category').value;
    difficulty = document.getElementById('difficulty').value;
    if(numOfQuestions == null || numOfQuestions === '') {
        return;
    }
    url = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
    // console.log(url);
    questions = []
    getQuestions(url);
}

async function getQuestions(url) {
    await fetch(url)
    .then(response => {
        return response.json()
    })
    .then(data => {
        startQuiz(data["results"]);
        // console.log(data);
    })
    .catch(err => {
        console.log("Error in getting questions");
    })
}

var shuffle = function (array) {
	var currentIndex = array.length;
	var temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

let questions = []
let score = 0;
let optionsSubmitted = []
let time = 11;
let currentQuestionNumber = 0;
let options = [];

let clickedOpt1 = false, clickedOpt2 = false, clickedOpt3 = false, clickedOpt4 = false; 

document.getElementById('opt1').onclick = function() {
    clickedOpt1 = true
}
document.getElementById('opt2').onclick = function() {
    clickedOpt2 = true
}
document.getElementById('opt3').onclick = function() {
    clickedOpt3 = true
}
document.getElementById('opt4').onclick = function() {
    clickedOpt4 = true
}

let shuffledOptions = []

function prepareQuestion(questions) {
    questionName = questions[currentQuestionNumber]["question"];
    correctAnswer = questions[currentQuestionNumber]["correct_answer"];
    incorrectAnswers = questions[currentQuestionNumber]["incorrect_answers"];
    options = []
    options.push(correctAnswer);
    for(var j = 0; j < 3; j++) {
        options.push(incorrectAnswers[j]);
    }
    options = shuffle(options);
    shuffledOptions.push(options);
    time = 10;
    document.getElementById('question-no').innerHTML = currentQuestionNumber + 1;
    document.getElementById('question-para').innerHTML = questionName;
    document.getElementById('option1').innerHTML = options[0];
    document.getElementById('option2').innerHTML = options[1];
    document.getElementById('option3').innerHTML = options[2];
    document.getElementById('option4').innerHTML = options[3];

    let maxi = 0;
    for(var i = 1; i <= 4; i++) {
        val = document.getElementById(`option${i}`).offsetWidth;
        maxi = Math.max(maxi, val)
        console.log(val, maxi)
    }
    for(var i = 1; i <= 4; i++) {
        document.getElementById(`opt${i}`).style.width = (maxi + 30) + "px";
    }
}

let countDownInterval, checkStatusInterval;

function startQuiz(questionList) {
    questions = questionList
    /* Change display div */
    document.getElementById('home').style.display = 'none';
    document.getElementById('question-div-id').style.display = 'block';
    
    /* Start with first question */
    prepareQuestion(questions);
    countDownInterval = setInterval(countdown, 1000);
    checkStatusInterval = setInterval(checkStatus, 50);
}

function countdown() {
    if (time > 0) {
      time--;
    } else if(time === 0) {
        if(optionsSubmitted.length === currentQuestionNumber) {
            optionsSubmitted.push('');
        }
        nextQuestion()
    }
    console.log(time);
    document.getElementById('time-left').innerHTML = time;
}

function checkStatus() {
    if(clickedOpt1 === true) {
        if(options[0] === questions[currentQuestionNumber]["correct_answer"]) {
            score += 1;
        }
        clickedOpt1 = false;
        optionsSubmitted.push(0)
        nextQuestion()
    } else if(clickedOpt2 == true) {
        if(options[1] === questions[currentQuestionNumber]["correct_answer"]) {
            score += 1;
        }
        clickedOpt2 = false;
        optionsSubmitted.push(1)
        nextQuestion()
    } else if(clickedOpt3 == true) {
        if(options[2] === questions[currentQuestionNumber]["correct_answer"]) {
            score += 1;
        }
        clickedOpt3 = false;
        optionsSubmitted.push(2)
        nextQuestion()
    } else if(clickedOpt4 == true) {
        if(options[3] === questions[currentQuestionNumber]["correct_answer"]) {
            score += 1;
        }
        clickedOpt4 = false;
        optionsSubmitted.push(3)
        nextQuestion()
    }
}

function nextQuestion() {
    if(currentQuestionNumber === numOfQuestions - 1) {
        gameOver()
    } else {
        currentQuestionNumber += 1;
        prepareQuestion(questions)
    }
}

function gameOver() {
   clearInterval(checkStatusInterval);
   clearInterval(countDownInterval);
   document.getElementById('question-div-id').style.display = 'none';
   document.getElementById('result-div-id').style.display = 'block';
   document.getElementById('score').innerHTML = score;
   document.getElementById('total').innerHTML = numOfQuestions;
}

document.getElementById('restart-btn').addEventListener('click', () => {
    window.location.reload();
})

document.getElementById('view-correct').addEventListener('click', () => {
    document.getElementById('result-div-id').style.display = 'none';
    document.getElementById('summary-div').style.display = 'block';

    // show correct answers for each question

    summaryDiv = document.getElementById('show-summary');
    for(var i = 0; i < numOfQuestions; i++) {
        var badge = document.createElement('div');
        badge.className = 'badgeClass';
        badge.innerHTML = '<h3>' + `Question ${i + 1}` + '</h3>' + '<hr>' + questions[i]["question"];
        summaryDiv.appendChild(badge);
        var correct = document.createElement('div');
        correct.className = 'correctClass';
        correct.innerHTML = '<i style="font-size: 110%;">' + 'Correct Option &nbsp;: &ensp;' + '</i>' + questions[i]["correct_answer"];
        summaryDiv.appendChild(correct);
        var selected = document.createElement('div');
        selected.className = 'selectedClass';
        selected.innerHTML = '<i style="font-size: 110%;">' + 'Selected Option : &ensp;' + '</i>' + ((optionsSubmitted[i] === '') ? 'None' : shuffledOptions[i][optionsSubmitted[i]]);
        summaryDiv.appendChild(selected);
    }
}) 

document.getElementById('restart-btn-again').addEventListener('click', () => {
    window.location.reload();
})