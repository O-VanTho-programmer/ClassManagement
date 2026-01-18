'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Camera, CheckCircle, XCircle } from 'lucide-react';
import { startVideo } from '@/utils/face-recognition/startVideoCamera';
import { loadModelFaceApi, tinyFaceDetectorOptions } from '@/utils/face-recognition/loadModelFaceApi';
import * as faceapi from 'face-api.js';

interface FaceRecognitionAuthProps {
  studentDescriptor: number[] | string | null;
  onAuthenticated: () => void;
}

export default function FaceRecognitionAuth({ studentDescriptor, onAuthenticated }: FaceRecognitionAuthProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [authStatus, setAuthStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
  const [errorMsg, setErrorMsg] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const init = async () => {
      const success = await loadModelFaceApi();
      setIsModelsLoaded(success);
    };
    init();
  }, []);

  useEffect(() => {
    if (isModelsLoaded && isScanning) {
      startVideo(videoRef)
        .then((stream) => {
          streamRef.current = stream;
        })
        .catch((err) => {
          setErrorMsg("Camera access denied or unavailable. Please allow camera access.");
          setIsScanning(false);
          setAuthStatus('failed');
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isModelsLoaded, isScanning]);

  useEffect(() => {
    if (!isModelsLoaded || !isScanning) return;

    if (!studentDescriptor) {
      setErrorMsg("This student is not registered for face recognition.");
      setIsScanning(false);
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    // Parse descriptor if it's a JSON string
    let descriptorArray: number[];
    if (typeof studentDescriptor === 'string') {
      try {
        descriptorArray = JSON.parse(studentDescriptor);
      } catch (e) {
        console.error('Error parsing descriptor:', e);
        setErrorMsg("Invalid face descriptor format.");
        setIsScanning(false);
        return;
      }
    } else if (Array.isArray(studentDescriptor)) {
      descriptorArray = studentDescriptor;
    } else {
      setErrorMsg("Invalid face descriptor format.");
      setIsScanning(false);
      return;
    }

    const storedDescriptor = new Float32Array(descriptorArray);
    const THRESHOLD = 0.5;
    const detectAndMatchFace = async () => {
      if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        return;
      }

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, tinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (!isMounted) return;

        if (detections.length === 0) {
          console.log("No face detected...");
          return;
        }
        //Only get one face
        const detectedDescriptor = detections[0].descriptor;

        const distance = faceapi.euclideanDistance(detectedDescriptor, storedDescriptor);

        if (distance < THRESHOLD) {
          console.log("Face match found!");

          if (intervalId) clearInterval(intervalId);

          setAuthStatus('success');
          setIsScanning(false);

          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }

          setTimeout(() => {
            if (isMounted) {
              onAuthenticated();
            }
          }, 1000);
        } else {
          console.log(`Scanning... (distance: ${distance.toFixed(3)})`);
        }
      } catch (error) {
        console.error("Face detection error:", error);
        if (isMounted) {
          setErrorMsg("Face detection failed. Please try again.");
          setIsScanning(false);
          setAuthStatus('failed');
        }
      }
    };

    intervalId = setInterval(detectAndMatchFace, 1000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isModelsLoaded, isScanning, studentDescriptor, onAuthenticated]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300'>
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-sm mx-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Face Recognition</h3>

        {!isModelsLoaded ? (
          <div className="flex flex-col items-center justify-center h-48 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
            <span className="text-sm text-gray-500 font-medium">Preparing...</span>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden shadow-inner ring-4 ring-gray-100">
              {/* Video Stream */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${authStatus === 'success' ? 'opacity-40 blur-sm' : 'opacity-100'}`}
              />

              {/* Status Overlay - Scanning */}
              {authStatus === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-80"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="text-blue-500/50" size={32} />
                    </div>
                    {/* Scanning Line */}
                    <div className="absolute w-full h-1 bg-blue-500/80 top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  </div>
                </div>
              )}

              {authStatus === 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
                  <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                    <CheckCircle size={48} className="text-green-500" fill="currentColor" stroke="white" />
                  </div>
                  <span className="text-white font-bold text-xl drop-shadow-md">Authorized</span>
                </div>
              )}
            </div>

            <div className="mt-4 text-center h-6">
              {errorMsg ? (
                <p className="text-red-500 text-sm font-medium flex items-center justify-center gap-1.5 animate-in slide-in-from-top-1">
                  <XCircle size={16} /> {errorMsg}
                </p>
              ) : authStatus === 'success' ? (
                <p className="text-green-600 font-bold text-sm animate-pulse">Redirecting...</p>
              ) : (
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Please set your face in the middle of the frame
                </p>
              )}
            </div>
          </>
        )}

        <style jsx>{`
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            `}</style>
      </div>
    </div>
  );
}