from flask import render_template, request, redirect, flash, url_for, Blueprint
from flask_login import current_user, login_user, logout_user, login_required
from app.models import check_password_hash, generate_password_hash
from app import db, bcrypt
from app.user.forms import LoginForm, RegisterForm
from app.models import *
import json
import urllib
from sqlalchemy import or_, and_
from flask_jwt_extended import current_user, jwt_required, create_access_token, get_jwt_identity, get_jwt, set_access_cookies, set_refresh_cookies, unset_access_cookies, unset_refresh_cookies, unset_jwt_cookies, get_current_user

main = Blueprint('main', __name__)

@main.before_app_first_request
def create_tables():
    print("Создал бд")
    db.create_all()

@main.route('/')
def index():
    # users = User.query.all()
    return render_template('index.html')

@main.route('/options_book_main/', methods = ['GET'])
def options_book_main():
    title = request.args.get('title', default=None)
    if title == None:
        all_books = Book.query.all()
    else:
        all_books = db.session.query(Book).filter(Book.title.contains(title)).all()
    books_schema = BookSchema(many=True)
    results = books_schema.dump(all_books)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_book_sub/', methods = ['GET'])
def options_book_sub():
    title = request.args.get('title', default=None)
    if title == None:
        all_authors = Author.query.all()
    else:
        all_authors = db.session.query(Author).filter(Author.title.contains(title)).all()
    authors_schema = AuthorSchema(many=True)
    results = authors_schema.dump(all_authors)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_film_main/', methods = ['GET'])
def options_film_main():
    title = request.args.get('title', default=None)
    if title == None:
        all_films = Film.query.all()
    else:
        all_films = db.session.query(Film).filter(Film.title.contains(title)).all()
    films_schema = FilmSchema(many=True)
    results = films_schema.dump(all_films)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_film_sub/', methods = ['GET'])
def options_film_sub():
    title = request.args.get('title', default=None)
    if title == None:
        all_directors = Director.query.all()
    else:
        all_directors = db.session.query(Director).filter(Director.title.contains(title)).all()
    directors_schema = DirectorSchema(many=True)
    results = directors_schema.dump(all_directors)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_music_main/', methods = ['GET'])
def options_music_main():
    title = request.args.get('title', default=None)
    if title == None:
        all_songs = Song.query.all()
    else:
        all_songs = db.session.query(Song).filter(Song.title.contains(title)).all()
    songs_schema = FilmSchema(many=True)
    results = songs_schema.dump(all_songs)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_music_sub/', methods = ['GET'])
def options_music_sub():
    title = request.args.get('title', default=None)
    if title == None:
        all_artists = Artist.query.all()
    else:
        all_artists = db.session.query(Artist).filter(Artist.title.contains(title)).all()
    artists_schema = ArtistSchema(many=True)
    results = artists_schema.dump(all_artists)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_game_main/', methods = ['GET'])
def options_game_main():
    title = request.args.get('title', default=None)
    if title == None:
        all_games = Game.query.all()
    else:
        all_games = db.session.query(Game).filter(Game.title.contains(title)).all()
    games_schema = GameSchema(many=True)
    results = games_schema.dump(all_games)
    return json.dumps(results, ensure_ascii=False)

@main.route('/options_game_sub/', methods = ['GET'])
def options_game_sub():
    title = request.args.get('title', default=None)
    if title == None:
        all_studios = Studio.query.all()
    else:
        all_studios = db.session.query(Studio).filter(Studio.title.contains(title)).all()
    studios_schema = StudioSchema(many=True)
    results = studios_schema.dump(all_studios)
    return json.dumps(results, ensure_ascii=False)   

# @main.app_errorhandler(404)
# def forbidden(e):
#    return render_template("page404.html"), 404

