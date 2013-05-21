var express = require('express');
var app = express();
var fs = require('fs');
var async = require('async');
var url = require('url');

//TODO: Maybe check the existence of video.txt
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
	var uri = req.body.url;
	var str;
	var remote = url.parse(uri, true);
	console.log(remote);
	if(remote.hostname === "www.youtube.com") {
		str = "1:" + remote.query.v + ",";
		console.log(str);
	}
	fs.appendFile(file, str + '\n', 'utf8', function (err) {
		if (err) throw err;
		console.log('The "data to append" was appended to file!: ' + str);
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
