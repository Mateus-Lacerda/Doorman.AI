from base64 import b64decode, b64encode
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.face_recognition.engine import (
    save_photo,
    get_photo,
    delete_photo,
    update_photo,
    recognize,
)


def decode_image(image: str) -> bytes:
    """
    Decode the base64 image to bytes.
    :param image: The base64 image
    :return: The decoded image
    """
    if image.startswith("data:image/png;base64,"):
        image = image.replace("data:image/png;base64,", "")
    return b64decode(image)


def encode_image(image: bytes) -> str:
    """
    Encode the image to base64.
    :param image: The image
    :return: The encoded image
    """
    res = b64encode(image).decode('utf-8')
    return f"data:image/png;base64,{res}"


class Image(BaseModel):
    image: str = Field(..., description="The image of the user")


class Picture(BaseModel):
    user_id: int = Field(..., description="The unique identifier for the user")
    image: str = Field(..., description="The image of the user")


class PictureResponse(BaseModel):
    message: str = Field(..., description="The message of the response")
    image: Optional[str] = Field(..., description="The image of the user")
    user_id: Optional[int] = Field(..., description="The unique identifier for the user")
    success: bool = Field(True, description="The success of the operation")


picture_router = APIRouter(prefix="/picture", tags=["picture"])


@picture_router.post("/", response_model=PictureResponse)
async def post_picture(picture: Picture):
    """
    Save the photo to the database.
    """
    image = decode_image(picture.image)
    save_photo(picture.user_id, image)
    name, image = get_photo(picture.user_id)
    image = encode_image(image)
    if image is not None:
        return PictureResponse(
            message=name,
            image=image,
            user_id=picture.user_id,
            success=True
        )
    else:
        return PictureResponse(
            message=name,
            image=None,
            user_id=picture.user_id,
            success=False
        )


@picture_router.post("/recognize", response_model=PictureResponse)
async def post_recognize_picture(picture: Image):
    """
    Recognize the photo from the database.
    """
    image = decode_image(picture.image)
    name, image = recognize(image)
    if image is not None:
        image = encode_image(image)
        return PictureResponse(
            message="Image recognized successfully",
            image=image,
            user_id=name,
            success=True
        )
    else:
        return PictureResponse(
            message=name,
            image=None,
            user_id=None,
            success=False
        )


@picture_router.get("/{user_id}", response_model=PictureResponse)
async def get_picture(user_id: int):
    """
    Get the photo from the database.
    """
    image = get_photo(user_id)
    if image is not None:
        image = b64decode(image)
        return PictureResponse(
            message="Image retrieved successfully",
            image=image,
            user_id=user_id,
            success=True
        )
    else:
        return PictureResponse(
            message="Image not found",
            image=None,
            user_id=user_id,
            success=False
        )


@picture_router.delete("/{user_id}", response_model=PictureResponse)
async def delete_picture(user_id: int):
    """
    Delete the photo from the database.
    """
    delete_photo(user_id)
    return PictureResponse(
        message="Image deleted successfully",
        image=None,
        user_id=user_id,
        success=True
    )


@picture_router.put("/{user_id}", response_model=PictureResponse)
async def update_picture(user_id: int, image: Image):
    """
    Update the photo in the database.
    """
    image = decode_image(image.image)
    update_photo(user_id, image)
    return PictureResponse(
        message="Image updated successfully",
        image=encode_image(image),
        user_id=user_id,
        success=True
    )