@main.route('/userfilter/', methods = ['GET'])
@jwt_required()
def userfilter():
    if request.args:
        userid = request.args.get('userid')
        film_main = request.args.get('film_main')
        is_film_main = request.args.get('is_film_main', default = None)
        film_sub = request.args.get('film_sub')
        is_film_sub = request.args.get('is_film_sub', default = None)
        book_main = request.args.get('book_main')
        is_book_main = request.args.get('is_book_main', default = None)
        book_sub = request.args.get('book_sub')
        is_book_sub = request.args.get('is_book_sub', default = None)
        music_main = request.args.get('music_main')
        is_music_main = request.args.get('is_music_main', default = None)
        music_sub = request.args.get('music_sub')
        is_music_sub = request.args.get('is_music_sub', default = None)
        game_main = request.args.get('game_main')
        is_game_main = request.args.get('is_game_main', default = None)
        game_sub = request.args.get('game_sub')
        is_game_sub = request.args.get('is_game_sub', default = None)
        name = request.args.get('name', default = None)
        id = request.args.get('id', default = None, type=int)
        priority = request.args.get('priority', default = None)

        if film_main != None:
            film_main = film_main.split(",")
        else:
            film_main = []
        if film_sub != None:
            film_sub = film_sub.split(",")
        else:
            film_sub = []
        if book_main != None:
            book_main = book_main.split(",")
        else:
            book_main = []
        if book_sub != None:
            book_sub = book_sub.split(",")
        else:
            book_sub = []
        if game_main != None:
            game_main = game_main.split(",")
        else:
            game_main = []
        if game_sub != None:
            game_sub = game_sub.split(",")
        else:
            game_sub = []
        if music_main != None:
            music_main = music_main.split(",")
        else:
            music_main = []
        if music_sub != None:
            music_sub = music_sub.split(",")
        else:
            music_sub = []

        print({"film_main": film_main})
        list_user_films = []
        list_user_directors = []
        list_user_books = []
        list_user_authors = []
        list_user_games = []
        list_user_studios = []
        list_user_songs = []
        list_user_artists = []

        if is_film_main:
            list_user_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userid).all()

        if is_film_sub:
            list_user_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userid).all()
            # found_user_directors = db.session.query(Director).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(Film.director_id == Director.id).filter(User.id == userid).all()

        if is_book_main:
            list_user_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userid).all()

        if is_book_sub:
            list_user_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userid).all()
            # found_user_authors = db.session.query(Author).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(Book.author_id == Author.id).filter(User.id == userid).all()

        if is_game_main:
            list_user_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userid).all()

        if is_game_sub:
            list_user_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userid).all()

        if is_music_main:
            list_user_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userid).all()

        if is_music_sub:
            list_user_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userid).all()

        User_schema = UserSchema(many=True)
        if name == None:
            found_users_by_film = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.id.like(film.id) for film in list_user_films])).filter(User.id != userid).all()

            found_users_by_film_dump = User_schema.dump(found_users_by_film)

            found_users_by_director = db.session.query(User).filter(user_director.c.user_id == User.id).filter(user_director.c.director_id == Director.id).filter(or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Director.id.like(director.id) for director in list_user_directors])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(User.id != userid).all()

            found_users_by_director_dump = User_schema.dump(found_users_by_director)

            found_users_by_book = db.session.query(User).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.id.like(book.id) for book in list_user_books])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(User.id != userid).all()

            found_users_by_book_dump = User_schema.dump(found_users_by_book)

            found_users_by_author = db.session.query(User).filter(user_author.c.user_id == User.id).filter(user_author.c.author_id == Author.id).filter(or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Author.id.like(author.id) for author in list_user_authors])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(User.id != userid).all()

            found_users_by_author_dump = User_schema.dump(found_users_by_author)

            found_users_by_game = db.session.query(User).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.id.like(game.id) for game in list_user_games])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(User.id != userid).all()

            found_users_by_game_dump = User_schema.dump(found_users_by_game)

            found_users_by_studio = db.session.query(User).filter(user_studio.c.user_id == User.id).filter(user_studio.c.studio_id == Studio.id).filter(or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Studio.id.like(studio.id) for studio in list_user_studios])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_game_dump])).filter(User.id != userid).all()

            found_users_by_studio_dump = User_schema.dump(found_users_by_studio)

            found_users_by_song = db.session.query(User).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.id.like(song.id) for song in list_user_songs])).filter(User.id != userid).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_game_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_studio_dump])).all()

            found_users_by_song_dump = User_schema.dump(found_users_by_song)

            found_users_by_artist = db.session.query(User).filter(user_artist.c.user_id == User.id).filter(user_artist.c.artist_id == Artist.id).filter(or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Artist.id.like(artist.id) for artist in list_user_artists])).filter(User.id != userid).filter(User.id != userid).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_game_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_studio_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_song_dump])).all()

            found_users_by_artist_dump = User_schema.dump(found_users_by_artist)
        else:
            found_users_by_film = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.id.like(film.id) for film in list_user_films])).filter(User.id != userid).filter(User.username.contains(name)).all()

            found_users_by_film_dump = User_schema.dump(found_users_by_film)

            found_users_by_director = db.session.query(User).filter(user_director.c.user_id == User.id).filter(user_director.c.director_id == Director.id).filter(or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Director.id.like(director.id) for director in list_user_directors])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(User.id != userid).filter(User.username.contains(name)).all()

            found_users_by_director_dump = User_schema.dump(found_users_by_director)

            found_users_by_book = db.session.query(User).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.id.like(book.id) for book in list_user_books])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(User.id != userid).filter(User.username.contains(name)).all()

            found_users_by_book_dump = User_schema.dump(found_users_by_book)

            found_users_by_author = db.session.query(User).filter(user_author.c.user_id == User.id).filter(user_author.c.author_id == Author.id).filter(or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Author.id.like(author.id) for author in list_user_authors])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(User.id != userid).filter(User.username.contains(name)).all()

            found_users_by_author_dump = User_schema.dump(found_users_by_author)

            found_users_by_game = db.session.query(User).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.id.like(game.id) for game in list_user_games])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(User.id != userid).filter(User.username.contains(name)).all()

            found_users_by_game_dump = User_schema.dump(found_users_by_game)

            found_users_by_studio = db.session.query(User).filter(user_studio.c.user_id == User.id).filter(user_studio.c.studio_id == Studio.id).filter(or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Studio.id.like(studio.id) for studio in list_user_studios])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_game_dump])).filter(User.id != userid).filter(User.username.contains(name)).all()

            found_users_by_studio_dump = User_schema.dump(found_users_by_studio)

            found_users_by_song = db.session.query(User).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.id.like(song.id) for song in list_user_songs])).filter(User.id != userid).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_game_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_studio_dump])).filter(User.username.contains(name)).all()

            found_users_by_song_dump = User_schema.dump(found_users_by_song)

            found_users_by_artist = db.session.query(User).filter(user_artist.c.user_id == User.id).filter(user_artist.c.artist_id == Artist.id).filter(or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Artist.id.like(artist.id) for artist in list_user_artists])).filter(User.id != userid).filter(User.id != userid).filter(and_(True, *[User.id != user["id"] for user in found_users_by_film_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_director_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_book_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_author_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_game_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_studio_dump])).filter(and_(True, *[User.id != user["id"] for user in found_users_by_song_dump])).filter(User.username.contains(name)).all()

            found_users_by_artist_dump = User_schema.dump(found_users_by_artist)

        
        # found_users_dump = User_schema.dump(found_users)

        found_users_dump = found_users_by_film_dump + found_users_by_director_dump + found_users_by_book_dump + found_users_by_author_dump + found_users_by_game_dump + found_users_by_studio_dump + found_users_by_song_dump + found_users_by_artist_dump

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
            result_temp = {"User" : user, "Film": [], "Director": [], "Book" : [], "Author": [], "Game": [], "Studio": [], "Song": [], "Artist": []}
            # result_temp["User"] = user
            
            matched_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.id.like(film.id) for film in list_user_films])).all()
            matched_films_dump = Film_Schema.dump(matched_films)
            for film in matched_films_dump:
                 result_temp["Film"] = result_temp.setdefault("Film", []) + [film["id"]]

            matched_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Director.id.like(director.id) for director in list_user_directors])).all()
            matched_directors_dump = Director_schema.dump(matched_directors)
            for director in matched_directors_dump:
                 result_temp["Director"] = result_temp.setdefault("Director", []) + [director["id"]]

            matched_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.id.like(book.id) for book in list_user_books])).all()
            matched_books_dump = Book_schema.dump(matched_books)
            for book in matched_books_dump:
                 result_temp["Book"] = result_temp.setdefault("Book", []) + [book["id"]]

            matched_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Author.id.like(author.id) for author in list_user_authors])).all()
            matched_authors_dump = Author_schema.dump(matched_authors)
            for author in matched_authors_dump:
                 result_temp["Author"] = result_temp.setdefault("Author", []) + [author["id"]]
            
            matched_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.id.like(game.id) for game in list_user_games])).all()
            matched_games_dump = Game_Schema.dump(matched_games)
            for game in matched_games_dump:
                 result_temp["Game"] = result_temp.setdefault("Game", []) + [game["id"]]

            matched_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Studio.id.like(studio.id) for studio in list_user_studios])).all()
            matched_studios_dump = Studio_schema.dump(matched_studios)
            for studio in matched_studios_dump:
                 result_temp["Studio"] = result_temp.setdefault("Studio", []) + [studio["id"]]

            matched_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.id.like(song.id) for song in list_user_songs])).all()
            matched_songs_dump = Song_Schema.dump(matched_songs)
            for song in matched_songs_dump:
                 result_temp["Song"] = result_temp.setdefault("Song", []) + [song["id"]]

            matched_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Artist.id.like(artist.id) for artist in list_user_artists])).all()
            matched_artists_dump = Artist_schema.dump(matched_artists)
            for artist in matched_artists_dump:
                 result_temp["Artist"] = result_temp.setdefault("Artist", []) + [artist["id"]]
            
            result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]
        print(result)
        return json.dumps(result, ensure_ascii=False)


        # found_users = db.session.query(User, Film.id.label("film_id"), Film.title.label("film_title"), Book.id.label("book_id"), Book.title.label("book_title")).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(*[Film.id.like(id_film) for id_film in film_main]) & or_(*[Book.id.like(id_book) for id_book in book_main])).distinct().order_by().all()

        # found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Film.id.like(film.id) for film in found_user_films]) | or_(False, *[Film.director_id.like(director.id) for director in found_user_directors]) | or_(False, *[Book.id.like(book.id) for book in found_user_books]) | or_(False, *[Book.author_id.like(author.id) for author in found_user_authors]) | or_(False, *[Game.id.like(game.id) for game in found_user_games]) | or_(False, *[Game.studio_id.like(studio.id) for studio in found_user_studios]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs]) | or_(False, *[Song.artist_id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).all()

        # if name == None:
        #     found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(user_director.c.user_id == User.id).filter(user_director.c.director_id == Director.id).filter(user_author.c.user_id == User.id).filter(user_author.c.author_id == Author.id).filter(user_studio.c.user_id == User.id).filter(user_studio.c.studio_id == Studio.id).filter(user_artist.c.user_id == User.id).filter(user_artist.c.artist_id == Artist.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Film.id.like(film.id) for film in found_user_films]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors]) | or_(False, *[Book.id.like(book.id) for book in found_user_books]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors]) | or_(False, *[Game.id.like(game.id) for game in found_user_games]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).all()
        # else:
        #     found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(user_director.c.user_id == User.id).filter(user_director.c.director_id == Director.id).filter(user_author.c.user_id == User.id).filter(user_author.c.author_id == Author.id).filter(user_studio.c.user_id == User.id).filter(user_studio.c.studio_id == Studio.id).filter(user_artist.c.user_id == User.id).filter(user_artist.c.artist_id == Artist.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Film.id.like(film.id) for film in found_user_films]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors]) | or_(False, *[Book.id.like(book.id) for book in found_user_books]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors]) | or_(False, *[Game.id.like(game.id) for game in found_user_games]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).filter(User.username.contains(name)).all()


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
            result_temp["User"] = user
            result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]
        return json.dumps(result, ensure_ascii=False)

