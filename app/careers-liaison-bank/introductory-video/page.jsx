// app/careers-liaison-bank/introductory-video/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Webcam from "react-webcam";
import Image from "next/image";

import {
    Camera,
    Upload,
    Play,
    Pause,
    Square,
    Download,
    Trash2,
    Loader2,
    ArrowLeft,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    CheckCircle,
    AlertCircle,
    Shield,
    CheckSquare,
    Square as SquareIcon,
    X,
    Award,
    UserCheck,
    AlertTriangle,
    Mail,
    Phone,
    Briefcase,
    FileText
} from "lucide-react";

import Logo from "@/assets/images/logo_grey2.png";
import "./introductory-video.scss";

export default function IntroductoryVideoPage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const vacancyId = searchParams.get("vacancy_id");
    const jobTitle = searchParams.get("job_title");

    //------------------------------------------------
    // Refs
    //------------------------------------------------

    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedVideoRef = useRef(null);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoContainerRef = useRef(null);

    //------------------------------------------------
    // States
    //------------------------------------------------

    const [user, setUser] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [chunks, setChunks] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [displayTime, setDisplayTime] = useState("00:00");
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [notification, setNotification] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isStartingRecording, setIsStartingRecording] = useState(false);
    const [isStoppingRecording, setIsStoppingRecording] = useState(false);
    const [isClosingCamera, setIsClosingCamera] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Professional detection states
    const [professionalScore, setProfessionalScore] = useState(0);
    const [detectionWarnings, setDetectionWarnings] = useState([]);
    const [isProfessional, setIsProfessional] = useState(true);
    const [detectionInterval, setDetectionInterval] = useState(null);

    //------------------------------------------------
    // Load Candidate
    //------------------------------------------------

    useEffect(() => {

        const data = localStorage.getItem("career_user");

        if (!data) {
            router.push("/careers-liaison-bank");
            return;
        }

        try {
            setUser(JSON.parse(data));
            console.log("✅ User loaded:", JSON.parse(data)?.full_name);
        } catch (e) {
            console.error("❌ Error parsing user data:", e);
            router.push("/careers-liaison-bank");
        }

    }, [router]);

    //------------------------------------------------
    // Timer
    //------------------------------------------------

    useEffect(() => {

        if (!recording) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        timerRef.current = setInterval(() => {

            setSeconds(prev => {
                const s = prev + 1;
                const min = String(Math.floor(s / 60)).padStart(2, "0");
                const sec = String(s % 60).padStart(2, "0");
                const newDisplayTime = `${min}:${sec}`;
                setDisplayTime(newDisplayTime);
                return s;
            });

        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };

    }, [recording]);

    //------------------------------------------------
    // Cleanup
    //------------------------------------------------

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (detectionInterval) {
                clearInterval(detectionInterval);
            }
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl, detectionInterval]);

    //------------------------------------------------
    // Show Notification
    //------------------------------------------------

    const showNotification = (message, type = "success", duration = 5000) => {
        console.log(`📢 Notification [${type}]:`, message);
        setNotification({ message, type });
        setTimeout(() => setNotification(null), duration);
    };

    //------------------------------------------------
    // Handle Camera Ready
    //------------------------------------------------

    const handleUserMedia = () => {
        setCameraReady(true);
        setCameraError(null);
        showNotification("Camera ready! Click 'Start Recording' to begin.", "success");
    };

    const handleUserMediaError = (error) => {
        console.error("❌ Camera error:", error);
        setCameraError("Unable to access camera. Please check permissions.");
        setCameraReady(false);
        showNotification("Unable to access camera. Please check permissions.", "error");
    };

    //------------------------------------------------
    // Open Camera
    //------------------------------------------------

    const openCamera = () => {
        if (!termsAccepted) {
            setShowTermsModal(true);
            return;
        }
        setCameraOpen(true);
        setCameraError(null);
        showNotification("Opening camera...", "info");
    };

    //------------------------------------------------
    // Close Camera
    //------------------------------------------------

    const closeCamera = () => {
        if (isClosingCamera) return;
        
        setIsClosingCamera(true);
        
        if (recording && mediaRecorderRef.current) {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {}
            setRecording(false);
            setPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            stopProfessionalDetection();
            setSeconds(0);
            setDisplayTime("00:00");
        }
        
        setCameraOpen(false);
        setCameraReady(false);
        setCameraError(null);
        
        if (webcamRef.current && webcamRef.current.stream) {
            try {
                webcamRef.current.stream.getTracks().forEach(track => track.stop());
            } catch (e) {}
        }
        
        if (!videoUrl) {
            setVideoFile(null);
            setVideoUrl("");
            setTranscript("");
            setIsUploaded(false);
        }
        
        setChunks([]);
        setIsClosingCamera(false);
        showNotification("Camera closed.", "info");
    };

    //------------------------------------------------
    // Start Recording - FIXED with better MIME type
    //------------------------------------------------

    const startRecording = () => {
        if (isStartingRecording || recording) return;

        if (!cameraReady) {
            showNotification("Camera is not ready. Please wait.", "error");
            return;
        }

        const stream = webcamRef.current?.stream;
        if (!stream) {
            showNotification("No camera stream available.", "error");
            return;
        }

        setIsStartingRecording(true);

        // Use MP4 compatible codec if possible
        let mimeType = "video/webm;codecs=vp8,opus";
        
        // Check for supported MIME types
        const supportedTypes = [
            "video/webm;codecs=vp8,opus",
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=h264,opus",
            "video/mp4;codecs=h264,aac"
        ];
        
        for (const type of supportedTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                mimeType = type;
                break;
            }
        }
        
        console.log("📹 Using mimeType:", mimeType);

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        const localChunks = [];

        recorder.ondataavailable = e => {
            if (e.data.size > 0) {
                localChunks.push(e.data);
            }
        };

