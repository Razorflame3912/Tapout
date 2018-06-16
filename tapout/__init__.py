from flask import Flask, render_template, redirect, url_for, session, request, flash
import os, json
from utils import db, search
from functools import wraps

app = Flask(__name__)
app.secret_key = os.urandom(16)

DIR = os.path.dirname(__file__) or '.'
app.secret_key = 'legit_secret_key'


#authentication wrapper
def require_login(f):
    @wraps(f)
    def inner(*args, **kwargs):
        if 'uid' not in session:
            flash("Please log in")
            return redirect(url_for("root"))
        else:
            return f(*args, **kwargs)
    return inner

@app.route("/")
def root():
  if "uid" in session:
    return redirect(url_for("home"))
  return render_template("login.html")