# @main.route('/userfilter/', methods = ['GET'])
# def userfilter():
#     if request.args:
#         userid = request.args.get('userid')
#         film_main = request.args.getlist('film_main', default = None)
#         is_film_main = request.args.get('is_film_main', default = None)
#         film_sub = request.args.getlist('film_sub', default = None)
#         is_film_sub = request.args.get('is_film_sub', default = None)
#         book_main = request.args.getlist('book_main', default = None)
#         is_book_main = request.args.get('is_book_main', default = None)
#         book_sub = request.args.getlist('book_sub', default = None)
#         is_book_sub = request.args.get('is_book_sub', default = None)
#         music_main = request.args.getlist('music_main', default = None)
#         is_music_main = request.args.get('is_music_main', default = None)
#         music_sub = request.args.getlist('music_sub', default = None)
#         is_music_sub = request.args.get('is_music_sub', default = None)
#         game_main = request.args.getlist('game_main', default = None)
#         is_game_main = request.args.get('is_game_main', default = None)
#         game_sub = request.args.getlist('game_sub', default = None)
#         is_game_sub = request.args.get('is_game_sub', default = None)
#         name = request.args.get('name', default = None)
#         id = request.args.get('id', default = None, type=int)
#         priority = request.args.get('priority', default = None)

#         found_user_films = []
#         found_user_directors = []
#         found_user_books = []
#         found_user_authors = []
#         found_user_games = []
#         found_user_studios = []
#         found_user_songs = []
#         found_user_artists = []

