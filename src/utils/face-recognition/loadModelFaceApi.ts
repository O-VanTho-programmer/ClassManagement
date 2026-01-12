import * as faceapi from 'face-api.js';
export async function loadModelFaceApi() {
    const MODEL_URL = '/models';

    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        console.log("Face API models đã tải xong!");
        return true;
    } catch (error) {
        console.error("Lỗi khi tải Face API models:", error);
        return false;
    }
}

// Centralized tiny detector options so all features use the same config.
// Adjust inputSize/scoreThreshold here to tweak speed vs accuracy trade-offs.
export const tinyFaceDetectorOptions = () => new faceapi.TinyFaceDetectorOptions({
    inputSize: 320, // larger = better accuracy, smaller = faster
    scoreThreshold: 0.5,
});