// 1. Mock the browser environment in the Worker
const mock = () => {
    const window = self;
    const document = {
        createElement: (name) => {
            const n = name.toLowerCase();
            if (n === 'canvas') return new OffscreenCanvas(640, 480);
            if (n === 'img') return new self.HTMLImageElement();
            return { style: {} };
        },
        querySelectorAll: () => [],
        getElementById: () => null,
        getElementsByTagName: () => []
    };

    self.window = window;
    self.document = document;
    self.navigator = { userAgent: 'Worker' };
    self.HTMLImageElement = class HTMLImageElement {};
    self.HTMLCanvasElement = class HTMLCanvasElement {};
    self.HTMLVideoElement = class HTMLVideoElement {};
    // ImageData is usually already in the worker global scope
};

mock();

// 2. Load face-api.js (vladmandic version)
importScripts('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js');

// 3. Monkey patch the environment for the library
if (typeof faceapi !== 'undefined') {
    faceapi.env.monkeyPatch({
        Canvas: OffscreenCanvas,
        createCanvasElement: (w, h) => new OffscreenCanvas(w || 1, h || 1),
        createImageElement: () => new self.HTMLImageElement()
    });
}


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
            self.postMessage({ type: 'ERROR', message: `LoadModels Error: ${err.message}` });
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
            } else {
                const detectedDescriptor = detections[0].descriptor;
                const storedDescriptor = new Float32Array(descriptor);
                const distance = faceapi.euclideanDistance(detectedDescriptor, storedDescriptor);

                self.postMessage({
                    type: 'DETECTION_RESULT',
                    matched: distance < 0.5,
                    distance: distance,
                });
            }
        } catch (err) {
            self.postMessage({ type: 'ERROR', message: `Detection Error: ${err.message}` });
        } finally {
            if (imageBitmap && typeof imageBitmap.close === 'function') {
                imageBitmap.close();
            }
        }
        return;
    }
};
