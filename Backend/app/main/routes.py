from flask import render_template, request, redirect, flash, url_for, Blueprint
from flask_login import current_user, login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt
from app.user.forms import LoginForm, RegisterForm
from app.models import User, UserSchema, requests, Book, BookSchema, Author, AuthorSchema, Film, FilmSchema, Director, DirectorSchema
from app.models import Game, GameSchema, Studio, StudioSchema, Song, SongSchema, Artist, ArtistSchema
import json
import urllib

main = Blueprint('main', __name__)

@main.route('/')
def index():
    # users = User.query.all()
    return render_template('index.html')


@main.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.account'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')

            return redirect(next_page) if next_page else redirect(url_for('main.account'))
        else:
            flash('Войти не удалось. Пожалуйста, проверьте электронную почту или пароль', 'danger')
    return render_template("login.html", title="Авторизация", form=form)
    # return render_template('login.html', form=form, title='Логин', legend='Войти')

@main.route("/register", methods=["POST", "GET"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.account'))
    else:
        form = RegisterForm()
        if form.validate_on_submit():
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            user = User(username=form.username.data, email=form.email.data, password=hashed_password)
            # email, password
            if user:
                db.session.add(user)
                db.session.commit()
                # user_schema = UserSchema()
                flash("Вы успешно зарегистрированы", "success")
                # return user_schema.jsonify(user)
                return redirect(url_for('main.login'))
            else:
                flash("Ошибка при добавлении в БД", "error")

        return render_template("register.html", title="Регистрация", form=form)

@main.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    return render_template("profile.html", title="Профиль")

@main.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Вы вышли из аккаунта", "success")
    return redirect(url_for('main.login'))

@main.route('/userfilter/', methods = ['GET'])
def userfilter():
    if request.args:
        film_main = request.args.get('film_main', default = None)
        is_film_main = request.args.get('is_film_main', default = None)
        film_sub = request.args.get('film_sub', default = None)
        is_film_sub = request.args.get('is_film_sub', default = None)
        book_main = request.args.get('book_main', default = None)
        is_book_main = request.args.get('is_book_main', default = None)
        book_sub = request.args.get('book_sub', default = None)
        is_book_sub = request.args.get('is_book_sub', default = None)
        music_main = request.args.get('music_main', default = None)
        is_music_main = request.args.get('is_music_main', default = None)
        music_sub = request.args.get('music_sub', default = None)
        is_music_sub = request.args.get('is_music_sub', default = None)
        game_main = request.args.get('game_main', default = None)
        is_game_main = request.args.get('is_game_main', default = None)
        game_sub = request.args.get('game_sub', default = None)
        is_game_sub = request.args.get('is_game_sub', default = None)
        name = request.args.get('name', default = None)
        id = request.args.get('id', default = None, type=int)
        priority = request.args.get('priority', default = None)
        # return json.dumps(request.args.get('book_main'), ensure_ascii=False)
        # return json.dumps(request.args.getlist('game_sub'))
        # return json.dumps(book_sub, ensure_ascii=False)
        # return json.dumps(request.args, ensure_ascii=False)
        # return f"user_id={user_id}, film_main={film_main}, is_film_main={is_film_main}, film_sub={film_sub}, is_film_sub={is_film_sub}, book_main={book_main}, is_book_main={is_book_main}, book_sub={book_sub}, is_book_sub={is_book_sub}, music_main={music_main}, is_music_main={is_music_main}, music_sub={music_sub}, is_music_sub={is_music_sub}, game_main={game_main}, is_game_main={is_game_main}, game_sub={game_sub}, is_game_sub={is_game_sub}"
        

@main.route('/options_book_main', methods = ['GET'])
def options_book_main():
    all_books = Book.query.all()
    books_schema = BookSchema(many=True)
    results = books_schema.dump(all_books)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_book_sub')
def options_book_sub():
    all_authors = Author.query.all()
    authors_schema = AuthorSchema(many=True)
    results = authors_schema.dump(all_authors)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_film_main')
def options_film_main():
    all_films = Film.query.all()
    films_schema = FilmSchema(many=True)
    results = films_schema.dump(all_films)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_film_sub')
def options_film_sub():
    all_directors = Director.query.all()
    directors_schema = DirectorSchema(many=True)
    results = directors_schema.dump(all_directors)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_music_main')
def options_music_main():
    all_songs = Song.query.all()
    songs_schema = FilmSchema(many=True)
    results = songs_schema.dump(all_songs)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_music_sub')
def options_music_sub():
    all_artists = Artist.query.all()
    artists_schema = ArtistSchema(many=True)
    results = artists_schema.dump(all_artists)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_game_main')
def options_game_main():
    all_games = Game.query.all()
    games_schema = GameSchema(many=True)
    results = games_schema.dump(all_games)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_game_sub')
def options_game_sub():
    all_studios = Studio.query.all()
    studios_schema = StudioSchema(many=True)
    results = studios_schema.dump(all_studios)
    return json.dumps(results, ensure_ascii=False)   

@main.errorhandler(404)
def pageNot(error):
    return ("Страница не найдена", 404)

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
