from flask import render_template, request, redirect, flash, url_for, Blueprint, jsonify, make_response
from flask_login import current_user, login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt, jwt_manager
from app.user.forms import LoginForm, RegisterForm
from app.models import *
import json
import urllib
from sqlalchemy import or_, and_
from flask_jwt_extended import current_user, jwt_required, create_access_token, get_jwt_identity, get_jwt, set_access_cookies, set_refresh_cookies, unset_access_cookies, unset_refresh_cookies, unset_jwt_cookies, get_current_user

user = Blueprint('user', __name__)

@jwt_manager.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt_manager.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@jwt_manager.unauthorized_loader
def unauthorized_callback(callback):
    # No auth header
    return jsonify({"unauthorized": "you haven't tokens","status code": 302})

@jwt_manager.invalid_token_loader
def invalid_token_callback(callback):
    # Invalid Fresh/Non-Fresh Access token in auth header
    resp = jsonify({"invalid_token": "you have fake tokens","status code": 302})
    unset_jwt_cookies(resp)
    return resp

@jwt_manager.expired_token_loader
def expired_token_callback(callback):
    # Expired auth header
    resp = make_response(redirect(url_for('.refresh')))
    unset_access_cookies(resp)
    return resp, 302

@user.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh = True)
    response = make_response(redirect(url_for('.login')))
    set_access_cookies(response, access_token)
    return response

# @jwt_manager.additional_claims_loader
# def add_claims_to_access_token(identity):
#      return {
#          "aud": "some_audience",
#          "foo": "bar",
#          "upcase_name": identity.upper(),
#      }

