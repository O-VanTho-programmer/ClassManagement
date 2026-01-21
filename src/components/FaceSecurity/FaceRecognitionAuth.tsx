'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Camera, CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react';
import { startVideo } from '@/utils/face-recognition/startVideoCamera';
import { loadModelFaceApi, tinyFaceDetectorOptions } from '@/utils/face-recognition/loadModelFaceApi';
import * as faceapi from 'face-api.js';

interface FaceRecognitionAuthProps {
  studentDescriptor: number[] | string | null;
  onAuthenticated: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FaceRecognitionAuth({
  studentDescriptor,
  isOpen,
  onAuthenticated,
  onClose
}: FaceRecognitionAuthProps) {

  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [authStatus, setAuthStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
  const [errorMsg, setErrorMsg] = useState('');

  // Cleanup function to stop camera stream
  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  // Close handler with camera cleanup
  const handleClose = useCallback(() => {
    cleanupCamera();
    onClose();
  }, [cleanupCamera, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  }, [handleClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  // Load face recognition models
  useEffect(() => {
    if (!isOpen) return;

    const init = async () => {
      try {
        const success = await loadModelFaceApi();
        setIsModelsLoaded(success);
        if (!success) {
          setErrorMsg("Failed to load AI models. Please refresh and try again.");
          setAuthStatus('failed');
        }
      } catch (error) {
        console.error('Model loading error:', error);
        setErrorMsg("Failed to load AI models. Please refresh and try again.");
        setAuthStatus('failed');
      }
    };
    init();
  }, [isOpen]);

  // Start video stream
  useEffect(() => {
    if (!isOpen || !isModelsLoaded || !isScanning) return;

    const initCamera = async () => {
      try {
        const stream = await startVideo(videoRef);
        streamRef.current = stream;
      } catch (err) {
        console.error('Camera access error:', err);
        setErrorMsg("Camera access denied or unavailable. Please allow camera access.");
        setIsScanning(false);
        setAuthStatus('failed');
      }
    };

    initCamera();

    // Cleanup on unmount or when dependencies change
    return cleanupCamera;
  }, [isOpen, isModelsLoaded, isScanning, cleanupCamera]);

  // Face detection and matching logic
  useEffect(() => {
    if (!isOpen || !isModelsLoaded || !isScanning) return;

    if (!studentDescriptor) {
      setErrorMsg("This student is not registered for face recognition.");
      setIsScanning(false);
      setAuthStatus('failed');
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    // Parse descriptor
    let descriptorArray: number[];
    try {
      if (typeof studentDescriptor === 'string') {
        descriptorArray = JSON.parse(studentDescriptor);
      } else if (Array.isArray(studentDescriptor)) {
        descriptorArray = studentDescriptor;
      } else {
        throw new Error("Invalid descriptor type");
      }
    } catch (e) {
      console.error('Error parsing descriptor:', e);
      setErrorMsg("Invalid face descriptor format.");
      setIsScanning(false);
      setAuthStatus('failed');
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

        // Only process the first detected face
        const detectedDescriptor = detections[0].descriptor;
        const distance = faceapi.euclideanDistance(detectedDescriptor, storedDescriptor);

        console.log(`Face distance: ${distance.toFixed(3)}`);

        if (distance < THRESHOLD) {
          console.log("✓ Face match found!");

          if (intervalId) clearInterval(intervalId);

          setAuthStatus('success');
          setIsScanning(false);

          // Clean up camera
          cleanupCamera();

          // Redirect after animation
          setTimeout(() => {
            if (isMounted) {
              onAuthenticated();
            }
          }, 1500);
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

    // Start detection interval
    intervalId = setInterval(detectAndMatchFace, 1000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, isModelsLoaded, isScanning, studentDescriptor, onAuthenticated, cleanupCamera]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in'
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-md mx-auto animate-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group z-10"
          aria-label="Close"
        >
          <X size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-3">
            <Camera className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Face Recognition
          </h3>
          <p className="text-sm text-gray-500 mt-1">Position your face in the frame</p>
        </div>

        {!isModelsLoaded ? (
          <div className="flex flex-col items-center justify-center h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <Loader2 className="text-blue-500/30" size={48} />
              </div>
              <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
            <span className="text-sm text-gray-600 font-medium mt-4">Initializing AI Models...</span>
            <div className="flex gap-1.5 mt-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-gray-200/50">
              {/* Video Stream */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-500 ${authStatus === 'success' ? 'opacity-30 blur-md scale-105' : 'opacity-100'
                  }`}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none"></div>

              {/* Status Overlay - Scanning */}
              {authStatus === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-56 h-56">
                    {/* Outer pulse ring */}
                    <div className="absolute inset-0 border-4 border-blue-400/20 rounded-full animate-ping"></div>
                    {/* Middle ring */}
                    <div className="absolute inset-4 border-3 border-blue-500/40 rounded-full"></div>
                    {/* Inner ring */}
                    <div className="absolute inset-8 border-2 border-blue-400/60 rounded-full backdrop-blur-sm bg-blue-500/5"></div>

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-500/20 backdrop-blur-md p-4 rounded-full border border-blue-400/30">
                        <Camera className="text-blue-300" size={32} />
                      </div>
                    </div>

                    {/* Scanning Line */}
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>

                    {/* Corner guides */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-3 border-t-3 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-3 border-t-3 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-3 border-b-3 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-3 border-b-3 border-blue-400 rounded-br-lg"></div>
                  </div>
                </div>
              )}

              {/* Success Overlay */}
              {authStatus === 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    {/* Success glow */}
                    <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-2xl shadow-green-500/50 animate-in zoom-in duration-300">
                      <CheckCircle size={56} className="text-green-500" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="mt-6 text-center animate-in slide-in-from-bottom-4 duration-500 delay-150">
                    <span className="text-white font-bold text-2xl drop-shadow-lg">Authorized!</span>
                    <p className="text-green-100 text-sm mt-1 drop-shadow">Access granted</p>
                  </div>
                </div>
              )}

              {/* Failed Overlay */}
              {authStatus === 'failed' && errorMsg && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-2xl shadow-red-500/50">
                      <AlertTriangle size={56} className="text-red-500" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="mt-6 text-center max-w-xs">
                    <span className="text-white font-bold text-xl drop-shadow-lg">Access Denied</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status Messages */}
            <div className="mt-6 text-center min-h-12 flex items-center justify-center">
              {errorMsg ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
                  <XCircle size={18} className="text-red-500" />
                  <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
                </div>
              ) : authStatus === 'success' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-green-700 font-semibold text-sm">Redirecting to dashboard...</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-blue-700 text-sm font-medium">Scanning your face...</p>
                </div>
              )}
            </div>
          </>
        )}

        <style jsx>{`
          @keyframes scan {
            0% { top: 5%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 95%; opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}