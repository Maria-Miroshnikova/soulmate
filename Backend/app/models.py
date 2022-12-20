import os
from enum import Enum, unique
from flask_bcrypt import check_password_hash, generate_password_hash
from flask_login import UserMixin
from app import db, login_manager, bcrypt, ma
from datetime import datetime, timedelta
from marshmallow_enum import EnumField
from marshmallow import Schema, fields
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import flash

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@unique
class Gender(str, Enum):
    male = 'male'
    female = 'female'

class StatusRequests(Enum):
    follower = 'follower'
    friends = 'friends'

users_requests = db.Table('users_requests',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE')),
    db.Column('type', db.Enum(StatusRequests))
)

browsingHistory = db.Table('browsingHistory',
    db.Column('viewer_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('viewed_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('timedate', db.Date, default=datetime.now())
)

user_book = db.Table('user_book',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

user_author = db.Table('user_author',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('author_id', db.Integer, db.ForeignKey('author.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

book_tag = db.Table('book_tag',
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_book_tag.id'), nullable=False)
)

user_film = db.Table('user_film',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('film_id', db.Integer, db.ForeignKey('film.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

user_director = db.Table('user_director',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('director_id', db.Integer, db.ForeignKey('director.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

film_tag = db.Table('film_tag',
    db.Column('film_id', db.Integer, db.ForeignKey('film.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_film_tag.id'), nullable=False)
)

user_game = db.Table('user_game',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('game_id', db.Integer, db.ForeignKey('game.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

user_studio = db.Table('user_studio',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('studio_id', db.Integer, db.ForeignKey('studio.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

game_tag = db.Table('game_tag',
    db.Column('game_id', db.Integer, db.ForeignKey('game.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_game_tag.id'), nullable=False)
)

user_song = db.Table('user_song',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

user_artist = db.Table('user_artist',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False),
    db.Column('artist_id', db.Integer, db.ForeignKey('artist.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500)),
    db.Column('verified', db.Boolean)
)

song_tag = db.Table('song_tag',
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_song_tag.id'), nullable=False)
)

# class User(db.Model, UserMixin):
class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # login = db.Column(db.String(100), unique=True, nullable = False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100))
    username = db.Column(db.String(100))
    date_joined = db.Column(db.Date, default=datetime.utcnow)
    age = db.Column(db.Integer)
    birthday = db.Column(db.Date)
    # avatar = db.Column(db.Binary())
    telegram = db.Column(db.String(50))
    gender = db.Column(db.Enum(Gender))
    is_moder = db.Column(db.Boolean)
    refresh_token = db.Column(db.String(500))
    
    followed = db.relationship('User', secondary=users_requests,
                                        primaryjoin = (users_requests.c.follower_id == id),
                                        secondaryjoin=(users_requests.c.followed_id == id),
                                        backref='followers', passive_deletes=True)
    viewed = db.relationship('User', secondary=browsingHistory,
                                        primaryjoin = (browsingHistory.c.viewer_id == id),
                                        secondaryjoin=(browsingHistory.c.viewed_id == id),
                                        backref='viewers', passive_deletes=True)
    books = db.relationship('Book', secondary=user_book, backref='readers', passive_deletes=True)
    films = db.relationship('Film', secondary=user_film, backref='viewers', passive_deletes=True)
    games = db.relationship('Game', secondary=user_game, backref='gamers', passive_deletes=True)
    songs = db.relationship('Song', secondary=user_song, backref='listeners', passive_deletes=True)

    authors = db.relationship('Author', secondary=user_author, backref='readers', passive_deletes=True)
    directors = db.relationship('Director', secondary=user_director, backref='viewers', passive_deletes=True)
    studios = db.relationship('Studio', secondary=user_studio, backref='gamers', passive_deletes=True)
    artists = db.relationship('Artist', secondary=user_artist, backref='listeners', passive_deletes=True)

    def __init__(self, **kwargs):
        self.email = kwargs.get('email')
        if kwargs.get('passoword') != None:
            self.password = bcrypt.generate_password_hash(kwargs.get('password')).decode('utf-8')
        self.username = kwargs.get('username')

    def get_access_token(self, expire_time=5):
        expire_delta = timedelta(minutes=expire_time)
        token = create_access_token(identity=self, expires_delta=expire_delta, fresh=True)
        return token

    def get_refresh_token(self, expire_time=25):
        expire_delta = timedelta(minutes=expire_time)
        token = create_refresh_token(identity=self, expires_delta=expire_delta)
        entry = db.session.query(User).filter(User.id == self.id).update({'refresh_token': token})
        print({"refresh_token": token})
        db.session.commit()
        return token
    
    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter(cls.email == email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def is_authenticated(self):
        return True

    def get_id(self):
        return self.id 

    def get_name(self):
        return self.username if self.email else "Без имени"

    def get_email(self):
        return self.email if self.email else "Без email"

    def set_password(self, password, hashed_password):
        self.hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def __repr__(self):
        return f"{{\"id\": {self.id}, \"username\": {self.username}, \"age\": {self.age}, \"gender\": {self.gender}, \"telegram\": {self.telegram}}}"

class UserSchema(ma.SQLAlchemySchema):
    id = fields.String()
    username = fields.String()
    age = fields.String()
    gender = EnumField(Gender, by_value=True)
    telegram = fields.String()
    # class Meta:
    #     fields = ("id", "username", "age", "gender", "telegram")

# class RefreshSessions(db.Model):
#     __tablename__ = "refreshSessions"

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     refreshToken = db.Column(db.String(100))
#     expiresIn = db.Column(db.Date, default=datetime.utcnow)

#     def __repr__(self):
#         return f'<Token_id: {self.id}, hash: {self.hash}>'

class Book(db.Model):
    __tablename__ = "book"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'))
    tags = db.relationship('Name_book_tag', secondary=book_tag, backref='books')

    def __repr__(self):
        return f'<Book_id: {self.id}, name: {self.title}>'

class BookSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    author_id = fields.String()
    # class Meta:
    #     fields = ("id", "title", "author_id")

class Name_book_tag(db.Model):
    __tablename__ = "name_book_tag"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))

    def __repr__(self):
        return f'<id: {self.id}, Tag_name: {self.name}>'

class Author(db.Model):
    __tablename__ = "author"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    books = db.relationship('Book', backref='author')

class AuthorSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    # class Meta:
    #     fields = ("id", "title")  

class Film(db.Model):
    __tablename__ = "film"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    director_id = db.Column(db.Integer, db.ForeignKey('director.id'))
    tags = db.relationship('Name_film_tag', secondary=film_tag, backref='films')

    def __repr__(self):
        return f'<Film_id: {self.id}, name: {self.title}>'

class FilmSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    director_id = fields.String()
    # class Meta:
    #     fields = ("id", "title", "director_id")

class Name_film_tag(db.Model):
    __tablename__ = "name_film_tag"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))

    def __repr__(self):
        return f'<id: {self.id}, Tag_name: {self.name}>'

class Director(db.Model):
    __tablename__ = "director"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    films = db.relationship('Film', backref='director')

class DirectorSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    # class Meta:
    #     fields = ("id", "title")   

class Game(db.Model):
    __tablename__ = "game"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    studio_id = db.Column(db.Integer, db.ForeignKey('studio.id'))
    tags = db.relationship('Name_game_tag', secondary=game_tag, backref='games')

    def __repr__(self):
        return f'<Game_id: {self.id}, name: {self.title}>'

class GameSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    studio_id = fields.String()
    # class Meta:
    #     fields = ("id", "title", "studio_id")

class Name_game_tag(db.Model):
    __tablename__ = "name_game_tag"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))

    def __repr__(self):
        return f'<id: {self.id}, Tag_name: {self.name}>'

class Studio(db.Model):
    __tablename__ = "studio"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    games = db.relationship('Game', backref='studio')

class StudioSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    # class Meta:
    #     fields = ("id", "title")    

class Song(db.Model):
    __tablename__ = "song"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.id'))
    tags = db.relationship('Name_song_tag', secondary=song_tag, backref='songs')

    def __repr__(self):
        return f'<Song_id: {self.id}, name: {self.title}>'

class SongSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    artist_id = fields.String()
    # class Meta:
    #     fields = ("id", "title", "artist_id")

class Name_song_tag(db.Model):
    __tablename__ = "name_song_tag"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))

    def __repr__(self):
        return f'<id: {self.id}, Tag_name: {self.name}>'

class Artist(db.Model):
    __tablename__ = "artist"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    songs = db.relationship('Song', backref='artist')

class ArtistSchema(ma.SQLAlchemySchema):
    id = fields.String()
    title = fields.String()
    # class Meta:
    #     fields = ("id", "title")    

class FoundUserSchema(ma.SQLAlchemySchema):
    # gender = EnumField(Gender, by_value=True)
    # id = fields.Integer()
    # username = fields.String()
    # age = fields.Integer()
    # telegram = fields.String()
    # book_id = fields.Integer(many=True)
    # book_title = fields.String(many=True)
    # film_id = fields.Integer(many=True)
    # film_title = fields.String(many=True)
    User = fields.Nested(UserSchema())
    Book = fields.Nested(BookSchema())
    Film = fields.Nested(FilmSchema())
    # books = fields.Nested(BookSchema, many=True)
    # films = fields.Nested(FilmSchema, many=True)