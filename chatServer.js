/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var numberOfCorrectAnswer = 0;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hi there, I am Jarvis, a simple quiz bot!"); //We start with the introduction;
  setTimeout(timedQuestion, 3000, socket,"What is your name?"); // Wait a moment and respond with a question.
});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);  // run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + ' :-) The quiz will begin now'; // output response
    waitTime = 3000;
    question = 'In what year was Cornell University founded?'; // load next question
  } else if (questionNum == 1) {
    if (checkAnswer(input, questionNum)) {
      answer = 'Correct!';
      numberOfCorrectAnswer += 1;
    } else {
      answer = 'Oops... Cornell was founded in 1865'
    }
    waitTime = 2500;
    question = 'Which character is the first to speak in Star Wars?'; // load next question
  } else if (questionNum == 2) {
    if (checkAnswer(input, questionNum)) {
      answer = 'Correct!';
      numberOfCorrectAnswer += 1;
    } else {
      answer = "Oops... It's C3PO"
    }
    waitTime = 2500;
    question = 'The Statue of Liberty was given to the US by which country?'; // load next question
  } else if (questionNum == 3) {
    if (checkAnswer(input, questionNum)) {
      answer = 'Correct!';
      numberOfCorrectAnswer += 1;
    } else {
      answer = "Oops... It's France"
    }
    waitTime = 2500;
    question = 'The song "My Heart Will Go On" came from what movie?';            // load next question
  } else if (questionNum == 4) {
    if (checkAnswer(input, questionNum)) {
      answer = 'Correct!';
      numberOfCorrectAnswer += 1;
    } else {
      answer = "Oops... It's 'Titanic'"
    }
    question = ""
    waitTime = 2500;
  // load next question
  } else {
    waitTime = 0;
    question = '';
  }

/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function checkAnswer(answer, questionNumber) {
  var isCorrect = false;
  if (questionNumber == 1) {
    if (answer == '1865') isCorrect = true;
  } else if (questionNumber == 2) {
    if (answer.toLowerCase() == 'c3po') isCorrect = true;
  } else if (questionNumber == 3) {
    if (answer.toLowerCase() == 'france') isCorrect = true;
  } else if (questionNumber == 4) {
    if (answer.toLowerCase() == 'titanic') isCorrect = true;
  }

  return isCorrect;
}

function timedQuestion(socket,question) {
  if(question!='') {
    socket.emit('question',question);
  } else{
    answer = "Done! You've got " + numberOfCorrectAnswer + "/4 questions correctly"
    socket.emit('answer',answer);
  }
}
//----------------------------------------------------------------------------//
