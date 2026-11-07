// app/careers-liaison-bank/introductory-video/page.jsx
"use client";
import { Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Webcam from "react-webcam";
import {
  Camera, Upload, Play, Pause, Square, Download, Trash2, Loader2,
  ArrowLeft, Volume2, VolumeX, Maximize2, Minimize2, CheckCircle,
  AlertCircle, Shield, CheckSquare, Square as SquareIcon, X, Award,
  UserCheck, AlertTriangle, Mail, Briefcase, FileText,
  Sparkles, Mic, Clock, ChevronDown, Radio
} from "lucide-react";
import "./introductory-video.scss";

function IntroductoryVideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vacancyId = searchParams.get("vacancy_id");
  const jobTitle = searchParams.get("job_title");

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoContainerRef = useRef(null);

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
  const [activeTab, setActiveTab] = useState("record"); // "record" | "upload"
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const [professionalScore, setProfessionalScore] = useState(0);
  const [detectionWarnings, setDetectionWarnings] = useState([]);
  const [isProfessional, setIsProfessional] = useState(true);
  const [detectionInterval, setDetectionInterval] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("career_user");
    if (!data) { router.push("/careers-liaison-bank"); return; }
    try { setUser(JSON.parse(data)); }
    catch (e) { router.push("/careers-liaison-bank"); }
  }, [router]);

  useEffect(() => {
    if (!recording) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        const s = prev + 1;
        setDisplayTime(`${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`);
        return s;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (detectionInterval) clearInterval(detectionInterval);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl, detectionInterval]);

  const showNotification = (message, type = "success", duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  const handleUserMedia = () => {
    setCameraReady(true);
    setCameraError(null);
    showNotification("Camera ready! Click 'Start Recording' to begin.", "success");
  };
  const handleUserMediaError = () => {
    setCameraError("Unable to access camera. Please check permissions.");
    setCameraReady(false);
  };

  const openCamera = () => {
    if (!termsAccepted) { setShowTermsModal(true); return; }
    setCameraOpen(true);
    setCameraError(null);
    setActiveTab("record");
  };

  const closeCamera = () => {
    if (isClosingCamera) return;
    setIsClosingCamera(true);
    if (recording && mediaRecorderRef.current) {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
      setRecording(false);
      setPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      stopProfessionalDetection();
      setSeconds(0);
      setDisplayTime("00:00");
    }
    setCameraOpen(false);
    setCameraReady(false);
    if (webcamRef.current?.stream) {
      try { webcamRef.current.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    }
    setChunks([]);
    setIsClosingCamera(false);
  };

  const startRecording = () => {
    if (isStartingRecording || recording || !cameraReady) return;
    const stream = webcamRef.current?.stream;
    if (!stream) return;
    setIsStartingRecording(true);

    let mimeType = "video/webm;codecs=vp8,opus";
    for (const type of ["video/webm;codecs=vp8,opus","video/webm;codecs=vp9,opus","video/webm;codecs=h264,opus","video/mp4;codecs=h264,aac"]) {
      if (MediaRecorder.isTypeSupported(type)) { mimeType = type; break; }
    }

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    const localChunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) localChunks.push(e.data); };
    recorder.onstop = async () => {
      const blob = new Blob(localChunks, { type: recorder.mimeType });
      let fileToUpload = blob, fileExtension = 'webm', fileType = 'video/webm';
      if (recorder.mimeType.includes('webm')) {
        try {
          const mp4Blob = await convertWebmToMp4(blob);
          fileToUpload = mp4Blob; fileExtension = 'mp4'; fileType = 'video/mp4';
        } catch (e) {}
      }
      const file = new File([fileToUpload], `introduction.${fileExtension}`, { type: fileType });
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(fileToUpload));
      setChunks(localChunks);
      setRecording(false);
      setSeconds(0);
      setDisplayTime("00:00");
      setPaused(false);
      setIsStartingRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      stopProfessionalDetection();
      showNotification("Recording completed!", "success");
    };
    recorder.start(1000);
    setRecording(true);
    setSeconds(0);
    setDisplayTime("00:00");
    setIsStartingRecording(false);
    setTimeout(() => startProfessionalDetection(), 2000);
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (!paused) {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      stopProfessionalDetection();
    } else {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          const s = prev + 1;
          setDisplayTime(`${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`);
          return s;
        });
      }, 1000);
      startProfessionalDetection();
    }
    setPaused(!paused);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    setIsStoppingRecording(true);
    mediaRecorderRef.current.stop();
    setPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    stopProfessionalDetection();
    setIsStoppingRecording(false);
  };

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
        const recorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/mp4' }));
        const drawFrame = () => {
          if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawFrame);
          }
        };
        video.play();
        recorder.start();
        drawFrame();
        video.onended = () => { recorder.stop(); video.pause(); };
      };
      video.onerror = () => reject(new Error('Failed to convert video'));
    });
  };

  const selectVideo = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['video/mp4','video/mov','video/avi','video/mkv','video/webm'].includes(file.type)) {
      showNotification("Please upload a valid video file.", "error");
      e.target.value = ''; return;
    }
    if (file.size > 100 * 1024 * 1024) {
      showNotification("File size should be less than 100MB.", "error");
      e.target.value = ''; return;
    }
    if (cameraOpen) closeCamera();
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setIsUploaded(false);
    setTranscript("");
    setActiveTab("upload");
  };

  const uploadVideo = async () => {
    if (!videoFile || !user?.id || !vacancyId) {
      showNotification("Missing required data.", "error"); return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("candidate_id", user.id);
      formData.append("vacancy_id", vacancyId);
      formData.append("video", videoFile);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev >= 90 ? (clearInterval(progressInterval), prev) : prev + 10);
      }, 500);
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/introduction-video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("career_token")}` },
        body: formData,
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.message || "Upload failed");
      setTranscript(data.transcript || "No transcript available.");
      setIsUploaded(true);
      showNotification("Video uploaded successfully!", "success");
      setTimeout(() => router.push("/careers-liaison-bank/candidate-dashboard"), 3000);
    } catch (err) {
      setUploadError(err.message);
      showNotification(err.message || "Upload failed.", "error");
    }
    setUploading(false);
  };

  const captureFrame = () => {
    const video = webcamRef.current?.video;
    if (!video) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let skinCount = 0, brightnessSum = 0;
    const total = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) skinCount++;
      brightnessSum += (r + g + b) / 3;
    }
    return {
      skinPercentage: (skinCount / total) * 100,
      avgBrightness: brightnessSum / total,
      hasPerson: (skinCount / total) * 100 > 5,
      lightingGood: (brightnessSum / total) > 80 && (brightnessSum / total) < 220
    };
  };

  const startProfessionalDetection = () => {
    setProfessionalScore(0);
    setDetectionWarnings([]);
    setIsProfessional(true);
    const interval = setInterval(() => {
      const a = captureFrame();
      if (!a) return;
      const warnings = [];
      let score = 100;
      if (!a.hasPerson) { warnings.push("No person detected"); score -= 30; }
      if (!a.lightingGood) {
        if (a.avgBrightness < 80) { warnings.push("Poor lighting"); score -= 20; }
        else if (a.avgBrightness > 220) { warnings.push("Too bright"); score -= 10; }
      }
      setDetectionWarnings(warnings);
      const newScore = Math.max(0, Math.min(100, score));
      setProfessionalScore(newScore);
      if (newScore < 60 && isProfessional) setIsProfessional(false);
      else if (newScore >= 60 && !isProfessional) setIsProfessional(true);
    }, 1000);
    setDetectionInterval(interval);
  };

  const stopProfessionalDetection = () => {
    if (detectionInterval) { clearInterval(detectionInterval); setDetectionInterval(null); }
  };

  const togglePlay = async () => {
    const v = recordedVideoRef.current;
    if (!v) return;
    v.paused ? await v.play() : v.pause();
  };
  const handleLoadedMetadata = () => { if (recordedVideoRef.current) setDuration(recordedVideoRef.current.duration); };
  const handleTimeUpdate = () => { if (recordedVideoRef.current) setProgress((recordedVideoRef.current.currentTime / recordedVideoRef.current.duration) * 100); };
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setIsPlaying(false); setProgress(0);
    if (recordedVideoRef.current) recordedVideoRef.current.currentTime = 0;
  };
  useEffect(() => {
    const v = recordedVideoRef.current;
    if (!v) return;
    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("ended", handleEnded);
    return () => {
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("ended", handleEnded);
    };
  }, [videoUrl]);

  const seekVideo = e => {
    const v = recordedVideoRef.current;
    if (!v) return;
    v.currentTime = (Number(e.target.value) / 100) * v.duration;
    setProgress(Number(e.target.value));
  };
  const toggleMute = () => {
    const v = recordedVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const toggleFullscreen = () => {
    const c = videoContainerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) { c.requestFullscreen(); setFullscreen(true); }
    else { document.exitFullscreen(); setFullscreen(false); }
  };
  const removeVideo = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null); setVideoUrl(""); setTranscript("");
    setProgress(0); setDuration(0); setIsUploaded(false);
    setUploadProgress(0); setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl; a.download = "introduction-video.webm"; a.click();
  };
  const goBack = () => {
    if (recording) { showNotification("Please stop recording first.", "warning"); return; }
    if (cameraOpen) closeCamera();
    router.push("/careers-liaison-bank/candidate-dashboard");
  };
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "00:00";
    return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
  };

  if (!user) {
    return (
      <div className="studio-loading">
        <div className="studio-loader">
          <div className="studio-loader-ring"></div>
          <Loader2 className="spinner" />
        </div>
        <p>Preparing your studio...</p>
      </div>
    );
  }

  return (
    <div className="studio-page">
      {/* Notification */}
      {notification && (
        <div className={`studio-toast ${notification.type}`}>
          <div className="studio-toast-icon">
            {notification.type === "success" && <CheckCircle size={18} />}
            {notification.type === "error" && <AlertCircle size={18} />}
            {notification.type === "warning" && <AlertTriangle size={18} />}
            {notification.type === "info" && <AlertCircle size={18} />}
          </div>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}><X size={14} /></button>
        </div>
      )}

      {/* In-page navigation */}
      <div className="studio-page-nav">
        <button
          type="button"
          className="studio-back"
          onClick={goBack}
          aria-label="Back to Candidate Dashboard"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Hero Header */}
      <section className="studio-hero">
        <div className="studio-hero-content">
          <div className="studio-hero-badge">
            <Sparkles size={12} />
            <span>Professional Recording</span>
          </div>
          <h1>
            Record your <span className="studio-gradient-text">introduction</span>
          </h1>
          <p>Make a great first impression. Record a 1–2 minute video showcasing your skills and personality.</p>

          <div className="studio-hero-meta">
            {jobTitle && (
              <div className="studio-meta-chip">
                <Briefcase size={13} />
                <span>{decodeURIComponent(jobTitle)}</span>
              </div>
            )}
            {user?.email && (
              <div className="studio-meta-chip subtle">
                <Mail size={13} />
                <span>{user.email}</span>
              </div>
            )}
            {vacancyId && (
              <div className="studio-meta-chip subtle">
                <FileText size={13} />
                <span>ID: {vacancyId}</span>
              </div>
            )}
            <div className="studio-meta-chip subtle">
              <Clock size={13} />
              <span>1–2 min recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Studio Grid */}
      <main className="studio-grid">
        {/* MAIN VIDEO TILE */}
        <div className="studio-tile studio-tile--video">
          <div className="studio-tile-header">
            <div className="studio-tile-title">
              <div className={`studio-live-dot ${recording ? "live" : ""}`}></div>
              <span>{recording ? (paused ? "Paused" : "Recording") : cameraOpen ? "Live Preview" : "Studio"}</span>
            </div>
            {recording && (
              <div className="studio-timer">
                <span className="studio-timer-text">{displayTime}</span>
              </div>
            )}
          </div>

          <div className="studio-stage" ref={videoContainerRef}>
            {!videoUrl && !cameraOpen ? (
              <div className="studio-empty">
                <div className="studio-empty-icon">
                  <Camera size={32} />
                </div>
                <h3>Your stage is ready</h3>
                <p>Choose to record live or upload a pre-recorded video below.</p>
              </div>
            ) : !videoUrl && cameraOpen ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  muted={true}
                  mirrored={true}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                  videoConstraints={{ width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }}
                  className="studio-video"
                />
                <div className="studio-live-overlay">
                  <div className="studio-live-badge">
                    <div className="studio-live-pulse"></div>
                    <span>LIVE</span>
                  </div>
                  {cameraError && (
                    <div className="studio-error-card">
                      <AlertCircle size={18} />
                      <span>{cameraError}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {recording ? (
                  <Webcam
                    ref={webcamRef}
                    audio={true}
                    muted={true}
                    mirrored={true}
                    videoConstraints={{ width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }}
                    className="studio-video"
                  />
                ) : (
                  <video
                    ref={recordedVideoRef}
                    src={videoUrl}
                    className="studio-video"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    controls={false}
                  />
                )}

                {!recording && videoUrl && (
                  <div className="studio-player-controls">
                    <button className="studio-ctrl-btn" onClick={togglePlay}>
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <div className="studio-progress">
                      <div className="studio-progress-fill" style={{ width: `${progress}%` }} />
                      <input type="range" min="0" max="100" value={progress} onChange={seekVideo} className="studio-progress-slider" />
                    </div>
                    <span className="studio-time">{formatTime((progress / 100) * duration)} / {formatTime(duration)}</span>
                    <button className="studio-ctrl-btn" onClick={toggleMute}>
                      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button className="studio-ctrl-btn" onClick={toggleFullscreen}>
                      {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                )}

                {recording && (
                  <div className="studio-rec-overlay">
                    <div className="studio-rec-badge">
                      <div className="studio-rec-dot"></div>
                      <span>{paused ? "PAUSED" : "REC"}</span>
                      <span className="studio-rec-time">{displayTime}</span>
                    </div>
                    {!isProfessional && (
                      <div className="studio-warn-badge">
                        <AlertTriangle size={12} />
                        <span>Adjust setup</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Bar */}
          <div className="studio-action-bar">
            {cameraOpen && !recording && (
              <button className="studio-btn studio-btn--ghost" onClick={closeCamera}>
                <X size={15} /> Close Camera
              </button>
            )}
            {cameraOpen && !recording && (
              <button
                className="studio-btn studio-btn--primary"
                onClick={startRecording}
                disabled={!cameraReady || isStartingRecording}
              >
                {isStartingRecording ? <Loader2 className="spin" size={15} /> : <Radio size={15} />}
                {isStartingRecording ? "Starting..." : "Start Recording"}
              </button>
            )}
            {recording && (
              <>
                <button className="studio-btn studio-btn--ghost" onClick={pauseRecording}>
                  {paused ? <Play size={15} /> : <Pause size={15} />}
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  className="studio-btn studio-btn--danger"
                  onClick={stopRecording}
                  disabled={isStoppingRecording}
                >
                  {isStoppingRecording ? <Loader2 className="spin" size={15} /> : <Square size={15} />}
                  Stop
                </button>
              </>
            )}
            {!recording && videoUrl && (
              <>
                <button className="studio-btn studio-btn--ghost" onClick={removeVideo}>
                  <Trash2 size={15} /> Remove
                </button>
                <button className="studio-btn studio-btn--ghost" onClick={downloadVideo}>
                  <Download size={15} /> Download
                </button>
                <button
                  className="studio-btn studio-btn--primary"
                  onClick={uploadVideo}
                  disabled={uploading || isUploaded}
                >
                  {uploading ? (
                    <><Loader2 className="spin" size={15} /> Uploading {uploadProgress}%</>
                  ) : isUploaded ? (
                    <><CheckCircle size={15} /> Uploaded</>
                  ) : (
                    <><Upload size={15} /> Submit Video</>
                  )}
                </button>
              </>
            )}
          </div>

          {uploading && (
            <div className="studio-upload-bar">
              <div className="studio-upload-track">
                <div className="studio-upload-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {isUploaded && transcript && (
            <div className="studio-transcript">
              <h5>📝 Transcript</h5>
              <p>{transcript}</p>
            </div>
          )}
        </div>

        {/* SIDE COLUMN */}
        <div className="studio-side">
          {/* Source Tabs */}
          {!videoUrl && (
            <div className="studio-tile studio-tile--source">
              <div className="studio-tabs">
                <button
                  className={`studio-tab ${activeTab === "record" ? "active" : ""}`}
                  onClick={() => { setActiveTab("record"); if (!cameraOpen) openCamera(); }}
                >
                  <Camera size={14} />
                  <span>Record</span>
                </button>
                <button
                  className={`studio-tab ${activeTab === "upload" ? "active" : ""}`}
                  onClick={() => { setActiveTab("upload"); fileInputRef.current?.click(); }}
                >
                  <Upload size={14} />
                  <span>Upload</span>
                </button>
              </div>

              <div className="studio-source-body">
                {activeTab === "record" ? (
                  <div className="studio-source-record">
                    <div className="studio-source-visual">
                      <div className="studio-source-ring">
                        <Camera size={22} />
                      </div>
                    </div>
                    <h4>Record live</h4>
                    <p>Use your camera to record a fresh introduction. You'll see a preview before recording starts.</p>
                    {!termsAccepted && (
                      <button className="studio-btn studio-btn--outline" onClick={() => setShowTermsModal(true)}>
                        <Shield size={14} /> Accept terms to continue
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="studio-source-upload">
                    <label className="studio-dropzone">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={selectVideo}
                        style={{ display: "none" }}
                      />
                      <div className="studio-dropzone-icon">
                        <Upload size={22} />
                      </div>
                      <h4>Drop your video</h4>
                      <p>MP4, MOV, AVI, MKV, WEBM · Max 100MB</p>
                      <span className="studio-dropzone-cta">Browse files</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Score */}
          {recording && (
            <div className={`studio-tile studio-tile--score ${!isProfessional ? "warn" : ""}`}>
              <div className="studio-score-head">
                <div className="studio-score-title">
                  <Award size={15} />
                  <span>Professional Score</span>
                </div>
                <div className={`studio-score-value ${isProfessional ? "good" : "bad"}`}>
                  {Math.round(professionalScore)}
                </div>
              </div>
              <div className="studio-score-bar">
                <div className="studio-score-fill" style={{ width: `${professionalScore}%` }} />
              </div>
              <div className="studio-score-status">
                {isProfessional ? <UserCheck size={13} /> : <AlertTriangle size={13} />}
                <span>{isProfessional ? "Looking great!" : "Adjust your setup"}</span>
              </div>
              {detectionWarnings.length > 0 && !isProfessional && (
                <ul className="studio-score-warnings">
                  {detectionWarnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </div>
          )}

          {/* Instructions Accordion */}
          <div className={`studio-tile studio-tile--tips ${instructionsOpen ? "open" : ""}`}>
            <button className="studio-tips-toggle" onClick={() => setInstructionsOpen(!instructionsOpen)}>
              <div className="studio-tips-label">
                <Sparkles size={15} />
                <span>Recording tips</span>
              </div>
              <ChevronDown size={16} className={`studio-tips-chevron ${instructionsOpen ? "open" : ""}`} />
            </button>
            {instructionsOpen && (
              <div className="studio-tips-body">
                <div className="studio-tip">
                  <div className="studio-tip-num">01</div>
                  <div>
                    <strong>Dress professionally</strong>
                    <p>Formal attire, neutral background, clear face.</p>
                  </div>
                </div>
                <div className="studio-tip">
                  <div className="studio-tip-num">02</div>
                  <div>
                    <strong>Lighting matters</strong>
                    <p>Face the light source. Avoid backlighting.</p>
                  </div>
                </div>
                <div className="studio-tip">
                  <div className="studio-tip-num">03</div>
                  <div>
                    <strong>Speak clearly</strong>
                    <p>Introduce yourself, your role, and why you're a fit.</p>
                  </div>
                </div>
                <div className="studio-tip">
                  <div className="studio-tip-num">04</div>
                  <div>
                    <strong>Keep it concise</strong>
                    <p>Aim for 1–2 minutes. Be impactful.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="studio-tile studio-tile--stats">
            <div className="studio-stat">
              <Mic size={14} />
              <div>
                <strong>Clear audio</strong>
                <span>Quiet environment</span>
              </div>
            </div>
            <div className="studio-stat">
              <Clock size={14} />
              <div>
                <strong>1–2 min</strong>
                <span>Optimal length</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="studio-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="studio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="studio-modal-head">
              <div>
                <h3>Recording Terms</h3>
                <p>Please review before recording.</p>
              </div>
              <button onClick={() => setShowTermsModal(false)}><X size={18} /></button>
            </div>
            <div className="studio-modal-body">
              <div className="studio-term-block">
                <h5>Professional Appearance</h5>
                <ul>
                  <li>Formal attire required</li>
                  <li>Face clearly visible</li>
                  <li>Neutral background</li>
                  <li>Proper lighting</li>
                </ul>
              </div>
              <div className="studio-term-block">
                <h5>Recording Guidelines</h5>
                <ul>
                  <li>You must be the person in the video</li>
                  <li>1–3 minutes duration</li>
                  <li>Clear audio, minimal noise</li>
                  <li>Look directly at the camera</li>
                </ul>
              </div>
              <div className="studio-term-block">
                <h5>Content</h5>
                <ul>
                  <li>Professional language only</li>
                  <li>Be honest and authentic</li>
                  <li>No confidential information</li>
                </ul>
              </div>
              <button
                className={`studio-checkbox ${termsAccepted ? "checked" : ""}`}
                onClick={() => setTermsAccepted(!termsAccepted)}
              >
                {termsAccepted ? <CheckSquare size={16} /> : <SquareIcon size={16} />}
                <span>I agree to the terms and conditions</span>
              </button>
            </div>
            <div className="studio-modal-foot">
              <button className="studio-btn studio-btn--ghost" onClick={() => setShowTermsModal(false)}>Cancel</button>
              <button
                className="studio-btn studio-btn--primary"
                onClick={() => {
                  if (termsAccepted) { setShowTermsModal(false); openCamera(); }
                  else showNotification("Please accept the terms.", "error");
                }}
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntroductoryVideoPage() {
  return (
    <Suspense fallback={
      <div className="studio-loading">
        <div className="studio-loader">
          <div className="studio-loader-ring"></div>
          <Loader2 className="spinner" />
        </div>
        <p>Preparing your studio...</p>
      </div>
    }>
      <IntroductoryVideoContent />
    </Suspense>
  );
}