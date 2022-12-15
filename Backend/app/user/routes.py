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
def user_lookup_callback(jwt_header, jwt_payload):
    identity = jwt_payload["sub"]
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

# @jwt_manager.expired_token_loader
# def expired_token_callback(expired_token):
#     token_type = expired_token['type']
#     return jsonify({
#         'status': 401,
#         'sub_status': 42,
#         'msg': 'The {} token has expired'.format(token_type)
#     }), 401

@jwt_manager.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    # Expired auth header
    if jwt_payload['type'] == 'access':
        resp = make_response(redirect(url_for('.refresh')))
        unset_access_cookies(resp)
        return resp, 302
    elif jwt_payload['type'] == 'refresh':
        print(jwt_header)
        print(jwt_payload)
        identity = jwt_payload['sub']
        user = User.query.filter(User.id == identity).first()
        access_token = user.get_access_token()
        refresh_token = user.get_access_token()
        #сохранил себе refresh
        # access_token = create_access_token(identity=identity, fresh = True)
        response = make_response(redirect(url_for('.login')))
        unset_jwt_cookies(response)
        return response, 302


@user.route("/refresh", methods=["POST", "GET"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = User.query.filter(User.id == identity).first()
    access_token = user.get_access_token()
    # access_token = create_access_token(identity=identity, fresh = True)
    response = make_response(redirect(url_for('.account')))
    set_access_cookies(response, access_token)
    return response

# @user.route("/update_refresh_token", methods=["POST", "GET"])
# def refresh():
#     identity = get_jwt_identity()
#     user = User.query.filter(User.id == identity).first()
#     access_token = user.get_access_token()
#     # access_token = create_access_token(identity=identity, fresh = True)
#     response = make_response(redirect(url_for('.login')))
#     set_access_cookies(response, access_token)
#     return response
# @jwt_manager.additional_claims_loader
# def add_claims_to_access_token(identity):
#      return {
#          "aud": "some_audience",
#          "foo": "bar",
#          "upcase_name": identity.upper(),
#      }

@user.route('/userdatausers/', methods = ['GET'])
def userdatausers():
    userid = request.args.get('userId')
    user = db.session.query(User).filter(User.id == userid).first()
    User_schema = UserSchema()
    user_dump = User_schema.dump(user)
    result = {"User" : user_dump}
    return json.dumps(result, ensure_ascii=False)

@user.route('/userdataitems/', methods = ['GET'])
def userdataitems():
    is_main = request.args.get('isMain')
    userid = request.args.get('userId')
    category = request.args.get('category')
    title = request.args.get('title')
    Film_schema = FilmSchema(many=True, exclude=("title", "director_id"))
    Director_schema = DirectorSchema(many=True)
    Book_schema = BookSchema(many=True, exclude=("title", "author_id"))
    Author_schema = AuthorSchema(many=True)
    Game_schema = GameSchema(many=True, exclude=("title", "studio_id"))
    Studio_schema = StudioSchema(many=True)
    Song_Schema = SongSchema(many=True, exclude=("title", "artist_id"))
    Artist_schema = ArtistSchema(many=True)
    if category == "film":
        if is_main:
            films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userid).all()
            films_dump = Film_schema.dump(films)
            result = {"Film" : []}
            for film in films_dump:
                 result["Film"] = result.setdefault("Film", []) + [film["id"]]
            return json.dumps(result, ensure_ascii=False)
        else:
            directors = db.session.query(Director).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(Film.director_id == Director.id).filter(User.id == userid).all()
            directors_dump = Director_schema.dump(directors)
            result = {"Director" : []}
            for director in directors_dump:
                 result["Director"] = result.setdefault("Director", []) + [director["id"]]
            return json.dumps(result, ensure_ascii=False)
    elif category == "book":
        if is_main:
            books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userid).all()
            books_dump = Book_schema.dump(books)
            result = {"Book" : []}
            for book in books_dump:
                 result["Book"] = result.setdefault("Book", []) + [book["id"]]
            return json.dumps(result, ensure_ascii=False)
        else:
            authors = db.session.query(Author).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(Book.author_id == Author.id).filter(User.id == userid).all()
            authors_dump = Author_schema.dump(authors)
            result = {"Author" : []}
            for author in authors_dump:
                 result["Author"] = result.setdefault("Author", []) + [author["id"]]
            return json.dumps(result, ensure_ascii=False)
    elif category == "game":
        if is_main:
            games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userid).all()
            games_dump = Game_schema.dump(games)
            result = {"Game" : []}
            for game in games_dump:
                 result["Game"] = result.setdefault("Game", []) + [game["id"]]
            return json.dumps(result, ensure_ascii=False)
        else:
            studios = db.session.query(Studio).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(Game.studio_id == Studio.id).filter(User.id == userid).all()
            studios_dump = Studio_schema.dump(studios)
            result = {"Studio" : []}
            for studio in studios_dump:
                 result["Studio"] = result.setdefault("Studio", []) + [studio["id"]]
            return json.dumps(result, ensure_ascii=False)
    elif category == "music":
        if is_main:
            songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userid).all()
            songs_dump = Song_Schema.dump(songs)
            result = {"Song" : []}
            for song in songs_dump:
                 result["Song"] = result.setdefault("Song", []) + [song["id"]]
            return json.dumps(result, ensure_ascii=False)
        else:
            artists = db.session.query(Artist).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(Song.artist_id == Artist.id).filter(User.id == userid).all()            
            artists_dump = Artist_schema.dump(artists)
            result = {"Artist" : []}
            for artist in artists_dump:
                 result["Artist"] = result.setdefault("Artist", []) + [artist["id"]]
            return json.dumps(result, ensure_ascii=False)

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

@user.route('/logout', methods=['GET', 'POST'])
@jwt_required()
def logout():
    response = make_response(redirect(url_for('.login')))
    unset_access_cookies(response)
    unset_refresh_cookies(response)
    flash("Вы вышли из аккаунта", "success")
    return response

@user.route("/test", methods=["POST"])
def test_cookie():
    access_token = request.cookies.get('access_token_cookie')
    refresh_token = request.cookies.get('refresh_token_cookie')
    response = make_response(jsonify({"access_token": access_token}, {"refresh_token": refresh_token}))
    response.set_cookie('access_token_cookie', access_token, max_age=30*60)
    response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
    return response

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