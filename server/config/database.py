import MySQLdb
from flask import current_app, g

def init_db(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''
    app.config['MYSQL_DB'] = 'flaskapp'

    @app.before_request
    def before_request():
        if 'db' not in g:
            try:
                g.db = MySQLdb.connect(
                    host=current_app.config['MYSQL_HOST'],
                    user=current_app.config['MYSQL_USER'],
                    passwd=current_app.config['MYSQL_PASSWORD'],
                    db=current_app.config['MYSQL_DB']
                )
                print("Database connection established")
            except MySQLdb.Error as e:
                print(f"Error connecting to MySQL: {e}")
        else:
            print("Database connection already established in this request")

    @app.teardown_appcontext
    def teardown_db(exception):
        db = g.pop('db', None)
        if db is not None:
            db.close()
            print("Database connection closed")
        else:
            print("No database connection to close")