var express = require('express');
var app = express();
var fs = require('fs');
var async = require('async');


//TODO: Conf. To be moved
var port = 8080;
var file = 'video.txt';

app.use(express.logger());
app.use(express.bodyParser({uploadDir:'./tmp'}));
//app.use(express.favicon(__dirname + '/public/favicon.ico'))
app.use(app.router); 
app.use(express.static('./public'));
app.use(function(req, res) {
    fs.createReadStream( './public/index.html').pipe(res);
});

app.listen(port, 'localhost', function () {
  console.log('Server running on port ' + port);
});



//Add the url of the video to the file
app.post('/add', function (req, res, next) {
	var url = req.body.url;
	console.log(url);
	fs.appendFile(file, url + '\n', 'utf8', function (err) {
		if (err) throw err;
		console.log('The "data to append" was appended to file!');
		res.send(200);
	});
});

//Add the url of the video to the file
app.get('/video', function (req, res, next) {
	fs.readFile(file, function (err, data) {
		if (err) throw err;
		console.log(data);
		res.send(data);
	});
	
});