@user.route("/register", methods=["POST", "GET"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        if user:
            db.session.add(user)
            db.session.commit()
            access_token = user.get_access_token()
            refresh_token = user.get_refresh_token()
            response = make_response(redirect(url_for('.login')))
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            # response.set_cookie('access_token_cookie', access_token, max_age=30*60)
            # response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
            flash("Вы успешно зарегистрированы", "success")
            return response
        else:
            flash("Ошибка при добавлении в БД", "error")

    return render_template("register.html", title="Регистрация", form=form)

@user.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.authenticate(email=form.email.data, password=form.password.data)
        if user:
            next_page = request.args.get('next')
            access_token = user.get_access_token()
            refresh_token = user.get_refresh_token()
            if next_page:
                response = make_response(redirect(next_page))
            else:
                response = make_response(redirect(url_for('.account')))   
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            # response.set_cookie('access_token_cookie', access_token, max_age=30*60)
            # response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
            # response = make_response(jsonify({"access_token": request.cookies.get('access_token_cookie')}, {"refresh_token": request.cookies.get('refresh_token_cookie')}))
            return response
            # return redirect(next_page) if next_page else redirect(url_for('.account'))
        else:
            flash('Войти не удалось. Пожалуйста, проверьте электронную почту или пароль', 'danger')
    return render_template("login.html", title="Авторизация", form=form)

    # email = request.json.get("email", None)
    # password = request.json.get("password", None)

    # user = User.authenticate(email=email, password=password)
    # if not user:
    #     return jsonify("Wrong email or password"), 401
    
    # # Notice that we are passing in the actual sqlalchemy user object here
    # access_token = user.get_access_token()
    # refresh_token = user.get_refresh_token()
    # response = make_response(jsonify({"access_token": access_token}, {"refresh_token": refresh_token}))
    # set_access_cookies(response, access_token)
    # set_refresh_cookies(response, refresh_token)
    # response.set_cookie('access_token_cookie', access_token, max_age=30*60)
    # response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
    # return response

@user.route("/test", methods=["POST"])
def test_cookie():
    access_token = request.cookies.get('access_token_cookie')
    refresh_token = request.cookies.get('refresh_token_cookie')
    response = make_response(jsonify({"access_token": access_token}, {"refresh_token": refresh_token}))
    response.set_cookie('access_token_cookie', access_token, max_age=30*60)
    response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
    return response

@user.route('/logout', methods=['GET', 'POST'])
@jwt_required()
def logout():
    response = make_response(redirect(url_for('.login')))
    unset_access_cookies(response)
    unset_refresh_cookies(response)
    flash("Вы вышли из аккаунта", "success")
    return response


# @user.route('/logout', methods=['GET', 'POST'])
# @login_required
# def logout():
#     logout_user()
#     flash("Вы вышли из аккаунта", "success")
#     return redirect(url_for('.login'))

@user.route('/account', methods=['GET', 'POST'])
@jwt_required()
def account():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    username = user.username
    email = user.email
    return render_template("profile.html", title="Профиль", username=username, email=email)

@user.route("/who_am_i", methods=["GET"])
@jwt_required()
def who_am_i():
    # We can now access our sqlalchemy User object via `current_user`.
    return jsonify(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
    )

@user.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# @user.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     claims = get_jwt()
#     return jsonify(claims)

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@user.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

# @user.route("/register", methods=["POST", "GET"])
# def register():
#     if current_user.is_authenticated:
#         return redirect(url_for('user.account'))
#     else:
#         form = RegisterForm()
#         if form.validate_on_submit():
#             user = User(username=form.username.data, email=form.email.data, password=form.password.data)
#             # email, password
#             if user:
#                 db.session.add(user)
#                 db.session.commit()
#                 # token = user.get_token()
#                 # return {'access_token': token}
#                 flash("Вы успешно зарегистрированы", "success")
#                 return redirect(url_for('.login'))
#             else:
#                 flash("Ошибка при добавлении в БД", "error")

#         return render_template("register.html", title="Регистрация", form=form)



# @user.route('/logout', methods=['GET', 'POST'])
# @login_required
# def logout():
#     logout_user()
#     flash("Вы вышли из аккаунта", "success")
#     return redirect(url_for('.login'))

@user.route('/user/<id>/')
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
        return redirect(url_for('.login'))

# @user.after_request
# def redirect_to_signin(response):
#     if response.status_code == 401:
#         return redirect(url_for('user.login') + '?next=' + request.url)
#     return response

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

        # found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub])).all()

        found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub])).all()

        # found_users_by_film = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub])).all()

        # found_users_by_book = db.session.query(User).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub])).all()

        # found_users_by_game = db.session.query(User).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub])).all()

        # found_users_by_song = db.session.query(User).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub])).all()

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
    else:
        found_users = db.session.query(User).all()
        User_schema = UserSchema(many=True)
        found_users_dump = User_schema.dump(found_users)
        result = {"FoundUsers": []}
        for user in found_users_dump:
            result_temp = {"User" : [], "Film": [], "Director": [], "Book" : [], "Author": [], "Game": [], "Studio": [], "Song": [], "Artist": []}
            result_temp["User"].append(user)
            result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]
        return json.dumps(result, ensure_ascii=False)

# @user.route('/login', methods=['GET', 'POST'])
# def login():
#     if current_user.is_authenticated:
#         return redirect(url_for('.account'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.authenticate(email=form.email.data, password=form.password.data)
#         if user:
#             login_user(user, remember=form.remember.data)
#             # token = user.get_token()
#             next_page = request.args.get('next')

#             return redirect(next_page) if next_page else redirect(url_for('.account'))
#         else:
#             flash('Войти не удалось. Пожалуйста, проверьте электронную почту или пароль', 'danger')
#     return render_template("login.html", title="Авторизация", form=form)

# @user.route('/login', methods=['GET', 'POST'])
# def login():
#     if current_user.is_authenticated:
#         return redirect(url_for('user.account'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(email=form.email.data).first()
#         if user and bcrypt.check_password_hash(user.password, form.password.data):
#             login_user(user, remember=form.remember.data)
#             next_page = request.args.get('next')

#             return redirect(next_page) if next_page else redirect(url_for('.account'))
#         else:
#             flash('Войти не удалось. Пожалуйста, проверьте электронную почту или пароль', 'danger')
#     return render_template("login.html", title="Авторизация", form=form)
#     # return render_template('login.html', form=form, title='Логин', legend='Войти')