from flask import render_template, request, redirect, flash, url_for, Blueprint, jsonify, make_response, Response
from flask_login import current_user, login_user, logout_user, login_required
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
    # No auth header
    return jsonify({"unauthorized": "you haven't tokens","status code": 302})

@jwt_manager.invalid_token_loader
def invalid_token_callback(callback):
    # Invalid Fresh/Non-Fresh Access token in auth header
    resp = jsonify({"invalid_token": "you have fake tokens","status code": 302})
    unset_jwt_cookies(resp)
    return resp

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
        # identity = jwt_payload['sub']
        # user = User.query.filter(User.id == identity).first()
        # access_token = user.get_access_token()
        # refresh_token = user.get_access_token()
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
    # unset_jwt_cookies(response)
    refresh_token = user.get_refresh_token()
    access_token = user.get_access_token()
    # access_token = create_access_token(identity=identity, fresh = True)
    response = make_response(redirect(url_for('.account')))
    set_access_cookies(response, refresh_token)
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
def addItem():
    userid = request.json.get('userId', None)
    itemId = request.json.get('itemId', None)
    category = request.json.get('category', None)
    is_main = request.json.get('isMain', None)
    print(userid, itemId, category, is_main)
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
def requestscount():
    userid = request.args.get('userId')
    countFollowers = 0
    if userid != None:
        countFollowers = db.session.query(users_requests).filter(users_requests.c.followed_id == userid, users_requests.c.type == 'follower').count()
    return {"count_followers": countFollowers}

@user.route("/users_peers/", methods = ['GET'])
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

@user.route("/login", methods = ['GET'])
def proxy_example():
    token = request.args.get('token')
    # access_token = 'y0_AgAAAAAJZyjrAAjl0wAAAADXO3jleHM9Na-ESAKiHDsUQJKo_b3pVEs'
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
        return {"access_token": access_token, "refresh_token": refresh_token, "user_id": user_id}
        # response = make_response(redirect(url_for('.account')))
        # set_access_cookies(response, access_token)
        # set_refresh_cookies(response, refresh_token)
        # flash("Вы успешно вошли", "success")
        # return response
    else:
        user = User(username=username, email=email)
        if user:
            db.session.add(user)
            db.session.commit()
            user_id = user.id
            access_token = user.get_access_token()
            refresh_token = user.get_refresh_token()
            return {"access_token": access_token, "refresh_token": refresh_token, "user_id": user_id}
            # response = make_response(redirect(url_for('.account')))
            # set_access_cookies(response, access_token)
            # set_refresh_cookies(response, refresh_token)
            # # response.set_cookie('access_token_cookie', access_token, max_age=30*60)
            # # response.set_cookie('refresh_token_cookie', refresh_token, max_age=15*24*3600)
            # flash("Вы успешно зарегистрированы", "success")
            # json_response = response.json()
            # return json_response
        else:
            return {"error": "add database error"}
            # flash("Ошибка при добавлении в БД", "error")
            # return redirect(url_for(".login"))
        # json_response = response.json()
        # return json_response
        # return {"access_token": access_token, "refresh_token": refresh_token}

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
        a_b = db.session.query(users_requests).filter(users_requests.c.follower_id == current_user.getId(), users_requests.c.followed_id == id).first()
        b_a = db.session.query(users_requests).filter(users_requests.c.follower_id == id, users_requests.c.followed_id == current_user.getId()).first()
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