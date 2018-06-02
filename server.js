var express = require("express");

var app = express();

app.use(express.static(__dirname + "/pages"));

app.get('/', function(req, res){
    res.redirect('/login/');
});

app.get('/login', function(req, res){
    res.redirect('/login/');
});

app.get('/ready', function(req, res){
    res.redirect('/ready/');
});

app.post('/fight', function(req, res){
    res.redirect('/fight/');
});


app.listen(4444);