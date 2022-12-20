from flask import render_template, request, redirect, flash, url_for, Blueprint, jsonify, make_response, Response
from flask_login import login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt, jwt_manager, oauth_manager
from app.user.forms import LoginForm, RegisterForm
from app.models import *
import json
import urllib
from sqlalchemy import or_, and_
from flask_jwt_extended import current_user, jwt_required, create_access_token, get_jwt_identity, get_jwt, set_access_cookies, set_refresh_cookies, unset_access_cookies, unset_refresh_cookies, unset_jwt_cookies, get_current_user
from flask_cors import cross_origin
from datetime import datetime
import requests

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
    print(callback)
    return Response("{access token invalid}", status=401, mimetype='application/json')
    # if jwt_payload['type'] == 'access':
    #     print(jwt_header)
    #     print(jwt_payload)
    #     return Response("{haven't access token}", status=401, mimetype='application/json')

@jwt_manager.invalid_token_loader
def invalid_token_callback(callback):
    print(callback)
    return Response("{token invalid}", status=401, mimetype='application/json')
    # if jwt_payload['type'] == 'access':
    #     print(jwt_header)
    #     print(jwt_payload)
    #     return Response("{access token invalid}", status=401, mimetype='application/json')

@jwt_manager.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    # Expired auth header
    if jwt_payload['type'] == 'access':
        print(jwt_payload)
        return Response(status=401)
        # resp = make_response(redirect(url_for('.refresh')))
        # unset_access_cookies(resp)
        # return resp, 302
    elif jwt_payload['type'] == 'refresh':
        print(jwt_payload)
        return Response("{refresh token invalid}", status=401, mimetype='application/json')
    #     # identity = jwt_payload['sub']
    #     # user = User.query.filter(User.id == identity).first()
    #     # access_token = user.get_access_token()
    #     # refresh_token = user.get_access_token()
    #     #сохранил себе refresh
    #     # access_token = create_access_token(identity=identity, fresh = True)
    #     response = make_response(redirect(url_for('.login')))
    #     unset_jwt_cookies(response)
    #     return response, 302


@user.route("/refresh", methods=["POST", "GET"])
@jwt_required(refresh=True)
def refresh():
    refresh_token = request.headers.get('Authorization')
    print({"refresh_token": refresh_token})
    identity = get_jwt_identity()
    user = User.query.filter(User.id == identity).first()
    if user:
        users_refresh_token = "Bearer " + user.refresh_token
        # unset_jwt_cookies(response)
        if users_refresh_token == refresh_token:
            print({"users_refresh_token": users_refresh_token, "refresh_token": refresh_token})
            user_id = user.id
            refresh_token = user.get_refresh_token()
            access_token = user.get_access_token()
            result = {"access_token": access_token, "refresh_token": refresh_token, "user_id": str(user_id)}
            return json.dumps(result, ensure_ascii=False)
        else:
            return Response("{refresh token invalid}", status=401, mimetype='application/json')
    else:
        return Response("{refresh token invalid}", status=401, mimetype='application/json')

    # access_token = create_access_token(identity=identity, fresh = True)
    # response = make_response(redirect(url_for('.account')))
    # set_access_cookies(response, refresh_token)
    # set_access_cookies(response, access_token)
    
    # return response

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

@user.route("/login", methods = ['GET'])
def login():
    token = request.args.get('token')
    response = requests.get("https://login.yandex.ru/info", headers={'Authorization': f'OAuth {token}'})
    # print(response)
    # json_response = response.json()
    # return json_response
    profile = json.loads(response.text)
    avatar = profile['default_avatar_id']
    username = profile['first_name']
    email = profile['default_email']
    found_user = User.query.filter(email==email).first()
    if found_user != None:
        user_id = found_user.id
        access_token = found_user.get_access_token()
        refresh_token = found_user.get_refresh_token()
        result = {"access_token": access_token, "refresh_token": refresh_token, "user_id": str(user_id)}
        return json.dumps(result, ensure_ascii=False)
    else:
        user = User(username=username, email=email)
        if user:
            db.session.add(user)
            db.session.commit()
            user_id = user.id
            access_token = user.get_access_token()
            refresh_token = user.get_refresh_token()
            result = {"access_token": access_token, "refresh_token": refresh_token, "user_id": str(user_id)}
            return json.dumps(result, ensure_ascii=False)
        else:
            result = {"access_token": "", "refresh_token": "", "user_id": ""}
            return json.dumps(result, ensure_ascii=False)

