import sqlalchemy
from sqlalchemy.sql import text
from sqlalchemy.engine import create_engine
import os

class PostgresqlDB:
    def __init__(self):
        self.username = os.environ['db_username']
        self.password = os.environ['db_password']
        self.host = os.environ['db_host']
        self.port = os.environ['db_port']
        self.db_name = os.environ['db_name']
        self.engine = self.get_db_engine()

    def get_db_engine(self):
        try:
            db_uri = f'postgresql+psycopg2://{self.username}:{self.password}@{self.host}:{self.port}/{self.db_name}'
            return create_engine(db_uri)
        except Exception as e:
            print("Error connecting to the database")
            raise e
    
    def execute_dql_commands(self, statement, values = None):
        try:
            with self.engine.connect() as conn:
                if values is not None:
                    result = conn.execute(statement, values)
                else:
                    result = conn.execute(statement)
            return result
        except Exception as e:
            raise e
    
    def execute_ddl_and_dml_commands(self, statement, values=None):
        connection = self.engine.connect()
        trans = connection.begin()

        try:
            if values is not None:
                connection.execute(statement, values)
            else:
                connection.execute(statement)
            trans.commit()
            connection.close()        
        except Exception as e:
            connection.rollback()
            connection.close()
