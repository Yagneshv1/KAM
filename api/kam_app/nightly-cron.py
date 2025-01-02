import sqlalchemy
from sqlalchemy.sql import text
from .database import PostgresqlDB

if __name__=='__main__':
    db_instance = PostgresqlDB()
    db_instance.execute_ddl_and_dml_commands(text("call update_lead_status_nightly()"))
