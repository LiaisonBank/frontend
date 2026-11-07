"use client";

import { Briefcase, Building2, Calendar, CheckCircle, Clock, Eye, FileText, MapPin, XCircle } from "lucide-react";

export default function ApplicationsTab({ applications, setActiveTab, router, showNotification }) {
    return (
        <div className="applications-section">
                                        <div className="section-header">
                                            <div>
                                                <h2>My Applications</h2>
                                                <p>Track the status of all your job applications and exam results</p>
                                            </div>
                                            <button className="btn-primary" onClick={() => setActiveTab('jobs')}>
                                                Browse More Jobs
                                            </button>
                                        </div>

                                        {applications.length > 0 ? (
                                            <div className="applications-list">
                                                {applications.map((app) => (
                                                    <div key={app.id} className="application-card">
                                                        <div className="app-header">
                                                            <div className="app-title">
                                                                <h4>{app.job_title}</h4>
                                                                <span className="app-department">{app.department}</span>
                                                            </div>
                                                            <div className={`app-status ${app.exam_status === 'Pass' || app.exam_status === 'pass' || app.exam_status === 'PASS' ? 'accepted' : app.exam_status === 'Fail' || app.exam_status === 'fail' || app.exam_status === 'FAIL' ? 'rejected' : 'pending'}`}>
                                                                {app.exam_status === 'Pass' || app.exam_status === 'pass' || app.exam_status === 'PASS' ? (
                                                                    <CheckCircle size={16} />
                                                                ) : app.exam_status === 'Fail' || app.exam_status === 'fail' || app.exam_status === 'FAIL' ? (
                                                                    <XCircle size={16} />
                                                                ) : (
                                                                    <Clock size={16} />
                                                                )}
                                                                <span>{app.exam_status === 'Pass' || app.exam_status === 'pass' || app.exam_status === 'PASS' ? 'Passed' : app.exam_status === 'Fail' || app.exam_status === 'fail' || app.exam_status === 'FAIL' ? 'Failed' : 'Pending'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="app-details">
                                                            <div className="app-meta">
                                                                <span><Building2 size={14} /> {app.company}</span>
                                                                <span><MapPin size={14} /> {app.location}</span>
                                                                <span><Briefcase size={14} /> {app.type}</span>
                                                                <span><Calendar size={14} /> Completed: {app.exam_completed_at ? new Date(app.exam_completed_at).toLocaleDateString() : 'N/A'}</span>
                                                            </div>

                                                            {/* Exam Result Section */}
                                                            <div className="app-exam-result">
                                                                <div className="exam-result-header">
                                                                    <span className="exam-result-label">Exam Result</span>
                                                                </div>
                                                                <div className="exam-result-details">

                                                                    <div className="exam-score">
                                                                        Score: <strong>{app.exam_score || 0}%</strong>
                                                                    </div>
                                                                    <div className="exam-detail-item">
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            {/* View Details Button with Validation */}
                                                            <button
                                                                className={`btn-view-details ${app.has_introductory_video ? 'disabled' : ''}`}
                                                                onClick={() => {
                                                                    if (app.has_introductory_video) {
                                                                        const videoInfo = app.introductory_video;
                                                                        let message = '📹 You have already uploaded an introductory video for this position.';
                                                                        if (videoInfo) {
                                                                            message = `📹 Video uploaded on ${new Date(videoInfo.created_at).toLocaleDateString()}`;
                                                                            if (videoInfo.video_path) {
                                                                                message += `\n📁 File: ${videoInfo.video_path.split('/').pop()}`;
                                                                            }
                                                                            if (videoInfo.transcript && videoInfo.transcript !== 'No speech detected.') {
                                                                                message += `\n📝 Transcript: ${videoInfo.transcript.substring(0, 100)}...`;
                                                                            }
                                                                        }
                                                                        showNotification(message, 'warning', 8000);
                                                                    } else {
                                                                        router.push(`/careers-liaison-bank/introductory-video?vacancy_id=${app.vacancy_id}&job_title=${encodeURIComponent(app.job_title)}`);
                                                                    }
                                                                }}
                                                                disabled={app.has_introductory_video}
                                                            >
                                                                <Eye size={14} />
                                                                {app.has_introductory_video ? 'Video Uploaded' : 'View Details'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <FileText size={64} />
                                                <h3>No Applications Yet</h3>
                                                <p>Start applying to positions that match your skills and experience</p>
                                                <button className="btn-browse-jobs" onClick={() => setActiveTab('jobs')}>
                                                    Browse Jobs
                                                </button>
                                            </div>
                                        )}
                                    </div>
    );
}
