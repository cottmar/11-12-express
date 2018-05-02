
#Author: Cara 1.0.0

#Overview
Creating a single resource API using the express framework

#Getting Started
npm install mongodb, npm i uuid, npm i express, npm i superagent, 
make sure you run npm run dbon -- needs to be up and running for testing


#Architecture
Set up your configuration (.env, robust .gitignore, .eslintrc.json, .eslintignore, package.json that includes forceExit, dbon and dboff, db to contain mongodb files, and test, model, route, libs). 
Create your model, or resource using MONGOOSE, express framework and ES6.

#Change Log
5-1-18 - 3:00 - started new branch for lab 12
5-1-18 - 5-6:30 - troubleshooting with Michael, downloaded Postman
5-1-18 - 6:45 - found that my delete method wasn't inside the correct brackets and finally got testing to pick it up
5-1-18 - 8:00 - refactored delete a bit more and began testing
5-1-18 - 10:00pm -- finally got a test to pass, but still having issues with "ECONNREFUSED" in terminal. Started to do research but couldn't find anything specific but I feel it might have to do with http?

#Credits and Collaborations
Dumbledore's Army (Josh, Zac, Mike, Lacy) and Michael for showing me some cool stuff (Postman) and going through the puzzle pieces with me. 

#In the README.md write documention for starting your server and how to make requests to each endpoint it provides. The documentaion should describe how the server would respond to valid and invalid requests.

The server is started by startServer. It connects to Mongoose, MongoDB_URI.
Router.post -- creates a new "place" and posts it to the api route. 
Router.get -- looks for a specific id to return. If succesful, will get and respond with a 200 status code. If there is no place route :id, will response with a 404, place not found, error. 
Router.delete -- looks for a route by id and deletes it. Will give a 204 if there is no content in body (delete successful). Will give a 404 if there is no route to get. 