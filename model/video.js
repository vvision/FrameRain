var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
	title: String,
	site: Number,
	videoId: String
});

var Video = mongoose.model('Video', videoSchema);
