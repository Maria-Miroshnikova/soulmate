from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()
ma = Marshmallow()
login_manager = LoginManager()
login_manager.login_view ='main.login'
login_manager.login_message = "Авторизуйтесь для доступа к закрытым страницам"
login_manager.login_message_category = 'danger'

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('main/settings.py')
    app.permanent_session_lifetime = datetime.timedelta(days=30)
    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    login_manager.init_app(app)

    #blueprint main
    from app.main.routes import main
    app.register_blueprint(main)

    return app
