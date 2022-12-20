from flask import render_template, request, redirect, flash, url_for, Blueprint, jsonify, make_response, Response
from flask_login import current_user, login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt, jwt_manager
from app.user.forms import LoginForm, RegisterForm
from app.models import *
import json
import urllib
from sqlalchemy import or_, and_
from flask_jwt_extended import current_user, jwt_required, create_access_token, get_jwt_identity, get_jwt, set_access_cookies, set_refresh_cookies, unset_access_cookies, unset_refresh_cookies, unset_jwt_cookies, get_current_user
from flask_cors import cross_origin
import math

analysis = Blueprint('analysis', __name__)



# @analysis.route("/api/visited/", methods = ['POST'])
# @cross_origin(origins=['http://localhost:3000'])
# def visited():
#     userid = request.json.get('userId', None)
#     personId = request.json.get('personId', None)
#     if userid != None and personId != None:
#         entry = browsingHistory.insert().values(viewer_id=userid, viewed_id=personId)
#         db.session.execute(entry) 
#         db.session.commit()
#     return ''