@user.route('/userdatausers/', methods = ['GET'])
@jwt_required()
def userdatausers():
    # access_token = request.headers.get('Authorization')
    # print({"access_token": access_token})
    userid = request.args.get('userId')
    user = db.session.query(User).filter(User.id == userid).first()
    User_schema = UserSchema()
    user_dump = User_schema.dump(user)
    result = {"User" : user_dump}
    return json.dumps(result, ensure_ascii=False)

@user.route('/userdataitems/', methods = ['GET'])
@jwt_required()
def userdataitems():
    is_main = request.args.get('isMain')
    userid = request.args.get('userId')
    category = request.args.get('category')
    title = request.args.get('title', default=None)
    Film_schema = FilmSchema(many=True, only=("id", "title"))
    Director_schema = DirectorSchema(many=True)
    Book_schema = BookSchema(many=True, only=("id", "title"))
    Author_schema = AuthorSchema(many=True)
    Game_schema = GameSchema(many=True, only=("id", "title"))
    Studio_schema = StudioSchema(many=True)
    Song_Schema = SongSchema(many=True, only=("id", "title"))
    Artist_schema = ArtistSchema(many=True)
    result = {"Items" : []}
    if category == "film":
        if is_main == "true":
            if title == None or title == '':
                films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userid).all()
            else:
                films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userid).filter(Film.title.contains(title)).all()
            
            films_dump = Film_schema.dump(films)
            for film in films_dump:
                relationship = db.session.query(user_film).filter(user_film.c.film_id == film["id"]).filter(user_film.c.user_id == userid).first()
                result_temp = {"id": film["id"], "title": film["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if title == None or title == '':
                directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userid).all()
            else:
                directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userid).filter(Director.title.contains(title)).all()
            directors_dump = Director_schema.dump(directors)
            for director in directors_dump:
                relationship = db.session.query(user_director).filter(user_director.c.director_id == director["id"]).filter(user_director.c.user_id == userid).first()
                result_temp = {"id": director["id"], "title": director["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "book":
        if is_main == "true":
            if title == None or title == '':
                books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userid).all()
            else:
                books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userid).filter(Book.title.contains(title)).all()
            books_dump = Book_schema.dump(books)
            for book in books_dump:
                relationship = db.session.query(user_book).filter(user_book.c.book_id == book["id"]).filter(user_book.c.user_id == userid).first()
                result_temp = {"id": book["id"], "title": book["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if title == None or title == '':
                authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userid).all()
            else:
                authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userid).filter(Author.title.contains(title)).all()
            authors_dump = Author_schema.dump(authors)
            for author in authors_dump:
                relationship = db.session.query(user_author).filter(user_author.c.author_id == author["id"]).filter(user_author.c.user_id == userid).first()
                result_temp = {"id": author["id"], "title": author["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "game":
        if is_main == "true":
            if title == None or title == '':
                games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userid).all()
            else:
                games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userid).filter(Game.title.contains(title)).all()
            games_dump = Game_schema.dump(games)
            for game in games_dump:
                relationship = db.session.query(user_game).filter(user_game.c.game_id == game["id"]).filter(user_game.c.user_id == userid).first()
                result_temp = {"id": game["id"], "title": game["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if title == None or title == '':
                studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userid).all()
            else:
                studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userid).filter(Studio.title.contains(title)).all()
            studios_dump = Studio_schema.dump(studios)
            for studio in studios_dump:
                relationship = db.session.query(user_studio).filter(user_studio.c.studio_id == studio["id"]).filter(user_studio.c.user_id == userid).first()
                result_temp = {"id": studio["id"], "title": studio["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "music":
        if is_main == "true":
            if title == None or title == '':
                songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userid).all()
            else:
                songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userid).filter(Song.title.contains(title)).all()
            songs_dump = Song_Schema.dump(songs)
            for song in songs_dump:
                relationship = db.session.query(user_song).filter(user_song.c.song_id == song["id"]).filter(user_song.c.user_id == userid).first()
                result_temp = {"id": song["id"], "title": song["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if title == None or title == '':
                artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userid).all()   
            else:
                artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userid).filter(Artist.title.contains(title)).all()           
            artists_dump = Artist_schema.dump(artists)
            for artist in artists_dump:
                relationship = db.session.query(user_artist).filter(user_artist.c.artist_id == artist["id"]).filter(user_artist.c.user_id == userid).first()
                result_temp = {"id": artist["id"], "title": artist["title"], "rating": relationship.rating, "review": relationship.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    return json.dumps(result, ensure_ascii=False)

@user.route('/api/updateItemRating/', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def updateItemRating():
    #PATCH
    userid = request.json.get('userId', None)
    itemId = request.json.get('itemId', None)
    category = request.json.get('category', None)
    is_main = request.json.get('isMain', None)
    value = request.json.get('value', None)

    if category == "film":
        if is_main == "true":
            entry = db.session.query(user_film).filter(user_film.c.film_id == itemId).filter(user_film.c.user_id == userid).update({'rating': value})
        else:
            entry = db.session.query(user_director).filter(user_director.c.director_id == itemId).filter(user_director.c.user_id == userid).update({'rating': value})
    elif category == "book":
        if is_main == "true":
            entry = db.session.query(user_book).filter(user_book.c.book_id == itemId).filter(user_book.c.user_id == userid).update({'rating': value})
        else:
            entry = db.session.query(user_author).filter(user_author.c.author_id == itemId).filter(user_author.c.user_id == userid).update({'rating': value})
    elif category == "game":
        if is_main == "true":
            entry = db.session.query(user_game).filter(user_game.c.game_id == itemId).filter(user_game.c.user_id == userid).update({'rating': value})
        else:
            entry = db.session.query(user_studio).filter(user_studio.c.studio_id == itemId).filter(user_studio.c.user_id == userid).update({'rating': value})
    elif category == "music":
        if is_main == "true":
            entry = db.session.query(user_song).filter(user_song.c.song_id == itemId).filter(user_song.c.user_id == userid).update({'rating': value})
        else:
            entry = db.session.query(user_artist).filter(user_artist.c.song_id == itemId).filter(user_artist.c.user_id == userid).update({'rating': value})
    if entry:
        db.session.commit()
    return ''

@user.route('/api/updateItemComment/', methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def updateItemComment():
    #PATCH
    userid = request.json.get('userId', None)
    itemId = request.json.get('itemId', None)
    category = request.json.get('category', None)
    is_main = request.json.get('isMain', None)
    value = request.json.get('value', None)

    if category == "film":
        if is_main == "true":
            entry = db.session.query(user_film).filter(user_film.c.film_id == itemId).filter(user_film.c.user_id == userid).update({'review': value})
        else:
            entry = db.session.query(user_director).filter(user_director.c.director_id == itemId).filter(user_director.c.user_id == userid).update({'review': value})
    elif category == "book":
        if is_main == "true":
            entry = db.session.query(user_book).filter(user_book.c.book_id == itemId).filter(user_book.c.user_id == userid).update({'review': value})
        else:
            entry = db.session.query(user_author).filter(user_author.c.author_id == itemId).filter(user_author.c.user_id == userid).update({'review': value})
    elif category == "game":
        if is_main == "true":
            entry = db.session.query(user_game).filter(user_game.c.game_id == itemId).filter(user_game.c.user_id == userid).update({'review': value})
        else:
            entry = db.session.query(user_studio).filter(user_studio.c.studio_id == itemId).filter(user_studio.c.user_id == userid).update({'review': value})
    elif category == "music":
        if is_main == "true":
            entry = db.session.query(user_song).filter(user_song.c.song_id == itemId).filter(user_song.c.user_id == userid).update({'review': value})
        else:
            entry = db.session.query(user_artist).filter(user_artist.c.song_id == itemId).filter(user_artist.c.user_id == userid).update({'review': value})
    if entry:
        db.session.commit()
    return ''
            

@user.route('/api/addItem/', methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def addItem():
    userid = request.json.get('userId', None)
    itemId = request.json.get('itemId', None)
    category = request.json.get('category', None)
    is_main = request.json.get('isMain', None)
    if category == "film":
        if is_main == "true":
            entry = user_film.insert().values(user_id=userid, film_id=itemId)
        else:
            entry = user_director.insert().values(user_id=userid, director_id=itemId)
    elif category == "book":
        if is_main == "true":
            entry = user_book.insert().values(user_id=userid, book_id=itemId)
        else:
            entry = user_author.insert().values(user_id=userid, author_id=itemId)
    elif category == "game":
        if is_main == "true":
            entry = user_game.insert().values(user_id=userid, game_id=itemId)
        else:
            entry = user_studio.insert().values(user_id=userid, studio_id=itemId)
    elif category == "music":
        if is_main == "true":
            entry = user_song.insert().values(user_id=userid, song_id=itemId)
        else:
            entry = user_artist.insert().values(user_id=userid, artist_id=itemId)
    db.session.execute(entry) 
    db.session.commit()
    return ''

@user.route('/api/removeItem/', methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def removeItem():
    #DELETE
    userid = request.json.get('userId', None)
    itemId = request.json.get('itemId', None)
    category = request.json.get('category', None)
    is_main = request.json.get('isMain', None)

    if category == "film":
        if is_main == "true":
            entry = db.session.query(user_film).filter(user_film.c.film_id == itemId, user_film.c.user_id == userid).delete()
        else:
            entry = db.session.query(user_director).filter(user_director.c.director_id == itemId, user_director.c.user_id == userid).delete()
    elif category == "book":
        if is_main == "true":
            entry = db.session.query(user_book).filter(user_book.c.book_id == itemId, user_book.c.user_id == userid).delete()
        else:
            entry = db.session.query(user_author).filter(user_author.c.author_id == itemId, user_author.c.user_id == userid).delete()
    elif category == "game":
        if is_main == "true":
            entry = db.session.query(user_game).filter(user_game.c.game_id == itemId, user_game.c.user_id == userid).delete()
        else:
            entry = db.session.query(user_studio).filter(user_studio.c.studio_id == itemId, user_studio.c.user_id == userid).delete()
    elif category == "music":
        if is_main == "true":
            entry = db.session.query(user_song).filter(user_song.c.song_id == itemId, user_song.c.user_id == userid).delete()
        else:
            entry = db.session.query(user_artist).filter(user_artist.c.artist_id == itemId, user_artist.c.user_id == userid).delete()
    db.session.commit()
    return ''

@user.route("/api/acceptRequestToFriends/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def friends():
    userid = request.json.get('userId', None)
    personId = request.json.get('personId', None)
    if userid != None and personId != None:
        # entry = requests.insert().values(followed_id=personId, follower_id=userid)
        entry_1 = users_requests.insert().values(followed_id=personId, follower_id=userid, type="friends")
        entry_2 = db.session.query(users_requests).filter(users_requests.c.followed_id == userid).filter(users_requests.c.follower_id == personId).update({'type': "friends"})
        db.session.execute(entry_1) 
        db.session.commit()
    return ''

# @user.route("/api/denyRequstToFriends/", methods = ['POST'])
# @cross_origin(origins=['http://localhost:3000'])
# def friends():
#     userid = request.json.get('userId', None)
#     personId = request.json.get('personId', None)
#     # entry = requests.insert().values(followed_id=personId, follower_id=userid)
#     entry_1 = requests.insert().values(followed_id=personId, follower_id=userid, type="friends")
#     entry_2 = db.session.query(requests).filter(requests.c.followed_id == userid).filter(requests.c.follower_id == personId).update({'type': "friends"})
#     db.session.execute(entry_1) 
#     db.session.commit()
#     return ''

@user.route("/api/requestPersonToBeFriends/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def requestPersonToBeFriends():
    userid = request.json.get('userId', None)
    personId = request.json.get('personId', None)
    if userid != None and personId != None:
        check = db.session.query(users_requests).filter(users_requests.c.followed_id == userid, users_requests.c.follower_id == personId).first()
        if check != None:
            entry_1 = users_requests.insert().values(followed_id=personId, follower_id=userid, type="friends")
            entry_2 = db.session.query(users_requests).filter(users_requests.c.followed_id == userid).filter(users_requests.c.follower_id == personId).update({'type': "friends"})
            db.session.execute(entry_1)
        else:
            # entry = requests.insert().values(followed_id=personId, follower_id=userid)
            entry = users_requests.insert().values(followed_id=personId, follower_id=userid, type="follower")
            db.session.execute(entry) 
        db.session.commit()
    return ''

user.route("/api/closeMyRequest/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def removePersonFromFriends():
    #DELETE
    userid = request.json.get('userId', None)
    personId = request.json.get('personId', None)
    print(userid, personId)
    if userid != None and personId != None:
        entry_1 = db.session.query(users_requests).filter(users_requests.c.followed_id == personId, users_requests.c.follower_id == userid).delete()
        db.session.commit()
    return ''

@user.route("/api/removePersonFromFriends/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def removePersonFromFriends():
    #DELETE
    userid = request.json.get('userId', None)
    personId = request.json.get('personId', None)
    print(userid, personId)
    if userid != None and personId != None:
        entry_1 = db.session.query(users_requests).filter(users_requests.c.followed_id == personId, users_requests.c.follower_id == userid).delete()
        entry_2 = db.session.query(users_requests).filter(users_requests.c.followed_id == userid).filter(users_requests.c.follower_id == personId).update({'type': "follower"})
        db.session.commit()
    return ''

@user.route("/fetchTypeOfPersonForUser/", methods = ['GET'])
@jwt_required()
def fetchTypeOfPersonForUser():
    userid = request.args.get('userId')
    personId = request.args.get('personId')
    if userid != None and personId != None:
        user_follower = db.session.query(users_requests).filter(users_requests.c.follower_id == userid, users_requests.c.followed_id == personId).first()
        person_follower = db.session.query(users_requests).filter(users_requests.c.follower_id == personId, users_requests.c.followed_id == userid).first()
        if user_follower and person_follower:
            return {"type": "friends"}
        elif user_follower:
            return {"type": "user_is_follower"}
        elif person_follower:
            return {"type": "person_is_follower"}
        else:
            return {"type": ""}
    else:
        return {"type": ""}

@user.route("/api/visited/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def visited():
    userid = request.json.get('userId', None)
    personId = request.json.get('personId', None)
    if userid != None and personId != None and userid != personId:
        is_entry = db.session.query(browsingHistory).filter(browsingHistory.c.viewer_id == userid).filter(browsingHistory.c.viewed_id == personId).first()
        if is_entry != None:
            entry = db.session.query(browsingHistory).filter(browsingHistory.c.viewer_id == userid).filter(browsingHistory.c.viewed_id == personId).update({'timedate': f"{datetime.now()}"})
        else:
            entry = browsingHistory.insert().values(viewer_id=userid, viewed_id=personId)
            db.session.execute(entry) 
        db.session.commit()
        count_entry = db.session.query(browsingHistory).filter(browsingHistory.c.viewer_id == userid).filter(browsingHistory.c.viewed_id == personId).count()
        if count_entry > 1:
            entry = db.session.query(browsingHistory).filter(browsingHistory.c.viewer_id == userid).filter(browsingHistory.c.viewed_id == personId).first().delete()
            db.session.commit()
    return ''

@user.route("/countFollowers/", methods = ['GET'])
@jwt_required()
def requestscount():
    access_token = request.headers.get('Authorization')
    print({"access_token": access_token})
    userid = request.args.get('userId')
    countFollowers = 0
    if userid != None:
        countFollowers = db.session.query(users_requests).filter(users_requests.c.followed_id == userid, users_requests.c.type == 'follower').count()
    return {"count_followers": countFollowers}

@user.route("/users_peers/", methods = ['GET'])
@jwt_required()
def user_peers():
    userid = request.args.get('userId')
    personType = request.args.get('personType')
    title = request.args.get('title', default=None)
    found_users = None
    if personType == "friends":
        if title == None or title == '':
            found_users = db.session.query(User).filter(users_requests.c.follower_id == User.id).filter(users_requests.c.followed_id == userid, users_requests.c.type == "friends").all()
        else:
            found_users = db.session.query(User).filter(users_requests.c.follower_id == User.id).filter(users_requests.c.followed_id == userid, users_requests.c.type == "friends").filter(User.username.contains(title)).all()
    elif personType == "requests":
        if title == None or title == '':
            found_users = db.session.query(User).filter(users_requests.c.follower_id == User.id).filter(users_requests.c.followed_id == userid, users_requests.c.type == "follower").all()
        else:
            found_users = db.session.query(User).filter(users_requests.c.follower_id == User.id).filter(users_requests.c.followed_id == userid, users_requests.c.type == "follower").filter(User.username.contains(title)).all()
    elif personType == "my_requests":
        if title == None or title == '':
            found_users = db.session.query(User).filter(users_requests.c.followed_id == User.id).filter(users_requests.c.follower_id == userid, users_requests.c.type == "follower").all()
        else:
            found_users = db.session.query(User).filter(users_requests.c.followed_id == User.id).filter(users_requests.c.follower_id == userid, users_requests.c.type == "follower").filter(User.username.contains(title)).all()
    elif personType == "visited":
        if title == None or title == '':
            found_users = db.session.query(User).filter(browsingHistory.c.viewed_id == User.id).filter(browsingHistory.c.viewer_id == userid).all()
        else:
            found_users = db.session.query(User).filter(browsingHistory.c.viewed_id == User.id).filter(browsingHistory.c.viewer_id == userid).filter(User.username.contains(title)).all()

    User_schema = UserSchema(many=True)
    found_users_dump = User_schema.dump(found_users)
    result = {"FoundUsers": []}
    for user in found_users_dump:
        result_temp = {"User" : user}
        result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]
    return json.dumps(result, ensure_ascii=False)

@user.route("/get_id", methods = ['GET'])
@jwt_required()
def get_id():
    id = get_jwt_identity()
    id = str(id)
    return id


@user.route("/api/editUserPersonalInfo/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def editUserPersonalInfo():
    userId = request.json.get('id', None)
    username = request.json.get('nickname', None)
    age = request.json.get('age', None)
    gender = request.json.get('gender', None)
    telegram = request.json.get('telegram', None)
    user = db.session.query(User).filter(User.id == userId).update({'username': username, 'age': age, 'gender': gender, 'telegram': telegram})
    db.session.commit()
    return ''

@user.route("/api/deleteUserAccount/", methods = ['POST'])
@cross_origin(origins=['http://localhost:3000'])
@jwt_required()
def deleteUserAccount():
    userId = request.json.get('userId', None)
    user = db.session.query(User).filter(User.id == userId).first().delete()
    db.session.commit()
    return ''

@user.route("/proxy-example")
def proxy_example():
    response = requests.get("https://login.yandex.ru/info", headers={'Authorization': 'OAuth y0_AgAAAAAJZyjrAAjmXQAAAADXRo6wqdnDgV_fTButH-939ztz6eS-Vz4'})
    json_response = response.json()
    return json_response

@user.route("/login_oauth/", methods = ['GET'])
def login_oauth():
    # github = oauth_manager.create_client('github')
    # redirect_uri = url_for(".authorize", _external=True)
    # return oauth_manager.github.authorize_redirect(redirect_uri)

    # google = oauth_manager.create_client('google')
    # redirect_uri = url_for(".authorize", _external=True)
    # return google.authorize_redirect(redirect_uri)

    yandex = oauth_manager.create_client('yandex')
    redirect_uri = url_for(".authorize", _external=True)
    return yandex.authorize_redirect(redirect_uri)
    
@user.route("/authorize")
def authorize():
    # github = oauth_manager.create_client('github')
    # token = oauth_manager.github.authorize_access_token()
    yandex = oauth_manager.create_client('yandex')
    token = yandex.authorize_access_token()
    return {"token": token}
    # print(token)
    # # resp = oauth_manager.github.get('user')
    # # profile = json.loads(resp.text)
    # # username = profile['login']
    # # email = profile['email']
    # # return {'username': username, 'email': email}
    # resp = yandex.get('userinfo')
    # user_info = resp.json()
    # print(user_info)
    # return user_info   

# @user.route("/authorize")
# def authorize():
#     # github = oauth_manager.create_client('github')
#     # token = oauth_manager.github.authorize_access_token()
#     google = oauth_manager.create_client('google')
#     token = google.authorize_access_token()
#     print(token)
#     # resp = oauth_manager.github.get('user')
#     # profile = json.loads(resp.text)
#     # username = profile['login']
#     # email = profile['email']
#     # return {'username': username, 'email': email}
#     resp = google.get('userinfo')
#     user_info = resp.json()
#     print(user_info)
#     return user_info
    

# @user.route("/login/", methods = ['GET'])
# def get_email():
#     token_1 = {'access_token': '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', 'token_type': 'bearer', 'scope': 'user:email'}
#     resp = oauth_manager.github.get('user', token=token_1)
#     profile = json.loads(resp.text)
#     username = profile['login']
#     email = profile['email']
#     print({'username': username, 'email': email})
#     return {'username': username, 'email': email}

# @user.route("/proxy-example")
# def proxy_example():
#     response = requests.get("https://www.googleapis.com/oauth2/v1/userinfo", headers={'Authorization': 'Bearer ya29.a0AX9GBdU0gMm-wgrH9lDZbMf9vTdhKQ9bHHVEiLvd_09RpE5PRNDdpxuK0Nd9xxh3-nMIqToxEoDMn5emY0a2QSe6g-epBjqsdeS2J3Iq4pexqKJVKPqijFo7QK1v3nokMmkLpsCzlSqgHC7b0XqIxJsDbgftaCgYKAeoSARMSFQHUCsbC47EEJTIuziNjtx2o_61COA0163'})
#     json_response = response.json()
#     print(json_response)
#     return json_response

# @user.route("/proxy-example")
# def proxy_example():
#     response = requests.get("https://api.github.com/user", headers={'Authorization': 'Bearer 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'})
#     json_response = response.json()
#     print(json_response)
#     return json_response

# @user.route("/register", methods=["POST", "GET"])
# def register():
#     form = RegisterForm()
#     if form.validate_on_submit():
#         user = User(username=form.username.data, email=form.email.data, password=form.password.data)
#         if user:
#             db.session.add(user)
#             db.session.commit()
#             access_token = user.get_access_token()
#             refresh_token = user.get_refresh_token()
#             response = make_response(redirect(url_for('.login')))
#             set_access_cookies(response, access_token)
#             set_refresh_cookies(response, refresh_token)
#             # response.set_cookie('access_token_cookie', access_token, max_age=30*60)
#             # response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
#             flash("Вы успешно зарегистрированы", "success")
#             return response
#         else:
#             flash("Ошибка при добавлении в БД", "error")

#     return render_template("register.html", title="Регистрация", form=form)

# @user.route('/login', methods=['GET', 'POST'])
# def login():
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.authenticate(email=form.email.data, password=form.password.data)
#         if user:
#             next_page = request.args.get('next')
#             access_token = user.get_access_token()
#             refresh_token = user.get_refresh_token()
#             if next_page:
#                 response = make_response(redirect(next_page))
#             else:
#                 response = make_response(redirect(url_for('.account')))   
#             set_access_cookies(response, access_token)
#             set_refresh_cookies(response, refresh_token)
#             # response.set_cookie('access_token_cookie', access_token, max_age=30*60)
#             # response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
#             # response = make_response(jsonify({"access_token": request.cookies.get('access_token_cookie')}, {"refresh_token": request.cookies.get('refresh_token_cookie')}))
#             return response
#             # return redirect(next_page) if next_page else redirect(url_for('.account'))
#         else:
#             flash('Войти не удалось. Пожалуйста, проверьте электронную почту или пароль', 'danger')
#     return render_template("login.html", title="Авторизация", form=form)

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

# @user.route('/logout', methods=['GET', 'POST'])
# @jwt_required()
# def logout():
#     response = make_response(redirect(url_for('.login')))
#     unset_access_cookies(response)
#     unset_refresh_cookies(response)
#     flash("Вы вышли из аккаунта", "success")
#     return response

# @user.route("/test", methods=["POST"])
# def test_cookie():
#     access_token = request.cookies.get('access_token_cookie')
#     refresh_token = request.cookies.get('refresh_token_cookie')
#     response = make_response(jsonify({"access_token": access_token}, {"refresh_token": refresh_token}))
#     response.set_cookie('access_token_cookie', access_token, max_age=30*60)
#     response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
#     return response

# @user.route('/account', methods=['GET', 'POST'])
# @jwt_required()
# def account():
#     user = User.query.filter_by(id=get_jwt_identity()).first()
#     username = user.username
#     email = user.email
#     return render_template("profile.html", title="Профиль", username=username, email=email)

# @user.route("/who_am_i", methods=["GET"])
# @jwt_required()
# def who_am_i():
#     # We can now access our sqlalchemy User object via `current_user`.
#     return jsonify(
#         id=current_user.id,
#         username=current_user.username,
#         email=current_user.email,
#     )

# @user.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200

# @user.route("/token", methods=["POST"])
# def create_token():
#     email = request.json.get("email", None)
#     password = request.json.get("password", None)
#     if email != "test" or password != "test":
#         return jsonify({"msg": "Bad email or password"}), 401

#     access_token = create_access_token(identity=email)
#     return jsonify(access_token=access_token)

# @user.after_request
# def redirect_to_signin(response):
#     if response.status_code == 401:
#         return redirect(url_for('user.login') + '?next=' + request.url)
#     return response