#         if is_film_main:
#             found_user_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id == userid).all()
#             # found_users_with_my_films = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.id.like(film.id) for film in found_user_films])).filter(User.id != userid).all()

#         if is_film_sub:
#             found_user_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id == userid).all()
#             # found_user_directors = db.session.query(Director).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(Film.director_id == Director.id).filter(User.id == userid).all()
#             # found_users_with_my_directors = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.director_id.like(director.id) for director in found_user_directors])).filter(User.id != userid).all()

#         if is_book_main:
#             found_user_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id == userid).all()

#         if is_book_sub:
#             found_user_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id == userid).all()
#             # found_user_authors = db.session.query(Author).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(Book.author_id == Author.id).filter(User.id == userid).all()

#         if is_game_main:
#             found_user_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id == userid).all()

#         if is_game_sub:
#             found_user_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id == userid).all()
#             # found_user_studios = db.session.query(Studio).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(Game.studio_id == Studio.id).filter(User.id == userid).all()

#         if is_music_main:
#             found_user_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id == userid).all()

#         if is_music_sub:
#             found_user_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id == userid).all()
#             # found_user_artists = db.session.query(Artist).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(Song.artist_id == Artist.id).filter(User.id == userid).all()

#         # found_users = db.session.query(User, Film.id.label("film_id"), Film.title.label("film_title"), Book.id.label("book_id"), Book.title.label("book_title")).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(*[Film.id.like(id_film) for id_film in film_main]) & or_(*[Book.id.like(id_book) for id_book in book_main])).distinct().order_by().all()

