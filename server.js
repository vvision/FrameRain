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
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'ASYDctgfeDKFLS646', cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(app.router); 
app.use(express.static('./public'));
app.use(function(req, res) {
    fs.createReadStream( './public/index.html').pipe(res);
});

app.listen(port, 'localhost', function () {
  console.log('Server running on port ' + port);
});

//Auth
//Function to add to routes
function checkAuth(req, res, next) {
	if (req.session.authed) {
		next();
	} else {
		//res.redirect('/');
		res.send(401);
	}
}

//Respond to user auth request by sending a token if the credentials are correct.
app.post('/auth', function (req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
console.log(login + ' ' + password);
	if (req.session.auth) {
       // Already logged in.
    } else {
		fs.readFile('passwd.json', {'encoding': 'utf8'},function (err, data) {
			if(err) console.log(err);//TODO Change
	
			var credential = JSON.parse(data);
	console.log(credential);
			if(login === credential.login && password === credential.password) {
				req.session.username = login;
				req.session.password = password;
				req.session.authed = true;
				res.send('OK');
			} else {
				res.send(403);
			}
		});
	}
});

app.post('/logout', checkAuth, function (req, res, next) {
	req.session = null;
	res.send(200);
});

//API
//Add the url of the video to the file
app.post('/add', checkAuth, function (req, res, next) {
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
			str = '1::' + id + '::' + title;
			link2Picture = 'https://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';//hqdefault.jpg or sddefault.jpg
			console.log(str);
			
			fs.appendFile(file, str + '\n', 'utf8', function (err) {
				if (err) throw err;
				console.log('The "data to append" was appended to file!: ' + str);
				//Retireve picture and save
				savePicture(link2Picture, id, function() {
					res.send(200);	
				});
			});
		});
	}
});

//list video
app.get('/listvideos', function (req, res, next) {
	fs.readFile(file, function (err, data) {
		if (err) throw err;
		console.log(data);
		res.send(data);
	});
});

//Create a new selection file
app.post('/createselection', checkAuth, function(req, res, next) {
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
app.post('/addtoselection', checkAuth, function(req, res, next) {
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
		console.log(req);
	var selectionName = req.query.idSelection;
	fs.readFile('selection/' + selectionName, function (err, data) {
		if (err) throw err;
		console.log(data);
		res.send(data);
	});
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

//Integrate existing list from an existing website
//option: 0 -> Erase previous favorites. 1 -> Append
app.post('/integrate', checkAuth, function(req, res, next) {
	var userId= req.body.userId;
	var site = req.body.site;
	var option = req.body.option;
	var link1;
	var links = [];
	var favorites;
	var total;

	if(option == 0) {
		//Erase previous content of the file
		fs.unlinkSync(file);
		fs.writeFileSync(file, '');
	}
	
	if(site == 1) {
		link1 = 'http://gdata.youtube.com/feeds/api/users/' + userId + '/favorites?alt=json&max-results=1';
		console.log(link1);
		request(link1, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				total = JSON.parse(body).feed.openSearch$totalResults.$t;
				console.log('TOTAL:' + total);
				var j = 1;
				do {
					links.push('http://gdata.youtube.com/feeds/api/users/' + userId + '/favorites?alt=json&max-results=50&start-index=' + j);
					j += 50;
				} while(j <= total);
				console.log(links);
				
				
				//Let's retrieve all favorites!
				async.forEach(links, function(element, cb) {		
						
					request(element, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							favorites = JSON.parse(body).feed.entry;//Array containing favorites
							
							//Adding each video to the existing list	//TODO: Option to erase previous list or merge!
							async.forEach(favorites, function(el, cb) {		
								//SAME AS IN /add
								var remote = url.parse(el.link[0].href, true);
								console.log(remote);
								var title;
								var id;
								if(remote.hostname === 'www.youtube.com') {
									id = remote.query.v;
									title = getTitle('http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=jsonc', function(videoTitle) {
										title = videoTitle;
										if(title != undefined) {//Avoid retrieving favorites corresponding to unavailable videos
											str = '1::' + id + '::' + title;
											var link2Picture = 'https://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';//hqdefault.jpg or sddefault.jpg
											console.log(str);
											
											fs.appendFile(file, str + '\n', 'utf8', function (err) {
												if (err) throw err;
												console.log('The "data to append" was appended to file!: ' + str);
												//Retireve picture and save
												savePicture(link2Picture, id, function() {
													next();	
												});

											});
										}
									});
								}
							},
							function(err) {
								res.send('error');
							});
							
							//res.send(favorites);
						}
					});

				},
				function(err) {
					res.send('error');
				});
				res.send(200);
			}
		});
		
	} else {
		res.send(404);
	}

});

function savePicture(link, id, cb) {
  request(link).pipe(fs.createWriteStream('./public/img/' + id + '.jpg'));
  request(link).on("end", function() {
    cb();
  });
}

function getTitle(link, callback) {
	request(link, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		  var title = JSON.parse(body).data.title;
		}
		callback(title);
	});
}
