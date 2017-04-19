"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: true }))

//Connecting to the database
var mysql = require('promise-mysql');

var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'rockwell421', 
    password : '',
    database: 'reddit',
    connectionLimit: 10
    
});

var RedditAPI = require('./reddit');

var myReddit = new RedditAPI(connection);

app.set('view engine', 'pug');


//Exercise-1

app.get('/', function (request, response) {
  response.send('<h1>Hello World!</h1>');
});


//Exercise-2

app.get('/hello', function(request, response) {
    
    if (request.query.firstName) {
        response.send("<h1>Hello " + request.query.firstName + "</h1>");
    }
    else {
        response.send("<h1>Hello World!</h1>");
    }
});


//Exercise-3

app.get('/calculator/:operation', function (req, res) {

//create two variables to assign the requests, making sure that they're numbers and not strings using Number constructor 
  var num1 = Number(req.query.num1);
  var num2 = Number(req.query.num2);

//create if conditions that verify the operation type
  if (req.params.operation === "add") {
      res.send(`{
        "operation": "add",
        "firstOperand": ${num1},
        "secondOperand": ${num2},
        "solution": ${num1 + num2}
     }`)
    
  } else if (req.params.operation === "multiply") {
    
      res.send(`{
        "operation": "multiply",
        "firstOperand": ${num1},
        "secondOperand": ${num2},
        "solution": ${num1 * num2}
      }`)
    } else {
      res.status(400);
  }
  
});

/*
test multiply
http://week-2-mysql-data-rockwell421.c9users.io/calculator/multiply?num1=6&num2=4

test sum
http://week-2-mysql-data-rockwell421.c9users.io/calculator/sum?num1=6&num2=4
*/


//Exercise-4
/* 
Steps (connect API, create a promise)
Connect the myReddit API file and chain it to getAllPosts as a promise
Convert the array into a string using a map method and call posts title, posts url, and posts username
Join the string
*/

app.get('/posts', (req, res) => {

  myReddit.getAllPosts()
    .then(allPosts => {
      res.render('post-list', {allPosts: allPosts});
      
    });
});
    
    
    
//Exercise 5

app.get('/new-post', (request, response) => {
  response.render('create-content');
})



//Exercise 6: Receiving Data From Our Form


app.post('/createPost', (req, res) => {
  myReddit.createPost({
    url: req.body.url,
    title: req.body.title,
    subredditId: 325,
    userId: 1667
    
  }).then(result => {
      res.redirect("posts")
    })
  })
    
    
    
//Exercise 7: Using Pug

app.get('/createContent', (req, res) => {
  res.render('create-content');
})

//getAllPosts was modified for this exercise



//Exercise 8













/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