#         # found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub])).all()

#         # found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.director_id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.author_id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.studio_id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.artist_id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Film.id.like(film.id) for film in found_user_films]) | or_(False, *[Film.director_id.like(director.id) for director in found_user_directors]) | or_(False, *[Book.id.like(book.id) for book in found_user_books]) | or_(False, *[Book.author_id.like(author.id) for author in found_user_authors]) | or_(False, *[Game.id.like(game.id) for game in found_user_games]) | or_(False, *[Game.studio_id.like(studio.id) for studio in found_user_studios]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs]) | or_(False, *[Song.artist_id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).all()

#         if name == None:
#             found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Film.id.like(film.id) for film in found_user_films]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors]) | or_(False, *[Book.id.like(book.id) for book in found_user_books]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors]) | or_(False, *[Game.id.like(game.id) for game in found_user_games]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).all()
#         else:
#             found_users = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Film.id.like(film.id) for film in found_user_films]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors]) | or_(False, *[Book.id.like(book.id) for book in found_user_books]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors]) | or_(False, *[Game.id.like(game.id) for game in found_user_games]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).filter(User.username.contains(name)).all()

#         if film_main != None:
#             if name != None:
#                 found_users_by_film = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.id.like(film.id) for film in found_user_films])).filter(User.id != userid).all()
#             else:
#                 found_users_by_film = db.session.query(User).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.id.like(film.id) for film in found_user_films])).filter(User.username.contains(name)).filter(User.id != userid).all()
        
