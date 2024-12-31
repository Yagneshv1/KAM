import sqlalchemy
from sqlalchemy.sql import text
from sqlalchemy.engine import create_engine

class PostgresqlDB:
    def __init__(self):
        self.username = 'postgres'
        self.password = 'XrhVUb2q$'
        self.host = 'udaan-kam.cxms2842cvb4.eu-north-1.rds.amazonaws.com'
        self.port = 5432
        self.db_name = 'udaan-kam'
        self.engine = self.get_db_engine()

    def get_db_engine(self):
        try:
            db_uri = f'postgresql+psycopg2://{self.username}:{self.password}@{self.host}:{self.port}/{self.db_name}'
            return create_engine(db_uri)
        except Exception as e:
            print("Error connecting to the database")
            raise e
    
    def execute_ddl_and_dml_commands(self, statement, values):
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
