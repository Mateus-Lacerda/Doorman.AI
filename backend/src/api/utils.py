from aiomysql import create_pool, Pool

from src.config import get_config


async def get_db_pool() -> Pool:
    """
    Create a connection pool to the database.
    """
    pool = await create_pool(
        host=get_config().db.host,
        port=get_config().db.port,
        user=get_config().db.user,
        password=get_config().db.password,
        db=get_config().db.database,
        autocommit=True
    )
    return pool
