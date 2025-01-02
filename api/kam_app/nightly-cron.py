import sqlalchemy
from sqlalchemy.sql import text
from sqlalchemy.engine import create_engine

class PostgresqlDB:
    def __init__(self):
        self.username = 'postgres.kaupwhsakwbxrztaguya'
        self.password = 'HUDgxKWszahJn6V8'
        self.host = 'aws-0-ap-south-1.pooler.supabase.com'
        self.port = 6543
        self.db_name = 'postgres'
        self.engine = self.get_db_engine()

    def get_db_engine(self):
        try:
            db_uri = f'postgresql+psycopg2://{self.username}:{self.password}@{self.host}:{self.port}/{self.db_name}'
            return create_engine(db_uri)
        except Exception as e:
            print("Error connecting to the database")
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

if __name__=='__main__':
    db_instance = PostgresqlDB()
    db_instance.execute_ddl_and_dml_commands(text("call update_lead_status_nightly()"))
