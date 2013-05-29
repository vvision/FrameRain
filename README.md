LumiereJs by Victor VOISIN

LumiereJs is a way to manage your favorite videos, make playlist, keeping data on your own server.

curl -XPOST localhost:8080/add -d 'url=http://www.youtube.com/watch?v=5NV6Rdv1a3I'

To get the picture that represent the video in youtube, just do:
https://i2.ytimg.com/vi/RNv2Eb0PfHU/sddefault.jpg , that is:
https://i2.ytimg.com/vi/VIDEOID/sddefault.jpg

Egalement possible avec hqdefault.jpg

Récupérer un xml de donnée
http://gdata.youtube.com/feeds/api/videos/-dQlc20k7Dc

Json is even better:
http://gdata.youtube.com/feeds/api/videos/ylLzyHk54Z0?v=2&alt=jsonc

STRUCTURE OF FILE video.txt

Type:ID
1:RNv2Eb0PfHU
Where 1 = youtube, 2 = dailymotion, 3 = vimeo, ...



API Specification:

* /add								POST		Add a video
		url
		
* /video							GET			Return the list of the videos

* /addtoselection			POST		Add a video to a selection
		idSelection
		idVideo
		
* /createselection		POST		Create a selection
		selectionName
		
* /deleteselection		GET			Delete a selection
		idSelection
		
* /selections					GET			Return the list of the selections (from directory selections; 1 file = 1 selection)		
