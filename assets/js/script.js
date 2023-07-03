// JS that runs the quiz
var questions = [
  {
    title: 'Which of these is not a data type:',
    choices: ['strings', 'booleans', 'integer', 'modals'],
    answer: 'modals',
  },
  {
    title: 'Code blocks are contained within.',
    choices: ['Quotes ""', 'Curly brackets {}', 'Parenthesis ()', 'Brackets []'],
    answer: 'Parenthesis ()',
  },
  {
    title: 'Arrays store what type of data?',
    choices: [
      'Integers', 'All other answers', 'Arrays', 'Booleans', 
    ],
    answer: 'All other answers',
  },
  {
    title:
      'String values must be enclosed within ____ when being assigned to variables.',
    choices: ['commas', 'curly brackets', 'quotes', 'parentheses'],
    answer: 'quotes',
  },
  {
    title: 'A common debugging tactic top check data is?',
    choices: ['JS', 'console.log', 'The terminal', 'Loops'],
    answer: 'console.log',
  },
];

var quizTime = questions.length * 15;
var currentQuestion = 0;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

// sound effects
var sfxRight = new Audio('assets/sfx/correct.wav');
var sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  // un-hide questions section
  questionsEl.removeAttribute('class');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // check if user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time;

    // play "wrong" sound effect
    sfxWrong.play();

    feedbackEl.textContent = 'Wrong!';
  } else {
    // play "right" sound effect
    sfxRight.play();

    feedbackEl.textContent = 'Correct!';
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute('class', 'feedback');
  setTimeout(function () {
    feedbackEl.setAttribute('class', 'feedback hide');
  }, 1000);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  // update time
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== '') {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
function printHighscores() {
  // either get scores from localstorage or set to empty array
  var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

  // sort highscores by score property in descending order
  highscores.sort(function (a, b) {
    return b.score - a.score;
  });

  for (var i = 0; i < highscores.length; i += 1) {
    // create li tag for each high score
    var liTag = document.createElement('li');
    liTag.textContent = highscores[i].initials + ' - ' + highscores[i].score;

    // display on page
    var olEl = document.getElementById('highscores');
    olEl.appendChild(liTag);
  }
}

function clearHighscores() {
  window.localStorage.removeItem('highscores');
  window.location.reload();
}

document.getElementById('clear').onclick = clearHighscores;

// run function when page loads
printHighscores();