#         if film_sub != None:
#             if name != None:
#                 found_users_by_director = db.session.query(User).filter(user_director.c.user_id == User.id).filter(user_director.c.director_id == Director.id).filter(or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors])).filter(User.id != userid).all()
#             else:
#                 found_users_by_director = db.session.query(User).filter(user_director.c.user_id == User.id).filter(user_director.c.director_id == Director.id).filter(or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors])).filter(User.username.contains(name)).filter(User.id != userid).all()

#         if book_main != None:
#             if name != None:
#                 found_users_by_book = db.session.query(User).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.id.like(book.id) for book in found_user_books])).filter(User.id != userid).all()
#             else:
#                 found_users_by_book = db.session.query(User).filter(user_book.c.user_id == User.id).filter(user_book.c.book_id == Book.id).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.id.like(book.id) for book in found_user_books])).filter(User.username.contains(name)).filter(User.id != userid).all()

#         if book_sub != None:
#             if name != None:
#                 found_users_by_author = db.session.query(User).filter(user_author.c.user_id == User.id).filter(user_author.c.author_id == Author.id).filter(or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors])).filter(User.id != userid).all()
#             else:
#                 found_users_by_author = db.session.query(User).filter(user_author.c.user_id == User.id).filter(user_author.c.author_id == Author.id).filter(or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors])).filter(User.username.contains(name)).filter(User.id != userid).all()
        
#         if game_main != None:
#             if name != None:
#                 found_users_by_game = db.session.query(User).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.id.like(game.id) for game in found_user_games])).filter(User.id != userid).all()
#             else:
#                 found_users_by_game = db.session.query(User).filter(user_game.c.user_id == User.id).filter(user_game.c.game_id == Game.id).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.id.like(game.id) for game in found_user_games])).filter(User.username.contains(name)).filter(User.id != userid).all()
        
#         if game_sub != None:
#             if name != None:
#                 found_users_by_studio = db.session.query(User).filter(user_studio.c.user_id == User.id).filter(user_studio.c.studio_id == Game.id).filter(or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios])).filter(User.id != userid).all()
#             else:
#                 found_users_by_studio = db.session.query(User).filter(user_studio.c.user_id == User.id).filter(user_studio.c.studio_id == Game.id).filter(or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios])).filter(User.username.contains(name)).filter(User.id != userid).all()
        
#         if music_main != None:
#             if name != None:
#                 found_users_by_song = db.session.query(User).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs])).filter(User.id != userid).all()
#             else:
#                 found_users_by_song = db.session.query(User).filter(user_song.c.user_id == User.id).filter(user_song.c.song_id == Song.id).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs])).filter(User.username.contains(name)).filter(User.id != userid).all()

