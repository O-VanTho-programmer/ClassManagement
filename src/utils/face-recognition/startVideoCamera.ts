import { RefObject } from 'react';

export const startVideo = (videoRef: RefObject<HTMLVideoElement | null>): Promise<MediaStream | null> => {
    return new Promise((resolve, reject) => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: {} })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        resolve(stream);
                    } else {
                        stream.getTracks().forEach(track => track.stop());
                        reject(new Error("Video element not available"));
                    }
                })
                .catch((err) => {
                    console.log("Camera access denied or unavailable.", err);
                    reject(err);
                });
        } else {
            reject(new Error("getUserMedia not supported"));
        }
    });
};