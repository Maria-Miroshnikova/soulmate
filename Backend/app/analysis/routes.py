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

@analysis.route("/common/", methods = ['GET'])
@jwt_required()
def fetchCommonData():
    userId = request.args.get('userId')
    personId = request.args.get('personId')
    category = request.args.get('category')
    is_main = request.args.get('isMain')
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
            users_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userId).all()
            common_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Film.id.like(film.id) for film in users_films])).all()
            
            films_dump = Film_schema.dump(common_films)
            for film in films_dump:
                title = film["title"]
                result_temp = {"id": film["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userId).all()
            common_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Director.id.like(director.id) for director in users_directors])).all()

            directors_dump = Director_schema.dump(common_directors)
            for director in directors_dump:
                title = director["title"]
                result_temp = {"id": director["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "book":
        if is_main == "true":
            users_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userId).all()
            common_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Book.id.like(book.id) for book in users_books])).all()

            books_dump = Book_schema.dump(common_books)
            for book in books_dump:
                title = book["title"]
                result_temp = {"id": book["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userId).all()
            common_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Author.id.like(author.id) for author in users_authors])).all()

            authors_dump = Author_schema.dump(common_authors)
            for author in authors_dump:
                title = author["title"]
                result_temp = {"id": author["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "game":
        if is_main == "true":
            users_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userId).all()
            common_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Game.id.like(game.id) for game in users_games])).all()

            games_dump = Game_schema.dump(common_games)
            for game in games_dump:
                title = game["title"]
                result_temp = {"id": game["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userId).all()
            common_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Studio.id.like(studio.id) for studio in users_studios])).all()

            studios_dump = Studio_schema.dump(common_studios)
            for studio in studios_dump:
                title = studio["title"]
                result_temp = {"id": studio["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "music":
        if is_main == "true":
            users_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userId).all()
            common_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Song.id.like(song.id) for song in users_songs])).all()

            songs_dump = Song_Schema.dump(common_songs)
            for song in songs_dump:
                title = song["title"]
                result_temp = {"id": song["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userId).all()
            common_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Artist.id.like(artist.id) for artist in users_artists])).all()

            artists_dump = Artist_schema.dump(common_artists)
            for artist in artists_dump:
                title = artist["title"]
                result_temp = {"id": artist["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    return json.dumps(result, ensure_ascii=False)

@analysis.route("/new/", methods = ['GET'])
@jwt_required()
def fetchNewData():
    userId = request.args.get('userId')
    personId = request.args.get('personId')
    category = request.args.get('category')
    is_main = request.args.get('isMain')
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
            users_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userId).all()
            new_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Film.id != film.id for film in users_films])).all()
            
            films_dump = Film_schema.dump(new_films)
            for film in films_dump:
                title = film["title"]
                result_temp = {"id": film["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userId).all()
            new_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Director.id != director.id for director in users_directors])).all()

            directors_dump = Director_schema.dump(new_directors)
            for director in directors_dump:
                title = director["title"]
                result_temp = {"id": director["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "book":
        if is_main == "true":
            users_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userId).all()
            new_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Book.id != book.id for book in users_books])).all()

            books_dump = Book_schema.dump(new_books)
            for book in books_dump:
                title = book["title"]
                result_temp = {"id": book["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userId).all()
            new_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Author.id != author.id for author in users_authors])).all()

            authors_dump = Author_schema.dump(new_authors)
            for author in authors_dump:
                title = author["title"]
                result_temp = {"id": author["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "game":
        if is_main == "true":
            users_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userId).all()
            new_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Game.id != game.id for game in users_games])).all()

            games_dump = Game_schema.dump(new_games)
            for game in games_dump:
                title = game["title"]
                result_temp = {"id": game["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userId).all()
            new_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Studio.id != studio.id for studio in users_studios])).all()

            studios_dump = Studio_schema.dump(new_studios)
            for studio in studios_dump:
                title = studio["title"]
                result_temp = {"id": studio["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "music":
        if is_main == "true":
            users_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userId).all()
            new_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Song.id != song.id for song in users_songs])).all()

            songs_dump = Song_Schema.dump(new_songs)
            for song in songs_dump:
                title = song["title"]
                result_temp = {"id": song["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userId).all()
            new_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == personId).filter(and_(*[Artist.id != artist.id for artist in users_artists])).all()

            artists_dump = Artist_schema.dump(new_artists)
            for artist in artists_dump:
                title = artist["title"]
                result_temp = {"id": artist["id"], "title": title[:35]}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    return json.dumps(result, ensure_ascii=False)

@analysis.route("/top/", methods = ['GET'])
@jwt_required()
def fetchTopData():
    userId = request.args.get('userId')
    category = request.args.get('category')
    is_main = request.args.get('isMain')
    is_high = request.args.get('isHigh')
    result = {"Items" : []}
    if category == "film":
        if is_main == "true":
            if is_high == "true":
                top_rating = db.session.query(user_film).filter(user_film.c.user_id == userId).order_by(user_film.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_film).filter(user_film.c.user_id == userId).order_by(user_film.c.rating).limit(5).all()
            for entry in top_rating:
                film = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userId).filter(Film.id == entry.film_id).first()
                if len(film.title) > 35:
                    title = film.title[:35] + '...'
                else:
                    title = film.title[:35]
                result_temp = {"id": film.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if is_high == "true":
                top_rating = db.session.query(user_director).filter(user_director.c.user_id == userId).order_by(user_director.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_director).filter(user_director.c.user_id == userId).order_by(user_director.c.rating).limit(5).all()
            for entry in top_rating:
                director = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userId).filter(Director.id == entry.director_id).first()
                if len(director.title) > 35:
                    title = director.title[:35] + '...'
                else:
                    title = director.title[:35]
                result_temp = {"id": director.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "book":
        if is_main == "true":
            if is_high == "true":
                top_rating = db.session.query(user_book).filter(user_book.c.user_id == userId).order_by(user_book.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_book).filter(user_book.c.user_id == userId).order_by(user_book.c.rating).limit(5).all()
            for entry in top_rating:
                book = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userId).filter(Book.id == entry.book_id).first()
                if len(book.title) > 35:
                    title = book.title[:35] + '...'
                else:
                    title = book.title[:35]
                result_temp = {"id": book.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if is_high == "true":
                top_rating = db.session.query(user_author).filter(user_author.c.user_id == userId).order_by(user_author.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_author).filter(user_author.c.user_id == userId).order_by(user_author.c.rating).limit(5).all()
            for entry in top_rating:
                author = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userId).filter(Author.id == entry.author_id).first()
                if len(author.title) > 35:
                    title = author.title[:35] + '...'
                else:
                    title = author.title[:35]
                result_temp = {"id": author.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "game":
        if is_main == "true":
            if is_high == "true":
                top_rating = db.session.query(user_game).filter(user_game.c.user_id == userId).order_by(user_game.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_game).filter(user_game.c.user_id == userId).order_by(user_game.c.rating).limit(5).all()
            for entry in top_rating:
                game = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userId).filter(Game.id == entry.game_id).first()
                if len(game.title) > 35:
                    title = game.title[:35] + '...'
                else:
                    title = game.title[:35]
                result_temp = {"id": game.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if is_high == "true":
                top_rating = db.session.query(user_studio).filter(user_studio.c.user_id == userId).order_by(user_studio.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_studio).filter(user_studio.c.user_id == userId).order_by(user_studio.c.rating).limit(5).all()
            for entry in top_rating:
                studio = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userId).filter(Studio.id == entry.studio_id).first()
                if len(studio.title) > 35:
                    title = studio.title[:35] + '...'
                else:
                    title = studio.title[:35]
                result_temp = {"id": studio.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "music":
        if is_main == "true":
            if is_high == "true":
                top_rating = db.session.query(user_song).filter(user_song.c.user_id == userId).order_by(user_song.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_song).filter(user_song.c.user_id == userId).order_by(user_song.c.rating).limit(5).all()
            for entry in top_rating:
                song = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userId).filter(Song.id == entry.song_id).first()
                if len(song.title) > 35:
                    title = song.title[:35] + '...'
                else:
                    title = song.title[:35]
                result_temp = {"id": song.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            if is_high == "true":
                top_rating = db.session.query(user_artist).filter(user_artist.c.user_id == userId).order_by(user_artist.c.rating.desc()).limit(5).all()
            else:
                top_rating = db.session.query(user_artist).filter(user_artist.c.user_id == userId).order_by(user_artist.c.rating).limit(5).all()
            for entry in top_rating:
                artist = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userId).filter(Artist.id == entry.artist_id).first()
                if len(artist.title) > 35:
                    title = artist.title[:35] + '...'
                else:
                    title = artist.title[:35]
                result_temp = {"id": artist.id, "title": title, "rating": entry.rating, "review": entry.review}
                result["Items"] = result.setdefault("Items", []) + [result_temp]
    return json.dumps(result, ensure_ascii=False)