#         if music_sub != None:
#             if name != None:
#                 found_users_by_artist = db.session.query(User).filter(user_artist.c.user_id == User.id).filter(user_artist.c.artist_id == Song.id).filter(or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).filter(User.id != userid).all()
#             else:
#                 found_users_by_artist = db.session.query(User).filter(user_artist.c.user_id == User.id).filter(user_artist.c.artist_id == Song.id).filter(or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).filter(User.username.contains(name)).filter(User.id != userid).all()

#         User_schema = UserSchema(many=True)
#         found_users_dump = User_schema.dump(found_users)
#         Film_Schema = FilmSchema(many=True, exclude=("title", "director_id"))
#         Director_schema = DirectorSchema(many=True)
#         Book_schema = BookSchema(many=True, exclude=("title", "author_id"))
#         Author_schema = AuthorSchema(many=True)
#         Game_Schema = GameSchema(many=True, exclude=("title", "studio_id"))
#         Studio_schema = StudioSchema(many=True)
#         Song_Schema = SongSchema(many=True, exclude=("title", "artist_id"))
#         Artist_schema = ArtistSchema(many=True)
#         result = {"FoundUsers": []}
#         for user in found_users_dump:
#             result_temp = {"User" : user, "Film": [], "Director": [], "Book" : [], "Author": [], "Game": [], "Studio": [], "Song": [], "Artist": []}
#             # result_temp["User"] = user
            
#             matched_films = db.session.query(Film).filter(user_film.c.film_id == Film.id).filter(user_film.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Film.id.like(id_film) for id_film in film_main]) | or_(False, *[Film.id.like(film.id) for film in found_user_films])).all()
#             matched_films_dump = Film_Schema.dump(matched_films)
#             for film in matched_films_dump:
#                  result_temp["Film"] = result_temp.setdefault("Film", []) + [film["id"]]

#             matched_directors = db.session.query(Director).filter(user_director.c.director_id == Director.id).filter(user_director.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Director.id.like(id_director) for id_director in film_sub]) | or_(False, *[Director.id.like(director.id) for director in found_user_directors])).all()
#             matched_directors_dump = Director_schema.dump(matched_directors)
#             for director in matched_directors_dump:
#                  result_temp["Director"] = result_temp.setdefault("Director", []) + [director["id"]]

#             matched_books = db.session.query(Book).filter(user_book.c.book_id == Book.id).filter(user_book.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Book.id.like(id_book) for id_book in book_main]) | or_(False, *[Book.id.like(book.id) for book in found_user_books])).all()
#             matched_books_dump = Book_schema.dump(matched_books)
#             for book in matched_books_dump:
#                  result_temp["Book"] = result_temp.setdefault("Book", []) + [book["id"]]

#             matched_authors = db.session.query(Author).filter(user_author.c.author_id == Author.id).filter(user_author.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Author.id.like(id_author) for id_author in book_sub]) | or_(False, *[Author.id.like(author.id) for author in found_user_authors])).all()
#             matched_authors_dump = Author_schema.dump(matched_authors)
#             for author in matched_authors_dump:
#                  result_temp["Author"] = result_temp.setdefault("Author", []) + [author["id"]]
            
#             matched_games = db.session.query(Game).filter(user_game.c.game_id == Game.id).filter(user_game.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Game.id.like(id_game) for id_game in game_main]) | or_(False, *[Game.id.like(game.id) for game in found_user_games])).all()
#             matched_games_dump = Game_Schema.dump(matched_games)
#             for game in matched_games_dump:
#                  result_temp["Game"] = result_temp.setdefault("Game", []) + [game["id"]]

#             matched_studios = db.session.query(Studio).filter(user_studio.c.studio_id == Studio.id).filter(user_studio.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Studio.id.like(id_studio) for id_studio in game_sub]) | or_(False, *[Studio.id.like(studio.id) for studio in found_user_studios])).all()
#             matched_studios_dump = Studio_schema.dump(matched_studios)
#             for studio in matched_studios_dump:
#                  result_temp["Studio"] = result_temp.setdefault("Studio", []) + [studio["id"]]

