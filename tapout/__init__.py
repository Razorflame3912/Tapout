from flask import Flask, render_template, redirect, url_for, session, request, flash
import os, json
from functools import wraps

app = Flask(__name__)
app.secret_key = os.urandom(16)

DIR = os.path.dirname(__file__) or '.'
app.secret_key = 'legit_secret_key'


@app.route("/")
@app.route("/home")
def root():
    return render_template('home.html')

@app.route("/game")
def game():
    return render_template('game.html')


@app.route("/taphtml", methods=['POST'])
def taphtml():
    return render_template('taphtml.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route('/room/<code>')
def room(code):
    return render_template('room.html')



if __name__ == '__main__':
    app.debug = True
    app.run()
