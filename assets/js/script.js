// Quiz questions
var questions = [

  {
    title: 'Code blocks are contained within.',
    choices: ['Quotes ""', 'Curly brackets {}', 'Parenthesis ()', 'Brackets []'],
    answer: 'Curly brackets {}',
  },
  {
    title: 'Arrays store what type of data?',
    choices: [
      'Integers', 'All other answers', 'Arrays', 'Booleans', 
    ],
    answer: 'All other answers',
  },
  {
    title: 'Which of these is not a data type:',
    choices: ['strings', 'booleans', 'integer', 'modals'],
    answer: 'modals',
  },
  {
    title: 'JavaScript commands end with what symbol?',
    choices: [';', '!', '?', ':'],
    answer: 'console.log',
  },
  {
    title:
      'What data type is a number with a decimal?',
    choices: ['long', 'float', 'string', 'integer'],
    answer: 'quotes',
  },
  {
    title: 'A common debugging tactic top check data is?',
    choices: ['JS', 'console.log', 'The terminal', 'Loops'],
    answer: 'console.log',
  },
];

var quizLength = questions.length * 15;
var questionIndex = 0;
var timerId;
var questionDiv = document.getElementById('questions');
var answers = document.getElementById('answers');
var quizTimer = document.getElementById('quizLength');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initials = document.getElementById('initials');
var feedback = document.getElementById('feedback');
var questionText = document.getElementById('question-text');



function startQuiz() {
  // hide quiz landing page at quiz start
  var startEl = document.getElementById('start-screen');
  startEl.setAttribute('class', 'hide');

  // show questions
  questionDiv.removeAttribute('class');

  // start timer
  timerId = setInterval(timer, 1000);

  // show starting quizLength
  quizTime.textContent = quizLength;

  // pull questions from array
  getQuestion();
}

function getQuestion() {
  // get question from array
  var currentQuestion = questions[questionIndex];
  questionText.textContent = currentQuestion.title;
  // clear answers
  answers.innerHTML = '';
  // create choice buttons
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'answer');
    choiceNode.setAttribute('value', choice);
    choiceNode.textContent = i + 1 + '. ' + choice;
    // show choices
    answers.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;

  if (!buttonEl.matches('.answer')) {
    return;
  }
  // if incorrect
  if (buttonEl.value !== questions[questionIndex].answer) {
    quizLength -= 15;
    if (quizLength < 0) {
      quizLength = 0;
    }
    // show new time remaining
    quizTime.textContent = quizLength;

    feedback.textContent = 'Incorrect';
  } else {
    feedback.textContent = 'Correct!';
  }

  // next question
  questionIndex++;

  // check if any questions are left or stop when no time remains
  if (quizLength <= 0 || questionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  clearInterval(timerId);

  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');
  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = quizLength;

  questionDiv.setAttribute('class', 'hide');
}

function timer() {
  // update timer
  quizLength--;
  quizTime.textContent = quizLength;

  // check if time has run out
  if (quizLength <= 0) {
    quizEnd();
  }
}

function saveScore() {
  // get input
  var scoreInitials = initials.value.trim();

  if (scoreInitials !== '') {
    // get score from local storage
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

    // format score
    var newScore = {
      score: quizLength,
      initials: scoreInitials,
    };

    // save scores to local storage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    window.location.href = 'highscore.html';
  }
}

function checkForEnter(event) {
  if (event.key === 'Enter') {
    saveScore();
  }
}

startBtn.onclick = startQuiz;
submitBtn.onclick = saveScore;
answers.onclick = questionClick;

initials.onkeydown = checkForEnter;
