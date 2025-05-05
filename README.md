# AI Doorman

AI Doorman is a facial recognition-based system designed to manage user authentication and identification. This project was developed as part of the Computer Vision course in the Artificial Intelligence Bachelor's program at the Federal University of Goiás (UFG).

## Overview

The system leverages facial recognition technology to identify users and manage their data. It consists of a backend API built with FastAPI and a frontend interface. The backend integrates with a MySQL database for user data storage and uses the `face_recognition` library for facial recognition tasks.

## Features

- **User Management**: Create, update, delete, and search for users.
- **Facial Recognition**: Identify users based on their facial features.
- **Image Management**: Upload, retrieve, update, and delete user images.
- **RESTful API**: Exposes endpoints for seamless integration with other systems.
- **Frontend Interface**: User-friendly interface for interacting with the system.

## Installation

### Prerequisites

- Python 3.11+
- MySQL
- Node.js

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Mateus-Lacerda/Doorman.AI.git
   cd Doorman.AI/backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Configure the database in `src/config.py`.

    3.1 Run the database container:
    ```bash
    docker run --network="host" --name some-mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:latest
    ```

4. Run the application:
   ```bash
    export PYTHONPATH=./
    python -m src.api.app
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Serve the app:
    ```bash
    npm run dev
    ```

## API Endpoints

### User Management

- `GET /user/{user_id}`: Retrieve user details.
- `POST /user`: Create a new user.
- `PUT /user/{user_id}`: Update user details.
- `DELETE /user/{user_id}`: Delete a user.
- `GET /user/search`: Search for users.

### Picture Management

- `POST /picture`: Upload a user image.
- `POST /picture/recognize`: Recognize a user from an image.
- `GET /picture/{user_id}`: Retrieve a user image.
- `DELETE /picture/{user_id}`: Delete a user image.
- `PUT /picture/{user_id}`: Update a user image.

## Technologies Used

- **Backend**: FastAPI, MySQL, `face_recognition` library
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MySQL

## How It Works

1. **User Registration**: Users are registered with their details and a facial image.
2. **Facial Recognition**: The system encodes facial features and stores them for future comparisons.
3. **Authentication**: When a new image is provided, the system compares it with stored encodings to identify the user.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

This project was developed as part of the Computer Vision course in the Artificial Intelligence Bachelor's program at UFG. Special thanks to the course instructors and colleagues for their support and guidance.
