importScripts('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js');

const MODEL_URL = '/models';
let modelsLoaded = false;

async function loadModels() {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
}

self.onmessage = async (event) => {
    const { type, imageBitmap, descriptor } = event.data;

    if (type === 'LOAD_MODELS') {
        try {
            await loadModels();
            self.postMessage({ type: 'MODELS_LOADED' });
        } catch (err) {
            self.postMessage({ type: 'ERROR', message: err.message });
        }
        return;
    }

    if (type === 'DETECT_FACE') {
        if (!modelsLoaded) {
            self.postMessage({ type: 'ERROR', message: 'Models not loaded yet' });
            return;
        }

        try {
            const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageBitmap, 0, 0);

            const detections = await faceapi
                .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length === 0) {
                self.postMessage({ type: 'DETECTION_RESULT', matched: false, distance: null });
                return;
            }

            const detectedDescriptor = detections[0].descriptor;
            const storedDescriptor   = new Float32Array(descriptor);
            const distance           = faceapi.euclideanDistance(detectedDescriptor, storedDescriptor);

            self.postMessage({
                type: 'DETECTION_RESULT',
                matched:  distance < 0.5,
                distance: distance,
            });

            imageBitmap.close();

        } catch (err) {
            self.postMessage({ type: 'ERROR', message: err.message });
        }
        return;
    }
};
