"use client";

import { BriefcaseIcon, CheckCircle, Clock, Edit2, Eye, FileText, RefreshCw, Search, Star, XCircle } from "lucide-react";

export default function OverviewTab({ user, stats, isRefreshing, jobRecommendations, setActiveTab, refreshAllData, handleApply }) {
    return (
        <div className="overview-section">
            <div className="dashboard-intro">
                <div>
                    <span className="dashboard-eyebrow">LIAISON BANK · CAREER PORTAL</span>
                    <h1>Welcome back, {user?.full_name?.split(' ')[0] || 'Candidate'}</h1>
                    <p>Manage your profile, explore opportunities and keep track of your career journey.</p>
                </div>
            </div>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <FileText size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Applications</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon active">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.active}</span>
                        <span className="stat-label">Passed Exams</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon interview">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.interviews}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon rejected">
                        <XCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.rejected}</span>
                        <span className="stat-label">Failed Exams</span>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-grid">
                    <button className="action-card" onClick={() => setActiveTab('jobs')}>
                        <Search size={24} />
                        <span>Browse Jobs</span>
                    </button>
                    <button className="action-card" onClick={() => setActiveTab('profile')}>
                        <Edit2 size={24} />
                        <span>Update Profile</span>
                    </button>
                    <button className="action-card" onClick={() => setActiveTab('applications')}>
                        <Eye size={24} />
                        <span>Track Applications</span>
                    </button>
                    <button className="action-card" onClick={refreshAllData}>
                        <RefreshCw size={24} className={isRefreshing ? 'spinning' : ''} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
                    </button>
                </div>
            </div>

            <div className="recent-activity">
                <h3>Job Openings For You</h3>
                <p className="recommendation-subtitle">
                    {user?.skills ? (
                        `Based on your skills: ${user.skills}`
                    ) : (
                        'Based on your profile and preferences'
                    )}
                </p>
                <div className="activity-list">
                    {jobRecommendations.length > 0 ? (
                        jobRecommendations.map(job => (
                            <div key={job.id} className="activity-item job-recommendation">
                                <div className="activity-icon">
                                    <BriefcaseIcon size={20} />
                                </div>
                                <div className="activity-content">
                                    <p className="activity-title">{job.title}</p>
                                    <span className="activity-detail">{job.department} • {job.location}</span>
                                    <div className="activity-meta">
                                        <span className="activity-time">{job.salary}</span>
                                        {job.recommendationScore && (
                                            <span className="recommendation-score">
                                                <Star size={12} />
                                                {Math.round(job.recommendationScore)}% Match
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="btn-apply-small"
                                    onClick={() => handleApply(job)}
                                    disabled={!job.is_eligible}
                                >
                                    {job.has_taken_exam ? 'Exam Taken' : 'Apply Now'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state-small">
                            <p>No job recommendations available. Update your profile with skills and preferences to get personalized recommendations.</p>
                            <button
                                className="btn-primary-small"
                                onClick={() => setActiveTab('profile')}
                            >
                                Update Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