recorder.onstop = async () => {
    const blob = new Blob(localChunks, { type: recorder.mimeType });
    
    let fileToUpload = blob;
    let fileExtension = 'webm';
    let fileType = 'video/webm';
    
    // If it's webm, try to convert to mp4
    if (recorder.mimeType.includes('webm')) {
        try {
            console.log("🔄 Converting WebM to MP4...");
            const mp4Blob = await convertWebmToMp4(blob);
            fileToUpload = mp4Blob;
            fileExtension = 'mp4';
            fileType = 'video/mp4';
            console.log("✅ Conversion successful");
        } catch (conversionError) {
            console.warn("⚠️ Conversion failed, using original webm:", conversionError);
            // Fall back to original webm
        }
    }
    
    const fileName = `introduction.${fileExtension}`;
    const file = new File([fileToUpload], fileName, { type: fileType });
    const url = URL.createObjectURL(fileToUpload);
    
    setVideoFile(file);
    setVideoUrl(url);
    setChunks(localChunks);
    setRecording(false);
    setSeconds(0);
    setDisplayTime("00:00");
    setPaused(false);
    setIsStartingRecording(false);
    setIsStoppingRecording(false);
    
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    stopProfessionalDetection();

    showNotification("Recording completed!", "success");
};

        recorder.start(1000);
        setRecording(true);
        setSeconds(0);
        setDisplayTime("00:00");
        setPaused(false);
        setIsStartingRecording(false);
        showNotification("Recording started...", "info");

        setTimeout(() => {
            startProfessionalDetection();
        }, 2000);
    };

    //------------------------------------------------
    // Pause Recording
    //------------------------------------------------

    const pauseRecording = () => {
        if (!mediaRecorderRef.current) return;

        if (!paused) {
            mediaRecorderRef.current.pause();
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            stopProfessionalDetection();
            showNotification("Recording paused", "info");
        } else {
            mediaRecorderRef.current.resume();
            timerRef.current = setInterval(() => {
                setSeconds(prev => {
                    const s = prev + 1;
                    const min = String(Math.floor(s / 60)).padStart(2, "0");
                    const sec = String(s % 60).padStart(2, "0");
                    setDisplayTime(`${min}:${sec}`);
                    return s;
                });
            }, 1000);
            startProfessionalDetection();
            showNotification("Recording resumed", "info");
        }

        setPaused(!paused);
    };

    //------------------------------------------------
    // Stop Recording
    //------------------------------------------------

    const stopRecording = () => {
        if (!mediaRecorderRef.current) return;
        
        setIsStoppingRecording(true);
        mediaRecorderRef.current.stop();
        setPaused(false);
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        stopProfessionalDetection();
        setIsStoppingRecording(false);
        
        showNotification("Stopping recording...", "info");
    };



    // Add this function to convert webm to mp4