#             matched_songs = db.session.query(Song).filter(user_song.c.song_id == Song.id).filter(user_song.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Song.id.like(id_song) for id_song in music_main]) | or_(False, *[Song.id.like(song.id) for song in found_user_songs])).all()
#             matched_songs_dump = Song_Schema.dump(matched_songs)
#             for song in matched_songs_dump:
#                  result_temp["Song"] = result_temp.setdefault("Song", []) + [song["id"]]

#             matched_artists = db.session.query(Artist).filter(user_artist.c.artist_id == Artist.id).filter(user_artist.c.user_id == User.id).filter(User.id.like(user["id"])).filter(or_(False, *[Artist.id.like(id_artist) for id_artist in music_sub]) | or_(False, *[Artist.id.like(artist.id) for artist in found_user_artists])).all()
#             matched_artists_dump = Artist_schema.dump(matched_artists)
#             for artist in matched_artists_dump:
#                  result_temp["Artist"] = result_temp.setdefault("Artist", []) + [artist["id"]]
            
#             result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]


#         return json.dumps(result, ensure_ascii=False)

#         # data = [row.__dict__ for row in db.session.query(User).join(user_film).join(Film).filter((user_film.c.user_id == User.id) & (user_film.c.film_id == Film.id)).all()]
#         # data = [r._asdict() for r in db.session.query(User.id, User.email, User.username).join(user_film).join(Film).filter((user_film.c.user_id == User.id) & (user_film.c.film_id == Film.id)).all()]
#         # data[1]['email']
#         # data = db.session.query(User.id.label("user_id"), User.username, Film.id.label("film_id"), Film.title).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).all()
#         # data = db.session.query(User.id.label("user_id"), User.username, Film.id.label("film_id"), Film.title).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).all()
#         # data = db.session.query(User.id.label("user_id")).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).distinct().all()
#         # data = db.session.query(User.id.label("user_id"), User.username).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).distinct("user_id").all()
#         # data = db.session.query(User.id.label("user_id")).select_from(User, Film).filter(user_film.c.user_id == User.id).filter(user_film.c.film_id == Film.id).filter(or_(*[Film.id.like(id_film) for id_film in list_film])).distinct().order_by("user_id").all()

#         # db.session.query(user_film).filter(user_film.film_id == ).all()
#         # return json.dumps(request.args.get('book_main'), ensure_ascii=False)
#         # return json.dumps(request.args.getlist('game_sub'))
#         # return json.dumps(book_sub, ensure_ascii=False)
#         # return json.dumps(request.args, ensure_ascii=False)
#         # return f"user_id={user_id}, film_main={film_main}, is_film_main={is_film_main}, film_sub={film_sub}, is_film_sub={is_film_sub}, book_main={book_main}, is_book_main={is_book_main}, book_sub={book_sub}, is_book_sub={is_book_sub}, music_main={music_main}, is_music_main={is_music_main}, music_sub={music_sub}, is_music_sub={is_music_sub}, game_main={game_main}, is_game_main={is_game_main}, game_sub={game_sub}, is_game_sub={is_game_sub}"
#     else:
#         found_users = db.session.query(User).all()
#         User_schema = UserSchema(many=True)
#         found_users_dump = User_schema.dump(found_users)
#         result = {"FoundUsers": []}
#         for user in found_users_dump:
#             result_temp = {"User" : [], "Film": [], "Director": [], "Book" : [], "Author": [], "Game": [], "Studio": [], "Song": [], "Artist": []}
#             result_temp["User"] = user
#             result["FoundUsers"] = result.setdefault("FoundUsers", []) + [result_temp]
#         return json.dumps(result, ensure_ascii=False)

# @main.route('/add', methods = ['POST'])
# def add_user():
#     em = request.json['email']
#     psw = request.json['password']
#     un = request.json['username']
#     user = User(id=4, email=em, password=psw, username=un)
#     user_schema = UserSchema()
#     return user_schema.jsonify(user)