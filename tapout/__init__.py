from flask import Flask, render_template, redirect, url_for, session, request, flash
import os, json
from functools import wraps

app = Flask(__name__)
app.secret_key = os.urandom(16)

DIR = os.path.dirname(__file__) or '.'
app.secret_key = 'legit_secret_key'


@app.route("/")
def root():
    return render_template('home.html')



if __name__ == '__main__':
    app.debug = True
    app.run()
