from flask import render_template, request, redirect, flash, url_for, Blueprint
from flask_login import current_user, login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt
from app.user.forms import LoginForm, RegisterForm
from app.models import *
import json
import urllib
from sqlalchemy import or_, and_

user = Blueprint('user', __name__)

@user.route('/login', methods=['GET', 'POST'])
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

@user.route("/register", methods=["POST", "GET"])
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

@user.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    return render_template("profile.html", title="Профиль")

@user.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Вы вышли из аккаунта", "success")
    return redirect(url_for('main.login'))

@user.route('/userfilter/', methods = ['GET'])
def userfilter():
    if request.args:
        film_main = request.args.getlist('film_main')
        is_film_main = request.args.get('is_film_main', default = None)
        film_sub = request.args.getlist('film_sub')
        is_film_sub = request.args.get('is_film_sub', default = None)
        book_main = request.args.getlist('book_main')
        is_book_main = request.args.get('is_book_main', default = None)
        book_sub = request.args.getlist('book_sub')
        is_book_sub = request.args.get('is_book_sub', default = None)
        music_main = request.args.getlist('music_main')
        is_music_main = request.args.get('is_music_main', default = None)
        music_sub = request.args.getlist('music_sub')
        is_music_sub = request.args.get('is_music_sub', default = None)
        game_main = request.args.getlist('game_main')
        is_game_main = request.args.get('is_game_main', default = None)
        game_sub = request.args.getlist('game_sub')
        is_game_sub = request.args.get('is_game_sub', default = None)
        name = request.args.get('name', default = None)
        id = request.args.get('id', default = None, type=int)
        priority = request.args.get('priority', default = None)

        # found_users = db.session.query(User, Film.id.label("film_id"), Film.title.label("film_title"), Book.id.label("book_id"), Book.title.label("book_title")).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(*[Film.id.like(id_film) for id_film in film_main]) & or_(*[Book.id.like(id_book) for id_book in book_main])).distinct().order_by().all()

        # found_users = db.session.query(User, Book, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(*[Film.id.like(id_film) for id_film in film_main]) & or_(*[Book.id.like(id_book) for id_book in book_main])).distinct().order_by().all()

        found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub])).all()

        # found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub])).all()

        User_schema = UserSchema(many=True)
        found_users_dump = User_schema.dump(found_users)
        Film_Schema = FilmSchema(many=True, exclude=("title", "director_id"))
        Director_schema = DirectorSchema(many=True)
        Book_schema = BookSchema(many=True, exclude=("title", "author_id"))
        Author_schema = AuthorSchema(many=True)
        Game_Schema = GameSchema(many=True, exclude=("title", "studio_id"))
        Studio_schema = StudioSchema(many=True)
        Song_Schema = SongSchema(many=True, exclude=("title", "artist_id"))
        Artist_schema = ArtistSchema(many=True)
        result = {"FoundUsers": []}
        for user in found_users_dump:
            result_temp = {"User" : [], "Film": [], "Director": [], "Book" : [], "Author": [], "Game": [], "Studio": [], "Song": [], "Artist": []}
            result_temp["User"].append(user)
            
            matched_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main])).all()
            matched_films_dump = Film_Schema.dump(matched_films)
            for film in matched_films_dump:
                 result_temp["Film"] = result_temp.setdefault("Film", []) + [film["id"]]

            matched_directors = db.session.query(Director).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(Film.director_id == Director.id).filter(User.id.like(user["id"])).filter(or_(False, *[Film.director_id.like(id_director) for id_director in film_sub])).all()
            matched_directors_dump = Director_schema.dump(matched_directors)
            for director in matched_directors_dump:
                 result_temp["Director"] = result_temp.setdefault("Director", []) + [director["id"]]

            matched_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main])).all()
            matched_books_dump = Book_schema.dump(matched_books)
            for book in matched_books_dump:
                 result_temp["Book"] = result_temp.setdefault("Book", []) + [book["id"]]

            matched_authors = db.session.query(Author).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(Book.author_id == Author.id).filter(User.id.like(user["id"])).filter(or_(False, *[Book.author_id.like(id_author) for id_author in book_sub])).all()
            matched_authors_dump = Author_schema.dump(matched_authors)
            for author in matched_authors_dump:
                 result_temp["Author"] = result_temp.setdefault("Author", []) + [author["id"]]
            
            matched_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main])).all()
            matched_games_dump = Game_Schema.dump(matched_games)
            for game in matched_games_dump:
                 result_temp["Game"] = result_temp.setdefault("Game", []) + [game["id"]]

            matched_studios = db.session.query(Studio).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(Game.studio_id == Studio.id).filter(User.id.like(user["id"])).filter(or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub])).all()
            matched_studios_dump = Studio_schema.dump(matched_studios)
            for studio in matched_studios_dump:
                 result_temp["Studio"] = result_temp.setdefault("Studio", []) + [studio["id"]]

            matched_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main])).all()
            matched_songs_dump = Game_Schema.dump(matched_songs)
            for song in matched_songs_dump:
                 result_temp["Song"] = result_temp.setdefault("Song", []) + [song["id"]]

            matched_artists = db.session.query(Artist).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(Song.artist_id == Artist.id).filter(User.id.like(user["id"])).filter(or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub])).all()
            matched_artists_dump = Artist_schema.dump(matched_artists)
            for artist in matched_artists_dump:
                 result_temp["Artist"] = result_temp.setdefault("Artist", []) + [artist["id"]]
            
            result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]


        return json.dumps(result, ensure_ascii=False)

        # data = [row.__dict__ for row in db.session.query(User).join(user_film).join(Film).filter((user_film.c.user_id == User.id) & (user_film.c.film_id == Film.id)).all()]
        # data = [r._asdict() for r in db.session.query(User.id, User.email, User.username).join(user_film).join(Film).filter((user_film.c.user_id == User.id) & (user_film.c.film_id == Film.id)).all()]
        # data[1]['email']
        # data = db.session.query(User.id.label("user_id"), User.username, Film.id.label("film_id"), Film.title).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).all()
        # data = db.session.query(User.id.label("user_id"), User.username, Film.id.label("film_id"), Film.title).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).all()
        # data = db.session.query(User.id.label("user_id")).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).distinct().all()
        # data = db.session.query(User.id.label("user_id"), User.username).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).distinct("user_id").all()
        # data = db.session.query(User.id.label("user_id")).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).distinct().order_by("user_id").all()

        # db.session.query(user_film).filter(user_film.film_id == ).all()
        # return json.dumps(request.args.get('book_main'), ensure_ascii=False)
        # return json.dumps(request.args.getlist('game_sub'))
        # return json.dumps(book_sub, ensure_ascii=False)
        # return json.dumps(request.args, ensure_ascii=False)
        # return f"user_id={user_id}, film_main={film_main}, is_film_main={is_film_main}, film_sub={film_sub}, is_film_sub={is_film_sub}, book_main={book_main}, is_book_main={is_book_main}, book_sub={book_sub}, is_book_sub={is_book_sub}, music_main={music_main}, is_music_main={is_music_main}, music_sub={music_sub}, is_music_sub={is_music_sub}, game_main={game_main}, is_game_main={is_game_main}, game_sub={game_sub}, is_game_sub={is_game_sub}"