// src/hooks/useFaceWorker.ts
import { useEffect, useRef, useCallback } from 'react';

type WorkerMessage =
    | { type: 'MODELS_LOADED' }
    | { type: 'DETECTION_RESULT'; matched: boolean; distance: number | null }
    | { type: 'ERROR'; message: string };

type UseFaceWorkerOptions = {
    onModelsLoaded: () => void;
    onDetectionResult: (matched: boolean, distance: number | null) => void;
    onError: (message: string) => void;
};

export function useFaceWorker({ onModelsLoaded, onDetectionResult, onError }: UseFaceWorkerOptions) {
    const workerRef = useRef<Worker | null>(null);

    // Use stable refs for callbacks to avoid recreating the worker on every render
    const onModelsLoadedRef = useRef(onModelsLoaded);
    const onDetectionRef = useRef(onDetectionResult);
    const onErrorRef = useRef(onError);

    useEffect(() => { onModelsLoadedRef.current = onModelsLoaded; }, [onModelsLoaded]);
    useEffect(() => { onDetectionRef.current = onDetectionResult; }, [onDetectionResult]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);

    // Initialize worker once
    useEffect(() => {
        const worker = new Worker('/faceWorker.js');
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
            const msg = e.data;
            if (msg.type === 'MODELS_LOADED') onModelsLoadedRef.current();
            if (msg.type === 'DETECTION_RESULT') onDetectionRef.current(msg.matched, msg.distance);
            if (msg.type === 'ERROR') onErrorRef.current(msg.message);
        };

        worker.onerror = (err) => {
            onErrorRef.current(err.message || 'Worker error');
        };

        // Kick off model loading immediately
        worker.postMessage({ type: 'LOAD_MODELS' });

        return () => {
            worker.terminate();
            workerRef.current = null;
        };
    }, []);

    const detectFace = useCallback(async (
        video: HTMLVideoElement,
        descriptor: number[]
    ) => {
        const worker = workerRef.current;
        if (!worker || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        const bitmap = await createImageBitmap(video);

        worker.postMessage(
            { type: 'DETECT_FACE', imageBitmap: bitmap, descriptor },
            [bitmap]
        );
    }, []);

    return { detectFace };
}