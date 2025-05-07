import os
from warnings import deprecated

import face_recognition as fr

# ----- DEPRECATED ----- #
# The solution with the local file system is not the best.
# The times with about 90 users are already taking a long time.


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def face_recognizer(photo_url):
    photo = fr.load_image_file(photo_url)
    face = fr.face_encodings(photo)
    if len(face) > 0:
        return True, face

    return False, None


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def prepare_faces():
    known_faces = []
    faces_names = []
    images = []

    for image in os.listdir('./pessoas/img'):
        if image.endswith('.png'):
            recognized, face = face_recognizer(
                './pessoas/img/' + image)
            if not recognized:
                continue
            if len(face) == 0:
                continue
            known_faces.append(face[0])
            faces_names.append(image.split('.')[0])
            with open('./pessoas/img/' + image, 'rb') as f:
                images.append(f.read())

    return known_faces, faces_names, images


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def recognize(image: str) -> tuple[str, str | None]:
    """
    Recognize a face in an image.
    :param image: The image of the user
    :return: The name of the user and the image of the user
    """
    id = 'temp_image'
    save_photo(id, image)
    unknown = face_recognizer(
        './pessoas/tmp/temp_image.png')
    if unknown[0]:
        unknown_face = unknown[1][0]
        known_faces, known_names, images = prepare_faces()
        os.remove('./pessoas/tmp/temp_image.png')
        if len(known_faces) == 0:
            return 'Nenhum usuário cadastrado.', None
        face_distances = fr.face_distance(known_faces, unknown_face)
        index = face_distances.argmin()
        if face_distances[index] < 0.50:
            return known_names[index], images[index]
        else:
            return 'Usuário não cadastrado.', None
    return 'Rosto não identificado, tente novamente.', None


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def save_photo(id: int, image: str) -> None:
    """
    Save the photo to the database.
    :param id: The unique identifier for the user
    :param image: The image of the user
    :return: None
    """
    if not os.path.exists('./pessoas/img'):
        os.makedirs('./pessoas/img')
    if not os.path.exists('./pessoas/tmp'):
        os.makedirs('./pessoas/tmp')

    if id == 'temp_image':
        path = './pessoas/tmp/' + str(id) + '.png'
    else:
        path = './pessoas/img/' + str(id) + '.png'
    with open(path, 'wb') as f:
        f.write(image)


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def get_photo(id: int) -> str:
    """
    Get the photo from the database.
    :param id: The unique identifier for the user
    :return: The image of the user
    """
    with open('./pessoas/img/' + str(id) + '.png', 'rb') as f:
        return f.read()


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def delete_photo(id: int) -> None:
    """
    Delete the photo from the database.
    :param id: The unique identifier for the user
    :return: None
    """
    if not os.path.exists('./pessoas/img/' + str(id) + '.png'):
        return None
    os.remove('./pessoas/img/' + str(id) + '.png')
    return None


@deprecated(reason="This function is deprecated and will be removed in future versions.")
def update_photo(id: int, image: str) -> None:
    """
    Update the photo in the database.
    :param id: The unique identifier for the user
    :param image: The image of the user
    :return: None
    """
    delete_photo(id)
    save_photo(id, image)
    return None
