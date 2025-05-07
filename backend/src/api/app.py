import logging

from pymysql import connect
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.v1 import api_v1_router
from src.config import get_config

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)


def create_database():
    """
    Create the database if it does not exist.
    """
    config = get_config()
    conn = connect(
        host=config.db.host,
        port=config.db.port,
        user=config.db.user,
        password=config.db.password,
        autocommit=True,
    )
    with conn:
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {config.db.database}")
            logger.info("Database created successfully")


def create_tables():
    """
    Create the tables in the database.
    """
    create_database()
    users_table = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        apartment VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
    config = get_config()
    conn = connect(
        host=config.db.host,
        port=config.db.port,
        user=config.db.user,
        password=config.db.password,
        db=config.db.database,
        autocommit=True,
    )
    with conn:
        with conn.cursor() as cursor:
            cursor.execute(users_table)
            logger.info("Users table created successfully")


def create_app() -> FastAPI:
    # TODO: Use correct version
    app = FastAPI(
        title="AI Doorman", description="AI Doorman API", version="0.1.0"
    )

    app.include_router(api_v1_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Create tables
    create_tables()

    logger.info("FastAPI app created")

    return app


if __name__ == "__main__":
    import uvicorn

    app = create_app()
    uvicorn.run(app, host="0.0.0.0", port=8042, log_level="info")
