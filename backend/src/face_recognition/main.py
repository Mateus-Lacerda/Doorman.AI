from engine import get_face_from_webcam, register_new_user


def main():
    choice = input(
        'Escolha uma das opções:\n1-Registrar novo usuário.\n2-Reconhecer usuário.\n').strip()[0]
    if choice == '1':
        register_new_user()
    if choice == '2':
        name = get_face_from_webcam()
        print(name)


if __name__ == '__main__':
    main()
