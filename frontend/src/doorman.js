import './style.css'
import { userHook } from './hooks/user_hook.js'
import { pictureHook } from './hooks/picture_hook.js'
import { displayError, renderUserData } from './util.js'

const handleResponse = (data) => {
    // Handle the response from the server
    if (data.success) {
        console.log('Picture recognized successfully');
        const userId = data.user_id;
        const foundImage = data.image;
        // Send the user ID to the server
        userHook.getUserData(userId).then(data => {
            // Handle the response from the server
            if (data.id) {
                console.log('User recognized successfully');
                const name = data.name;
                const email = data.email;
                const phone = data.phone;
                const apartment = data.apartment;
                // Render the received data and the image
                const container = document.querySelector('#app');
                console.log('Found Image:', foundImage);
                renderUserData(document, {
                    id: userId,
                    name: name,
                    email: email,
                    phone: phone,
                    apartment: apartment,
                    image: foundImage
                }, 'app');
                // wait 5 seconds and go back to the main screen
                setTimeout(() => {
                    showCamera(document);
                }, 5000);
            } else {
                console.error('Error recognizing user:', data.message);
            }
        }).catch(error => {
            console.error('Error:', error);
        });

    } else {
        console.error('Error recognizing picture:', data.message);
        displayError(document, data.message, 'app');
    }
}

const showCamera = (document) => {
    document.querySelector('#app').innerHTML = `
        <h1>CV Doorman</h1>
        <button id="back-button">Home</button>
        <br><br>
        <video id="video" width="640" height="480" autoplay></video>
        <h2>Please look at the camera!</h2>
        <button id="startButton">Take Photo</button>
        <canvas id="canvas" width="640" height="480" style="display:none;"></canvas>
    `;
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    const video = document.getElementById('video');
    const startButton = document.getElementById('startButton');
    const canvas = document.getElementById('canvas');
    const constraints = {
        video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };

    // Get access to the camera!
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            // Attach the video stream to the video element
            video.srcObject = stream;
        })
        .catch(function(err) {
            console.error("Error accessing camera: ", err);
        });

    // Trigger photo take
    startButton.addEventListener('click', function() {
        // Draw the video frame to the canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Get the image data from the canvas
        const data = canvas.toDataURL('image/png');
    });

    // Save the image to the server
    startButton.addEventListener('click', function() {
        // Get the image data from the canvas
        const data = canvas.toDataURL('image/png');
        // Send the image data to the server
        const response = pictureHook.recognize({
            image: data,
        });
        response.then(data => {
            handleResponse(data);
        }).catch(error => {
            console.error('Error:', error);
        });
    });
}

// Initialize the app
showCamera(document);
