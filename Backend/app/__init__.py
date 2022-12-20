from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()
ma = Marshmallow()
login_manager = LoginManager()
jwt_manager = JWTManager()
cors_manager = CORS()
oauth_manager = OAuth()
login_manager.login_view ='user.login'
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
    jwt_manager.init_app(app)
    cors_manager.init_app(app, resources={r'/api/*': {'origins': 'http://localhost:3000'}})
    oauth_manager.init_app(app)
    #blueprint main
    from app.main.routes import main
    app.register_blueprint(main)

    from app.user.routes import user
    app.register_blueprint(user)

    from app.analysis.routes import analysis
    app.register_blueprint(analysis)

    oauth_manager.register(
        name='yandex',
        client_id='cf71e92f836643c7853acddfc611dc0c',
        client_secret='30bac913adce4a699dc5ccc5e83c6df6',
        access_token_url='https://oauth.yandex.ru/token',
        access_token_params=None,
        authorize_url='https://oauth.yandex.ru/authorize',
        authorize_params=None,
        api_base_url='https://login.yandex.ru/',
        client_kwargs={'scope': 'login:email login:info login:avatar'},
    )

    oauth_manager.register(
        name='google',
        client_id='412497185293-cg2cvbl5ouhmep75l4mlqd3kl9n9gtk2.apps.googleusercontent.com',
        client_secret='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',
        access_token_url='https://accounts.google.com/o/oauth2/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params=None,
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        client_kwargs={'scope': 'email profile'},
    )

    oauth_manager.register(
        name='github',
        client_id='e5bb4db764f3a1a9f6b9',
        client_secret='e1b17caadd8396a9a8a84af3537a5f08144244cd',
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'},
    )

    # with app.app_context():
    #     db.create_all()

    return app
