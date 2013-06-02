var express = require('express');
var app = express();
var fs = require('fs');
var async = require('async');
var url = require('url');
var request = require('request');

//TODO: Maybe check the existence of video.txt
//TODO: Conf. To be moved
//TODO: Check existence of the public/img/ directory
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
	//TODO: Get title and store it
	var title;
	var id;
	if(remote.hostname === 'www.youtube.com') {
		id = remote.query.v;
		title = getTitle('http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=jsonc', function(videoTitle) {
			title = videoTitle;
			str = '1::' + id + '::' + title + ',';
			link2Picture = 'https://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';//hqdefault.jpg or sddefault.jpg
			console.log(str);
			
			fs.appendFile(file, str + '\n', 'utf8', function (err) {
				if (err) throw err;
				console.log('The "data to append" was appended to file!: ' + str);
				//Retireve picture and save
				savePicture(link2Picture, id);
				res.send(200);
			});
		});
	}
});

//Add the url of the video to the file
app.get('/listvideos', function (req, res, next) {
	fs.readFile(file, function (err, data) {
		if (err) throw err;
		console.log(data);
		res.send(data);
	});
});

//Create a new selection file
app.post('/createselection', function(req, res, next) {
	var name = req.body.selectionName;
console.log(name);
	if(name) {
		fs.writeFile('selection/' + name, '', function (err) {
  		if (err) throw err;
console.log('It\'s saved!');
  		res.send(200);
		});
	}
});

//Return the list of the existing selection
app.get('/selections', function(req, res, next) {
	fs.readdir('selection', function (err, files) {
		if(!files) res.send('NULL');
console.log(files);
		res.send(files);
	});
});

//Add a video to an existing selection
app.post('/addtoselection', function(req, res, next) {
	var videoId = req.body.idVideo;
	var selectionId = req.body.idSeletion;
	fs.writeFile('selection/' + selectionId, videoId + ',', function (err) {
 		if (err) throw err;
console.log('It\'s saved!');
 		res.send(200);
	});
});

//Get all videos related to a selection
app.get('/getselection', function(req, res, next) {
	res.send(200);
});

//Delete an existing selection
app.get('/deleteselection', function(req, res, next) {
	var selectionName = req.body.idSelection;
	fs.unlink('selection/' + selectionName, function (err) {
  	if (err) throw err;
  	console.log('successfully deleted /selection/' + selectionName);
		res.send(200);
	});
});

function savePicture(link, id) {
  request(link).pipe(fs.createWriteStream('./public/img/' + id + '.jpg'));
}

function getTitle(link, callback) {
	request(link, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		  var title = JSON.parse(body).data.title;
		}
		callback(title);
	});
}
