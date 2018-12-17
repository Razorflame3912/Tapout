# Tapout
A fun rhythmic multiplayer game

## What is it?
Tapout is a web app that allows many users to connect with each other in small rooms and play a simple game involving tapping. You enter the title of a song, and tap its rhythm. Then, the other players will hear your taps and be asked to guess the song you were tapping. The faster they guess it the more points you get, so accuracy is rewarded.

## How is it made?
The backend is a Flask app that is deployed on Apache2. The connection to other players is facilitated by Firebase, which also stores scores and rooms while the game is running. The game logic is written in JavaScript and utilizes JQuery.

## Can I play it?
Sure, but you'll have to run the server yourself as we don't have any running. Luckily most of the work is already done here, just clone this repo and set it up on an Apache2 server. [This guide](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-application-on-an-ubuntu-vps) can help, but just note to skip the steps involving configuring the flask app, as it's already been done.

## Credit
This project was created by Mansour Elsharawy, Jake Zaia, & Jennifer Zhang.