@analysis.route("/different/", methods = ['GET'])
@jwt_required()
def fetchDifferentRatingData():
    userId = request.args.get('userId')
    personId = request.args.get('personId')
    category = request.args.get('category')
    is_main = request.args.get('isMain')
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
            users_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userId).all()
            common_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Film.id.like(film.id) for film in users_films])).all()
            
            films_dump = Film_schema.dump(common_films)
            for film in films_dump:
                entry_user = db.session.query(user_film).filter(user_film.c.film_id == film["id"]).filter(user_film.c.user_id == userId).first()
                entry_person = db.session.query(user_film).filter(user_film.c.film_id == film["id"]).filter(user_film.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": film["id"], "title": film["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userId).all()
            common_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Director.id.like(director.id) for director in users_directors])).all()

            directors_dump = Director_schema.dump(common_directors)
            for director in directors_dump:
                entry_user = db.session.query(user_director).filter(user_director.c.director_id == director["id"]).filter(user_director.c.user_id == userId).first()
                entry_person = db.session.query(user_director).filter(user_director.c.director_id == director["id"]).filter(user_director.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": director["id"], "title": director["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "book":
        if is_main == "true":
            users_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userId).all()
            common_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Book.id.like(book.id) for book in users_books])).all()

            books_dump = Book_schema.dump(common_books)
            for book in books_dump:
                entry_user = db.session.query(user_book).filter(user_book.c.book_id == book["id"]).filter(user_book.c.user_id == userId).first()
                entry_person = db.session.query(user_book).filter(user_book.c.book_id == book["id"]).filter(user_book.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": book["id"], "title": book["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userId).all()
            common_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Author.id.like(author.id) for author in users_authors])).all()

            authors_dump = Author_schema.dump(common_authors)
            for author in authors_dump:
                entry_user = db.session.query(user_author).filter(user_author.c.author_id == author["id"]).filter(user_author.c.user_id == userId).first()
                entry_person = db.session.query(user_author).filter(user_author.c.author_id == author["id"]).filter(user_author.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": author["id"], "title": author["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "game":
        if is_main == "true":
            users_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userId).all()
            common_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Game.id.like(game.id) for game in users_games])).all()

            games_dump = Game_schema.dump(common_games)
            for game in games_dump:
                entry_user = db.session.query(user_game).filter(user_game.c.game_id == game["id"]).filter(user_game.c.user_id == userId).first()
                entry_person = db.session.query(user_game).filter(user_game.c.game_id == game["id"]).filter(user_game.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": game["id"], "title": game["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userId).all()
            common_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Studio.id.like(studio.id) for studio in users_studios])).all()

            studios_dump = Studio_schema.dump(common_studios)
            for studio in studios_dump:
                entry_user = db.session.query(user_studio).filter(user_studio.c.studio_id == studio["id"]).filter(user_studio.c.user_id == userId).first()
                entry_person = db.session.query(user_studio).filter(user_studio.c.studio_id == studio["id"]).filter(user_studio.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": studio["id"], "title": studio["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
    elif category == "music":
        if is_main == "true":
            users_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userId).all()
            common_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Song.id.like(song.id) for song in users_songs])).all()

            songs_dump = Song_Schema.dump(common_songs)
            for song in songs_dump:
                entry_user = db.session.query(user_song).filter(user_song.c.song_id == song["id"]).filter(user_song.c.user_id == userId).first()
                entry_person = db.session.query(user_song).filter(user_song.c.song_id == song["id"]).filter(user_song.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": song["id"], "title": song["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
        else:
            users_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userId).all()
            common_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == personId).filter(or_(False, *[Artist.id.like(artist.id) for artist in users_artists])).all()

            artists_dump = Artist_schema.dump(common_artists)
            for artist in artists_dump:
                entry_user = db.session.query(user_artist).filter(user_artist.c.artist_id == artist["id"]).filter(user_artist.c.user_id == userId).first()
                entry_person = db.session.query(user_artist).filter(user_artist.c.artist_id == artist["id"]).filter(user_artist.c.user_id == personId).first()
                if entry_user.rating == None:
                    entry_user_rating = 0
                else:
                    entry_user_rating = entry_user.rating
                if entry_person.rating == None:
                    entry_person_rating = 0
                else:
                    entry_person_rating = entry_person.rating
                if math.fabs((int(entry_user_rating) - int(entry_person_rating))) > 1:
                    result_temp = {"id": artist["id"], "title": artist["title"], "rating_user": entry_user.rating, "rating_person": entry_person.rating}
                    result["Items"] = result.setdefault("Items", []) + [result_temp]
    return json.dumps(result, ensure_ascii=False)

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