const convertWebmToMp4 = async (webmBlob) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        video.src = URL.createObjectURL(webmBlob);
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const stream = canvas.captureStream(30);
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/mp4'
            });
            
            const chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const mp4Blob = new Blob(chunks, { type: 'video/mp4' });
                resolve(mp4Blob);
            };
            
            // Draw video frames to canvas
            const drawFrame = () => {
                if (!video.paused && !video.ended) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    requestAnimationFrame(drawFrame);
                }
            };
            
            video.play();
            recorder.start();
            drawFrame();
            
            // Stop after video ends
            video.onended = () => {
                recorder.stop();
                video.pause();
            };
        };
        video.onerror = () => reject(new Error('Failed to convert video'));
    });
};
    //------------------------------------------------
    // File Upload Selection
    //------------------------------------------------

    const selectVideo = e => {
        const file = e.target.files[0];
        if (!file) return;

        // Check for supported types including webm
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
        if (!allowedTypes.includes(file.type)) {
            showNotification("Please upload a valid video file (MP4, MOV, AVI, MKV, WEBM).", "error");
            e.target.value = '';
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            showNotification("File size should be less than 100MB.", "error");
            e.target.value = '';
            return;
        }

        if (cameraOpen) {
            closeCamera();
        }

        // For webm files, try to keep the original type
        let finalFile = file;
        if (file.type === 'video/webm') {
            // Keep as webm, the backend should handle it
            console.log("📹 WebM file selected:", file.name);
        }

        setVideoFile(finalFile);
        setVideoUrl(URL.createObjectURL(file));
        setIsUploaded(false);
        setTranscript("");
        setUploadError(null);
        showNotification("Video file selected successfully!", "success");
    };

    //------------------------------------------------
    // Upload Video - FIXED with proper form data
    //------------------------------------------------

    const uploadVideo = async () => {
        console.log("📤 Upload Video called");
        console.log("📊 videoFile:", !!videoFile);
        console.log("📊 videoFile type:", videoFile?.type);
        console.log("📊 videoFile name:", videoFile?.name);
        console.log("📊 user:", !!user);
        console.log("📊 vacancyId:", vacancyId);
        
        if (!videoFile) {
            showNotification("Please record or select a video.", "error");
            return;
        }

        if (!user?.id) {
            showNotification("User not found. Please log in again.", "error");
            return;
        }

        if (!vacancyId) {
            showNotification("Vacancy ID is required.", "error");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append("candidate_id", user.id);
            formData.append("vacancy_id", vacancyId);
            
            // For webm files, ensure the backend accepts the format
            // Try to convert to MP4 if backend doesn't support webm
            let fileToUpload = videoFile;
            
            // If it's a webm file, we need to ensure the backend accepts it
            // The backend error shows "Unsupported file type" for webm
            // So we need to either convert or use the correct endpoint
            
            formData.append("video", fileToUpload);

            console.log("📤 FormData prepared");
            console.log("📤 File name:", fileToUpload.name);
            console.log("📤 File type:", fileToUpload.type);
            console.log("📤 File size:", fileToUpload.size);

            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 500);

            // Try the correct endpoint - /api/upload-introduction-video
            const API_URL = `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/introduction-video`;
            console.log("📤 API URL:", API_URL);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("career_token")}`,
                },
                body: formData,
            });

            console.log("📤 Response status:", response.status);

            clearInterval(progressInterval);
            setUploadProgress(100);

            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { message: await response.text() };
            }
            console.log("📤 Response data:", data);

            if (!response.ok) {
                const errorMsg = data.detail || data.message || data.error || "Upload failed";
                
                // Check for specific error messages
                if (errorMsg.includes("Unsupported file type") || errorMsg.includes("file type")) {
                    throw new Error(`The ${videoFile.type} file format is not supported by the server. Please try recording again or upload a different video format.`);
                } else {
                    throw new Error(errorMsg);
                }
            }

            setTranscript(data.transcript || "No transcript available.");
            setIsUploaded(true);
            showNotification("✅ Video uploaded successfully!", "success");

            setTimeout(() => {
                router.push("/careers-liaison-bank/candidate-dashboard");
            }, 3000);

        } catch (err) {
            console.error("❌ Upload error:", err);
            setUploadError(err.message);
            showNotification(err.message || "Upload failed. Please try again.", "error");
        }

        setUploading(false);
    };

    //------------------------------------------------
    // Professional Detection
    //------------------------------------------------

    const captureFrame = () => {
        const video = webcamRef.current?.video;
        if (!video) return null;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let skinPixelCount = 0;
        let totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (r > 60 && g > 40 && b > 20 &&
                r > g && r > b &&
                Math.abs(r - g) > 15) {
                skinPixelCount++;
            }
        }

        const skinPercentage = (skinPixelCount / totalPixels) * 100;

        let brightnessSum = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            brightnessSum += (r + g + b) / 3;
        }
        const avgBrightness = brightnessSum / (data.length / 4);

        return {
            skinPercentage,
            avgBrightness,
            hasPerson: skinPercentage > 5,
            lightingGood: avgBrightness > 80 && avgBrightness < 220
        };
    };

    const startProfessionalDetection = () => {
        setProfessionalScore(0);
        setDetectionWarnings([]);
        setIsProfessional(true);

        const interval = setInterval(() => {
            const analysis = captureFrame();
            if (!analysis) return;

            const warnings = [];
            let score = 100;

            if (!analysis.hasPerson) {
                warnings.push("No person detected in frame");
                score -= 30;
            }

            if (!analysis.lightingGood) {
                if (analysis.avgBrightness < 80) {
                    warnings.push("Poor lighting detected. Please ensure proper lighting.");
                    score -= 20;
                } else if (analysis.avgBrightness > 220) {
                    warnings.push("Too bright. Adjust lighting.");
                    score -= 10;
                }
            }

            setDetectionWarnings(warnings);
            const newScore = Math.max(0, Math.min(100, score));
            setProfessionalScore(newScore);

            if (newScore < 60 && isProfessional) {
                setIsProfessional(false);
                showNotification("⚠️ Professional issues detected. Please adjust your setup.", "warning", 5000);
            } else if (newScore >= 60 && !isProfessional) {
                setIsProfessional(true);
                showNotification("✅ Professional setup detected!", "success", 3000);
            }

        }, 1000);

        setDetectionInterval(interval);
    };

    const stopProfessionalDetection = () => {
        if (detectionInterval) {
            clearInterval(detectionInterval);
            setDetectionInterval(null);
        }
    };

    //------------------------------------------------
    // Video Controls
    //------------------------------------------------

    const togglePlay = async () => {
        const video = recordedVideoRef.current;
        if (!video) return;

        if (video.paused) {
            await video.play();
        } else {
            video.pause();
        }
    };

    const handleLoadedMetadata = () => {
        const video = recordedVideoRef.current;
        if (!video) return;
        setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
        const video = recordedVideoRef.current;
        if (!video) return;
        setProgress((video.currentTime / video.duration) * 100);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        if (recordedVideoRef.current) {
            recordedVideoRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const video = recordedVideoRef.current;
        if (!video) return;

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
        };
    }, [videoUrl]);

    const seekVideo = e => {
        const video = recordedVideoRef.current;
        if (!video) return;

        const value = Number(e.target.value);
        video.currentTime = (value / 100) * video.duration;
        setProgress(value);
    };

    const toggleMute = () => {
        const video = recordedVideoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setMuted(video.muted);
    };

    const toggleFullscreen = () => {
        const container = videoContainerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    const removeVideo = () => {
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoFile(null);
        setVideoUrl("");
        setTranscript("");
        setProgress(0);
        setDuration(0);
        setIsUploaded(false);
        setUploadProgress(0);
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        showNotification("Video removed.", "info");
    };

    const downloadVideo = () => {
        if (!videoUrl) return;
        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = "introduction-video.webm";
        a.click();
    };

    const goBack = () => {
        if (recording) {
            showNotification("Please stop recording before leaving.", "warning");
            return;
        }
        if (cameraOpen) {
            closeCamera();
        }
        router.push("/careers-liaison-bank/candidate-dashboard");
    };

    const formatTime = (sec) => {
        if (!sec || isNaN(sec)) return "00:00";
        const min = Math.floor(sec / 60);
        const second = Math.floor(sec % 60);
        return `${String(min).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    };

    //------------------------------------------------
    // Render
    //------------------------------------------------

    if (!user) {
        return (
            <div className="loading-state">
                <Loader2 className="spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="introductory-video-page">

            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    <div className="notification-content">
                        {notification.type === "success" && <CheckCircle size={20} />}
                        {notification.type === "error" && <AlertCircle size={20} />}
                        {notification.type === "warning" && <AlertTriangle size={20} />}
                        {notification.type === "info" && <AlertCircle size={20} />}
                        <span>{notification.message}</span>
                    </div>
                    <button className="notification-close" onClick={() => setNotification(null)}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Terms and Conditions Modal */}
            {showTermsModal && (
                <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📋 Terms and Conditions</h2>
                            <button className="modal-close" onClick={() => setShowTermsModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="terms-section">
                                <h4>1. Professional Appearance</h4>
                                <ul>
                                    <li>You must be in formal/professional attire</li>
                                    <li>Face must be clearly visible</li>
                                    <li>Professional background (neutral/clean)</li>
                                    <li>Proper lighting required</li>
                                </ul>
                            </div>
                            <div className="terms-section">
                                <h4>2. Recording Guidelines</h4>
                                <ul>
                                    <li>You must be the person appearing in the video</li>
                                    <li>Video should be between 1-3 minutes</li>
                                    <li>Clear audio with minimal background noise</li>
                                    <li>Look directly at the camera</li>
                                </ul>
                            </div>
                            <div className="terms-section">
                                <h4>3. Content Guidelines</h4>
                                <ul>
                                    <li>No inappropriate or offensive content</li>
                                    <li>Professional language only</li>
                                    <li>Be honest and authentic</li>
                                    <li>No sharing of confidential information</li>
                                </ul>
                            </div>
                            <div className="terms-checkbox">
                                <button
                                    className={`checkbox-btn ${termsAccepted ? "checked" : ""}`}
                                    onClick={() => setTermsAccepted(!termsAccepted)}
                                >
                                    {termsAccepted ? <CheckSquare size={20} /> : <SquareIcon size={20} />}
                                    <span>I agree to the terms and conditions</span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowTermsModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    if (termsAccepted) {
                                        setShowTermsModal(false);
                                        openCamera();
                                    } else {
                                        showNotification("Please accept the terms and conditions.", "error");
                                    }
                                }}
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

          


            <main className="page-content">
               <button className="back-btn" onClick={goBack}>
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </button>
                <div className="container">
                    <div className="page-header-section">
                        <h1>Professional Introduction Video</h1>
                        <p className="subtitle">Record or upload a professional introduction video for your application</p>

                        <div className="badges-container">
                            {jobTitle && (
                                <div className="job-info-badge">
                                    <Briefcase size={16} />
                                    <span>Position: {decodeURIComponent(jobTitle)}</span>
                                </div>
                            )}
                            {vacancyId && (
                                <div className="vacancy-id-badge">
                                    <FileText size={16} />
                                    <span>Vacancy ID: {vacancyId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="video-section">
                        {/* Candidate Info */}
                        <div className="candidate-info-card">
                            <div className="candidate-avatar">
                                {user?.full_name?.charAt(0) || "U"}
                            </div>
                            <div className="candidate-details">
                                <h3>{user?.full_name || "Candidate"}</h3>
                                <div className="candidate-meta">
                                    <span><Mail size={14} /> {user?.email || "N/A"}</span>
                                    <span><Phone size={14} /> {user?.phone || "N/A"}</span>
                                    <span><Briefcase size={14} /> {user?.current_designation || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Score */}
                        {recording && (
                            <div className="professional-score-card">
                                <div className="score-header">
                                    <div className="score-title">
                                        <Award size={18} />
                                        <span>Professional Score</span>
                                    </div>
                                    <div className={`score-status ${isProfessional ? "professional" : "warning"}`}>
                                        {isProfessional ? <UserCheck size={16} /> : <AlertTriangle size={16} />}
                                        <span>{isProfessional ? "Professional" : "Issues Detected"}</span>
                                    </div>
                                </div>
                                <div className="score-bar">
                                    <div className="score-fill" style={{ width: `${professionalScore}%` }} />
                                </div>
                                <div className="score-value">{Math.round(professionalScore)}%</div>
                                {detectionWarnings.length > 0 && !isProfessional && (
                                    <div className="score-warnings">
                                        {detectionWarnings.map((warning, index) => (
                                            <div key={index} className="warning-item">
                                                <AlertTriangle size={14} />
                                                <span>{warning}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="video-container">
                            {/* Video Upload Area */}
                            <div className="video-upload-area">
                                {!videoUrl && !cameraOpen ? (
                                    <div className="upload-options">
                                        <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={48} />
                                            <h4>Upload Video</h4>
                                            <p>Click to browse or drag & drop</p>
                                            <span className="file-types">MP4, MOV, AVI, MKV, WEBM (Max 100MB)</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="video/*"
                                                onChange={selectVideo}
                                                style={{ display: "none" }}
                                            />
                                        </div>

                                        <div className="divider">OR</div>

                                        <div className="record-option">
                                            <button
                                                className="record-btn"
                                                onClick={() => {
                                                    if (!termsAccepted) {
                                                        setShowTermsModal(true);
                                                    } else {
                                                        openCamera();
                                                    }
                                                }}
                                                disabled={cameraOpen || recording}
                                            >
                                                <Camera size={24} />
                                                <span>Open Camera</span>
                                            </button>
                                            <p className="record-hint">
                                                Open your camera to preview before recording
                                            </p>
                                            {!termsAccepted && (
                                                <p className="terms-hint">
                                                    <Shield size={14} />
                                                    <span>Please accept the terms and conditions</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : !videoUrl && cameraOpen ? (
                                    <div className="camera-preview-container">
                                        <div className="video-wrapper">
                                            <Webcam
                                                ref={webcamRef}
                                                audio={true}
                                                muted={true}
                                                mirrored={true}
                                                onUserMedia={handleUserMedia}
                                                onUserMediaError={handleUserMediaError}
                                                videoConstraints={{
                                                    width: { ideal: 640 },
                                                    height: { ideal: 480 },
                                                    facingMode: "user"
                                                }}
                                                className="video-player"
                                            />
                                            <div className="camera-overlay">
                                                <div className="camera-status">
                                                    <span className={`status-dot ${cameraReady ? "live" : "connecting"}`} />
                                                    {cameraReady ? "Camera Ready" : "Connecting..."}
                                                </div>
                                            </div>
                                            {cameraError && (
                                                <div className="camera-error">
                                                    <AlertCircle size={20} />
                                                    <span>{cameraError}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="camera-controls">
                                            <button
                                                className="btn-secondary"
                                                onClick={closeCamera}
                                            >
                                                <X size={16} />
                                                Close Camera
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={startRecording}
                                                disabled={!cameraReady || recording || isStartingRecording}
                                            >
                                                {isStartingRecording ? (
                                                    <>
                                                        <Loader2 className="spinning" size={16} />
                                                        Starting...
                                                    </>
                                                ) : recording ? (
                                                    <>
                                                        <CheckCircle size={16} />
                                                        Recording...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Camera size={16} />
                                                        Start Recording
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="video-preview">
                                        <div className="video-wrapper" ref={videoContainerRef}>
                                            {recording ? (
                                                <Webcam
                                                    ref={webcamRef}
                                                    audio={true}
                                                    muted={true}
                                                    mirrored={true}
                                                    videoConstraints={{
                                                        width: { ideal: 640 },
                                                        height: { ideal: 480 },
                                                        facingMode: "user"
                                                    }}
                                                    className="video-player"
                                                />
                                            ) : (
                                                <video
                                                    ref={recordedVideoRef}
                                                    src={videoUrl}
                                                    className="video-player"
                                                    onLoadedMetadata={handleLoadedMetadata}
                                                    onTimeUpdate={handleTimeUpdate}
                                                    controls={false}
                                                />
                                            )}

                                            {!recording && videoUrl && (
                                                <div className="video-controls">
                                                    <button className="control-btn" onClick={togglePlay}>
                                                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                                    </button>

                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={progress}
                                                            onChange={seekVideo}
                                                            className="progress-slider"
                                                        />
                                                    </div>

                                                    <span className="time-display">
                                                        {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                                                    </span>

                                                    <button className="control-btn" onClick={toggleMute}>
                                                        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                                    </button>

                                                    <button className="control-btn" onClick={toggleFullscreen}>
                                                        {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                                    </button>
                                                </div>
                                            )}

                                            {recording && (
                                                <div className="recording-badge">
                                                    <div className="recording-dot"></div>
                                                    {paused ? "⏸ Paused" : "🔴 Recording..."}
                                                    <span className="recording-timer">{displayTime}</span>
                                                    {!isProfessional && (
                                                        <span className="warning-badge">
                                                            <AlertTriangle size={14} />
                                                            Issues Detected
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="video-actions">
                                            {recording ? (
                                                <>
                                                    <button
                                                        className="btn-secondary"
                                                        onClick={pauseRecording}
                                                    >
                                                        {paused ? <Play size={16} /> : <Pause size={16} />}
                                                        {paused ? "Resume" : "Pause"}
                                                    </button>
                                                    <button
                                                        className="btn-secondary stop-btn"
                                                        onClick={stopRecording}
                                                        disabled={isStoppingRecording}
                                                        style={{ 
                                                            background: '#dc3545', 
                                                            color: 'white', 
                                                            borderColor: '#dc3545' 
                                                        }}
                                                    >
                                                        {isStoppingRecording ? (
                                                            <>
                                                                <Loader2 className="spinning" size={16} />
                                                                Stopping...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Square size={16} />
                                                                Stop Recording
                                                            </>
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn-secondary"
                                                        onClick={removeVideo}
                                                        disabled={recording}
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove Video
                                                    </button>
                                                    <button
                                                        className="btn-secondary"
                                                        onClick={downloadVideo}
                                                        disabled={recording}
                                                    >
                                                        <Download size={16} />
                                                        Download
                                                    </button>
                                                </>
                                            )}
                                            {!recording && videoFile && (
                                                <button
                                                    className="btn-upload"
                                                    onClick={uploadVideo}
                                                    disabled={uploading}
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <Loader2 className="spinning" size={20} />
                                                            Uploading... {uploadProgress}%
                                                        </>
                                                    ) : isUploaded ? (
                                                        <>
                                                            <CheckCircle size={20} />
                                                            Uploaded
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload size={20} />
                                                            Upload Video
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {uploading && (
                                            <div className="upload-progress">
                                                <div className="progress-track">
                                                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                                                </div>
                                                <span className="progress-text">{uploadProgress}%</span>
                                            </div>
                                        )}

                                        {isUploaded && transcript && (
                                            <div className="transcript-section">
                                                <h4>📝 Transcript</h4>
                                                <p>{transcript}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className="instructions-card">
                                <h4>📋 Video Instructions</h4>
                                <div className="instructions-content">
                                    <div className="instruction-section">
                                        <h5>👔 Professional Appearance:</h5>
                                        <ul>
                                            <li>Wear formal/professional attire</li>
                                            <li>Ensure face is clearly visible</li>
                                            <li>Maintain proper posture</li>
                                            <li>Look professional and confident</li>
                                        </ul>
                                    </div>
                                    <div className="instruction-section">
                                        <h5>🎯 What to Include:</h5>
                                        <ul>
                                            <li>Professional introduction of yourself</li>
                                            <li>Current role and key responsibilities</li>
                                            <li>Relevant skills and achievements</li>
                                            <li>Why you're interested in this position</li>
                                            <li>How you can contribute to the team</li>
                                        </ul>
                                    </div>
                                    <div className="instruction-section">
                                        <h5>🎬 Video Quality Tips:</h5>
                                        <ul>
                                            <li>Good lighting (face well-lit)</li>
                                            <li>Clear audio (minimize background noise)</li>
                                            <li>Professional background (neutral/clean)</li>
                                            <li>Look directly at the camera</li>
                                            <li>Speak clearly and confidently</li>
                                        </ul>
                                    </div>
                                    <div className="instruction-section">
                                        <h5>⏱️ Duration:</h5>
                                        <ul>
                                            <li>Recommended: 1-2 minutes</li>
                                            <li>Maximum: 3 minutes</li>
                                            <li>Be concise and impactful</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}