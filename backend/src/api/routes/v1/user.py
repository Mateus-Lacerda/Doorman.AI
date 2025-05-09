from typing import Optional

from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, Field

from src.api.utils import get_db_pool


class User(BaseModel):
    id: int = Field(..., description="The unique identifier for the user")
    email: Optional[str] = Field(...,
                                 description="The email address of the user")
    apartment: str = Field(..., description="The apartment number of the user")
    name: str = Field(..., description="The name of the user")
    phone: str = Field(..., description="The phone number of the user")


class NewUser(BaseModel):
    email: Optional[str] = Field(..., description="The email address of the user")
    apartment: str = Field(..., description="The apartment number of the user")
    name: str = Field(..., description="The name of the user")
    phone: str = Field(..., description="The phone number of the user")


class UserSearch(BaseModel):
    email: Optional[str] = Field(
        None, description="The email address of the user")
    apartment: Optional[str] = Field(
        None, description="The apartment number of the user")
    name: Optional[str] = Field(None, description="The name of the user")
    phone: Optional[str] = Field(
        None, description="The phone number of the user")


user_router = APIRouter(prefix="/user", tags=["user"])


@user_router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """
    Get user information.
    """
    # Connect to the database
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Execute the query to get user information
            await cursor.execute("SELECT id, email, apartment, name, phone FROM users WHERE id = %s", (user_id,))
            result = await cursor.fetchone()

    pool.close()
    await pool.wait_closed()

    if result:
        return User(
            id=result[0],
            email=result[1],
            apartment=result[2],
            name=result[3],
            phone=result[4]
        )
    else:
        raise HTTPException(status_code=404, detail="User not found")


@user_router.post("/", response_model=User)
async def create_user(user: NewUser):
    """
    Create a new user.
    """
    # Connect to the database
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Execute the query to insert a new user
            await cursor.execute(
                "INSERT INTO users (email, apartment, name, phone) VALUES (%s, %s, %s, %s)",
                (user.email, user.apartment, user.name, user.phone)
            )
            await conn.commit()
            user_id = cursor.lastrowid  # Get the ID of the newly created user

    pool.close()
    await pool.wait_closed()

    return User(
        id=user_id,
        email=user.email,
        apartment=user.apartment,
        name=user.name,
        phone=user.phone
    )


@user_router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user: NewUser):
    """
    Update user information.
    """
    # Connect to the database
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Execute the query to update user information
            await cursor.execute(
                "UPDATE users SET email = %s, apartment = %s, name = %s, phone = %s WHERE id = %s",
                (user.email, user.apartment, user.name, user.phone, user_id)
            )
            await conn.commit()
            # Check if the user was updated
            if cursor.rowcount == 0:
                return None
    pool.close()
    await pool.wait_closed()

    return User(
        id=user_id,
        email=user.email,
        apartment=user.apartment,
        name=user.name,
        phone=user.phone
    )


@user_router.delete("/{user_id}")
async def delete_user(user_id: int):
    """
    Delete a user.
    """
    # Connect to the database
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Execute the query to delete a user
            await cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            await conn.commit()
            # Check if the user was deleted
            if cursor.rowcount == 0:
                return {"message": "User not found"}

    pool.close()
    await pool.wait_closed()

    return {"message": "User deleted successfully"}


@user_router.post("/search", response_model=list[User])
async def search_users(search: UserSearch):
    """
    Search for users by email or apartment.
    """
    # Connect to the database
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor() as cursor:
            # Build the query based on the provided parameters
            query = "SELECT id, email, apartment, name, phone FROM users WHERE 1=1"
            params = []
            if search.email:
                email = search.email
                query += " AND email LIKE %s"
                params.append(f"%{email}%")
            if search.apartment:
                apartment = search.apartment
                query += " AND apartment LIKE %s"
                params.append(f"%{apartment}%")
            if search.name:
                name = search.name
                query += " AND name LIKE %s"
                params.append(f"%{name}%")
            if search.phone:
                phone = search.phone
                query += " AND phone LIKE %s"
                params.append(f"%{phone}%")

            # Execute the query to search for users
            await cursor.execute(query, tuple(params))
            results = await cursor.fetchall()

    pool.close()
    await pool.wait_closed()
    # Map the results to User objects
    if not results:
        return []

    return [
        User(
            id=result[0],
            email=result[1],
            apartment=result[2],
            name=result[3],
            phone=result[4]
        )
        for result in results
    ]
