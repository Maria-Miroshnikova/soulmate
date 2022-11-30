import os
from enum import Enum, unique
from flask_bcrypt import check_password_hash, generate_password_hash
from flask_login import UserMixin
from app import db, login_manager, bcrypt, ma
from datetime import datetime
from marshmallow_enum import EnumField

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@unique
class Gender(str, Enum):
    male = 'male'
    female = 'female'

class StatusRequests(Enum):
    outgoing = 0
    friends = 1
    incoming = 2

requests = db.Table('requests',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id')),
    # db.Column('status', db.Enum(StatusRequests))
)

browsingHistory = db.Table('browsingHistory',
    db.Column('viewer_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
    db.Column('viewed_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
    db.Column('timedate', db.Date, default=datetime.utcnow)
)

user_book = db.Table('user_book',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500))
)

book_tag = db.Table('book_tag',
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_book_tag.id'), nullable=False)
)

user_film = db.Table('user_film',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
    db.Column('film_id', db.Integer, db.ForeignKey('film.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500))
)

film_tag = db.Table('film_tag',
    db.Column('film_id', db.Integer, db.ForeignKey('film.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_film_tag.id'), nullable=False)
)

user_game = db.Table('user_game',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
    db.Column('game_id', db.Integer, db.ForeignKey('game.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500))
)

game_tag = db.Table('game_tag',
    db.Column('game_id', db.Integer, db.ForeignKey('game.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_game_tag.id'), nullable=False)
)

user_song = db.Table('user_song',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), nullable=False),
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), nullable=False),
    db.Column('rating', db.Integer),
    db.Column('review', db.String(500))
)

song_tag = db.Table('song_tag',
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('name_song_tag.id'), nullable=False)
)

class User(db.Model, UserMixin):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # login = db.Column(db.String(100), unique=True, nullable = False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable = False)
    username = db.Column(db.String(100))
    date_joined = db.Column(db.Date, default=datetime.utcnow)
    age = db.Column(db.Integer)
    birthday = db.Column(db.Date)
    # avatar = db.Column(db.Binary())
    telegram = db.Column(db.String(50))
    gender = db.Column(db.Enum(Gender))
    followed = db.relationship('User', secondary=requests,
                                        primaryjoin = (requests.c.follower_id == id),
                                        secondaryjoin=(requests.c.followed_id == id),
                                        backref='followers')
    viewed = db.relationship('User', secondary=browsingHistory,
                                        primaryjoin = (browsingHistory.c.viewer_id == id),
                                        secondaryjoin=(browsingHistory.c.viewed_id == id),
                                        backref='viewers')
    books = db.relationship('Book', secondary=user_book, backref='readers')
    films = db.relationship('Film', secondary=user_film, backref='viewers')
    games = db.relationship('Game', secondary=user_game, backref='gamers')
    songs = db.relationship('Song', secondary=user_song, backref='listeners')

    def getId(self):
        return self.id

    def getName(self):
        return self.username if self.email else "Без имени"

    def getEmail(self):
        return self.email if self.email else "Без email"

    def set_password(self, password, hashed_password):
        self.hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def __repr__(self):
        return f'User({self.username}, {self.email}, {self.password}'

class UserSchema(ma.SQLAlchemySchema):
    gender = EnumField(Gender, by_value=True)
    
    class Meta:
        fields = ("id", "email", "username", "date_joined", "gender")

class Book(db.Model):
    __tablename__ = "book"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'))
    tags = db.relationship('Name_book_tag', secondary=book_tag, backref='books')

    def __repr__(self):
        return f'<Book_id: {self.id}, name: {self.title}>'

class BookSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ("id", "title")

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
    class Meta:
        fields = ("id", "title")  

class Film(db.Model):
    __tablename__ = "film"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    director_id = db.Column(db.Integer, db.ForeignKey('director.id'))
    tags = db.relationship('Name_film_tag', secondary=film_tag, backref='films')

    def __repr__(self):
        return f'<Film_id: {self.id}, name: {self.title}>'

class FilmSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ("id", "title")

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
    class Meta:
        fields = ("id", "title")   

class Game(db.Model):
    __tablename__ = "game"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    studio_id = db.Column(db.Integer, db.ForeignKey('studio.id'))
    tags = db.relationship('Name_game_tag', secondary=game_tag, backref='games')

    def __repr__(self):
        return f'<Game_id: {self.id}, name: {self.title}>'

class GameSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ("id", "title")

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
    class Meta:
        fields = ("id", "title")    

class Song(db.Model):
    __tablename__ = "song"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.id'))
    tags = db.relationship('Name_song_tag', secondary=song_tag, backref='songs')

    def __repr__(self):
        return f'<Song_id: {self.id}, name: {self.title}>'

class SongSchema(ma.SQLAlchemySchema):
    
    class Meta:
        fields = ("id", "title")

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
    class Meta:
        fields = ("id", "title")    