var express = require('express')
  , app = express()
  , fs = require('fs')
  , async = require('async')
  , url = require('url')
  , request = require('request')
  , db = require('./model/db')
  , mongoose = require('mongoose')
  , Video = mongoose.model('Video');

//TODO: Conf. To be moved
//TODO: Check existence of the public/img/ directory
var port = 8080;

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

//Requires auth for a route
function checkAuth(req, res, next) {
	if (req.session.authed) {
		next();
	} else {
    res.send(401);
	}
}

//Respond to user auth request by sending a token if the credentials are correct.
app.post('/auth', function (req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	
	if (req.session.auth) {
       // Already logged in.
    } else {
		fs.readFile('passwd.json', {'encoding': 'utf8'},function (err, data) {
			if(err) console.log(err);//TODO Change
	
			var credential = JSON.parse(data);
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
//Retrieve information and picture then store in db
app.post('/add', checkAuth, function (req, res, next) {
	var remote = url.parse(req.body.url, true)
  , id
  , video;
	
	if(remote.hostname === 'www.youtube.com') {
		id = remote.query.v;
		getTitle('http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=jsonc', function(videoTitle) {
			link2Picture = 'https://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';//hqdefault.jpg or sddefault.jpg
			video = new Video({
			    title: videoTitle,
			    site: 1,
			    videoId: id
			});
			
			insert(video, function (err) {
				if (err) throw err;
				console.log('Just stored video with ID: ' + id + ' from ' + remote.hostname);
				//Retireve picture and save it
				savePicture(link2Picture, id, function() {
					res.send(200);	
				});
			});
		});
	}
});

//Insert data in db
function insert(el, cb) {
  el.save(function (err, data) {
    if (err) console.log(err);
    console.log(data);
    cb(err);
  });
}

//Remove a video from the list 
//TODO: Should also remove the video from selection where it appears.
app.get('/remove', checkAuth, function (req, res, next) {
	var id = req.query.video;
	if(id) {
    Video.remove({videoId: id}, function(err) {
      res.send('Removed!');
    });
  } else {
    res.send('Missing parameter id!');
  }
});

//list video
app.get('/listvideos', function (req, res, next) {
  var start = req.query.start;
	var limit = req.query.limit;
	
	Video.find(function (err, docs) {
		console.log(docs);
		res.send(docs);
	});
});

//Create a new selection file
app.post('/createselection', checkAuth, function(req, res, next) {
	var name = req.body.selectionName;
console.log(name);
	if(name) {
    res.send(200);
	}
});

//Return the list of the existing selection
app.get('/selections', function(req, res, next) {
	res.send(200);
});

//Add a video to an existing selection
app.post('/addtoselection', checkAuth, function(req, res, next) {
	var videoId = req.body.idVideo;
	var selectionId = req.body.idSeletion;
	
 	res.send(200);
});

//Get all videos related to a selection
app.get('/getselection', function(req, res, next) {
		console.log(req);
	var selectionName = req.query.idSelection;

	res.send(200);
});

//Delete an existing selection
app.get('/deleteselection', function(req, res, next) {
	var selectionName = req.body.idSelection;
  res.send(200);
});

//Integrate existing list from an existing website
//option: 0 -> Erase previous favorites. 1 -> Append
app.post('/integrate', checkAuth, function(req, res, next) {
	var userId= req.body.userId
	, site = req.body.site
	, option = req.body.option
	, link1
	, links = []
	, favorites
	, total;

	if(option == 0) {
		//Erase previous content of the file
		Video.remove({}, function() {});
	}
	
	if(site == 1) {
		link1 = 'http://gdata.youtube.com/feeds/api/users/' + userId + '/favorites?alt=json&max-results=1';
		console.log(link1);
		request(link1, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				total = JSON.parse(body).feed.openSearch$totalResults.$t;
				//Check if there are some videos to retrieve
				if(total == 0) {
				  res.send('No videos found.');
				} else {
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
                        
                        //Adding each video to the existing list
                        async.forEach(favorites, function(el, cb) {		
                          //SAME AS IN /add
                          var remote = url.parse(el.link[0].href, true);
                          console.log(remote);
                          var title;
                          var id;
                          if(remote.hostname === 'www.youtube.com') {
                            id = remote.query.v;
                            getTitle('http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=jsonc', function(videoTitle) {
                              link2Picture = 'https://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';//hqdefault.jpg or sddefault.jpg
                              var video = new Video({
                                  title: videoTitle,
                                  site: 1,
                                  videoId: id
                              });
                              
                              insert(video, function (err) {
                                if (err) throw err;
                                console.log('The "data to append" was insert in DB!' );
                                //Retireve picture and save
                                savePicture(link2Picture, id, function() {
                                  next();
                                });
                              });
                            });
                          }
                        },
                        function(err) {
                          res.send('error');
                        });
                      }
                    });
                  },
                  function(err) {
                    res.send('error');
                  });
                  res.send(200);
                }
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
