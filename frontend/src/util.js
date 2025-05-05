export const captureCameraImage = (document, containerId = 'app') => {
    return new Promise((resolve, reject) => {
        // Renderizar a interface no contêiner especificado
        const container = document.querySelector(`#${containerId}`);
        if (!container) {
            reject(new Error(`Container with ID ${containerId} not found`));
            return;
        }

        container.innerHTML = `
            <h1>CV Doorman</h1>
            <div id="camera-input">
                <video id="video" width="640" height="480" autoplay></video>
                <button id="startButton">Take Photo</button>
                <canvas id="canvas" width="640" height="480"></canvas>
            </div>
        `;

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

        // Acessar a câmera
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((err) => {
                reject(new Error(`Error accessing camera: ${err.message}`));
            });

        // Capturar a imagem quando o botão for clicado
        startButton.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png'); // String Base64

            // Parar a stream da câmera para liberar recursos
            video.srcObject.getTracks().forEach(track => track.stop());

            // Resolver a Promise com a string Base64
            resolve(dataUrl);
        });
    });
};
