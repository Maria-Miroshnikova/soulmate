from flask import render_template, request, redirect, flash, url_for, Blueprint
from flask_login import current_user, login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt
from app.user.forms import LoginForm, RegisterForm
from app.models import *
import json
import urllib
from sqlalchemy import or_, and_

main = Blueprint('main', __name__)

@main.route('/')
def index():
    # users = User.query.all()
    return render_template('index.html')

@main.route('/options_book_main', methods = ['GET'])
def options_book_main():
    all_books = Book.query.all()
    books_schema = BookSchema(many=True)
    results = books_schema.dump(all_books)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_book_sub', methods = ['GET'])
def options_book_sub():
    all_authors = Author.query.all()
    authors_schema = AuthorSchema(many=True)
    results = authors_schema.dump(all_authors)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_film_main', methods = ['GET'])
def options_film_main():
    all_films = Film.query.all()
    films_schema = FilmSchema(many=True)
    results = films_schema.dump(all_films)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_film_sub', methods = ['GET'])
def options_film_sub():
    all_directors = Director.query.all()
    directors_schema = DirectorSchema(many=True)
    results = directors_schema.dump(all_directors)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_music_main', methods = ['GET'])
def options_music_main():
    all_songs = Song.query.all()
    songs_schema = FilmSchema(many=True)
    results = songs_schema.dump(all_songs)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_music_sub', methods = ['GET'])
def options_music_sub():
    all_artists = Artist.query.all()
    artists_schema = ArtistSchema(many=True)
    results = artists_schema.dump(all_artists)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_game_main', methods = ['GET'])
def options_game_main():
    all_games = Game.query.all()
    games_schema = GameSchema(many=True)
    results = games_schema.dump(all_games)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_game_sub', methods = ['GET'])
def options_game_sub():
    all_studios = Studio.query.all()
    studios_schema = StudioSchema(many=True)
    results = studios_schema.dump(all_studios)
    return json.dumps(results, ensure_ascii=False)   

@main.app_errorhandler(404)
def forbidden(e):
   return render_template("page404.html"), 404


@main.route('/add', methods = ['POST'])
def add_user():
    em = request.json['email']
    psw = request.json['password']
    un = request.json['username']
    user = User(id=4, email=em, password=psw, username=un)
    user_schema = UserSchema()
    return user_schema.jsonify(user)

@main.route('/user/<id>/')
def user_id(id):
    if current_user.is_authenticated: 
        user = User.query.get(id)
        im = User.query.get(current_user.getId())
        a_b = db.session.query(requests).filter(requests.c.follower_id == current_user.getId(), requests.c.followed_id == id).first()
        b_a = db.session.query(requests).filter(requests.c.follower_id == id, requests.c.followed_id == current_user.getId()).first()
        if a_b and b_a:
            return "Друзья"
        elif a_b:
            return "Заявка подана"
        elif b_a:
            return "Ожидает принятия заявки"
        else:
            return "Подать заявку?"
    else:
        return redirect(url_for('main.login'))
