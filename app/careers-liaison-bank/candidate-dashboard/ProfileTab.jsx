"use client";

import { BadgeCheck, CheckCircle, Edit2, Eye, FileText, Save, X } from "lucide-react";

export default function ProfileTab({ user, isEditing, setIsEditing, formData, setFormData, handleResumeChange, resume, resumeFile, resumeUploading, handleSaveProfile, setResumeFile }) {
    return (
        <div className={`profile-section ${isEditing ? 'profile-edit-mode' : 'profile-view-mode'}`}>
                                        {/* Profile Header */}
                                        <div className="profile-header-card">
                                            <div className="profile-avatar-large">
                                                {user?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="profile-header-info">
                                                <h2>{user?.full_name || 'Candidate'}</h2>
                                                <p className="profile-email">{user?.email || 'email@example.com'}</p>
                                                <div className="profile-badges">
                                                    <span className="badge verified">
                                                        <BadgeCheck size={14} />
                                                        Verified Profile
                                                    </span>
                                                    <span className="badge complete">
                                                        <CheckCircle size={14} />
                                                        Profile Complete
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="btn-edit-profile"
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                                                {isEditing ? 'Cancel' : 'Edit Profile'}
                                            </button>
                                        </div>

                                        {/* Profile Content */}
                                        <div className="profile-content">
                                            {isEditing ? (
                                                // Edit Mode
                                                <div className="profile-edit-form">
                                                    {/* Personal Information */}
                                                    <div className="form-section">
                                                        <h4>Personal Information</h4>
                                                        <div className="form-grid">
                                                            <div className="form-group">
                                                                <label>Full Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.full_name || ''}
                                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Email</label>
                                                                <input
                                                                    type="email"
                                                                    value={formData.email || ''}
                                                                    disabled
                                                                    className="disabled"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Phone</label>
                                                                <input
                                                                    type="tel"
                                                                    value={formData.phone || ''}
                                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Gender</label>
                                                                <select
                                                                    value={formData.gender || ''}
                                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Date of Birth</label>
                                                                <input
                                                                    type="date"
                                                                    value={formData.date_of_birth || ''}
                                                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Address</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.address || ''}
                                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                    placeholder="Street Address"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>City</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.city || ''}
                                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                                    placeholder="City"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>State</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.state || ''}
                                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                                    placeholder="State"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Country</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.country || 'India'}
                                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                                    placeholder="Country"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Pincode</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.pincode || ''}
                                                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                                    placeholder="Pincode"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Professional Information */}
                                                    <div className="form-section">
                                                        <h4>Professional Information</h4>
                                                        <div className="form-grid">
                                                            <div className="form-group">
                                                                <label>Current Company</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.current_company || ''}
                                                                    onChange={(e) => setFormData({ ...formData, current_company: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Current Designation</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.current_designation || ''}
                                                                    onChange={(e) => setFormData({ ...formData, current_designation: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Total Experience (Years)</label>
                                                                <input
                                                                    type="number"
                                                                    value={formData.total_experience || ''}
                                                                    onChange={(e) => setFormData({ ...formData, total_experience: e.target.value })}
                                                                    placeholder="Years"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Current CTC (LPA)</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.current_ctc || ''}
                                                                    onChange={(e) => setFormData({ ...formData, current_ctc: e.target.value })}
                                                                    placeholder="₹ LPA"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Expected CTC (LPA)</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.expected_ctc || ''}
                                                                    onChange={(e) => setFormData({ ...formData, expected_ctc: e.target.value })}
                                                                    placeholder="₹ LPA"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Notice Period (Days)</label>
                                                                <input
                                                                    type="number"
                                                                    value={formData.notice_period || ''}
                                                                    onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
                                                                    placeholder="Days"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Education */}
                                                    <div className="form-section">
                                                        <h4>Education</h4>
                                                        <div className="form-grid">
                                                            <div className="form-group">
                                                                <label>Highest Qualification</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.highest_qualification || ''}
                                                                    onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Specialization</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.specialization || ''}
                                                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>University</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.university || ''}
                                                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Graduation Year</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.graduation_year || ''}
                                                                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                                                                    placeholder="YYYY"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Skills & Resume */}
                                                    <div className="form-section">
                                                        <h4>Skills & Documents</h4>
                                                        <div className="form-grid">
                                                            <div className="form-group full-width">
                                                                <label>Skills <span className="hint">(comma separated)</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.skills || ''}
                                                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                                                    placeholder="e.g. React, Python, SQL, Project Management"
                                                                />
                                                                <small className="field-hint">Add your skills to get better job recommendations</small>
                                                            </div>

                                                            <div className="form-group full-width">
                                                                <label>Resume</label>
                                                                <div className="resume-upload-wrapper">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx"
                                                                        onChange={handleResumeChange}
                                                                        className="resume-file-input"
                                                                        id="resume-upload"
                                                                    />
                                                                    <label htmlFor="resume-upload" className="resume-upload-label">
                                                                        <div className="upload-icon">
                                                                            <FileText size={24} />
                                                                        </div>
                                                                        <div className="upload-text">
                                                                            <span className="upload-main-text">Click to upload or drag and drop</span>
                                                                            <span className="upload-sub-text">PDF, DOC, DOCX (Max 5MB)</span>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                                {resumeFile && (
                                                                    <div className="selected-file">
                                                                        <FileText size={16} />
                                                                        <span>{resumeFile.name}</span>
                                                                        <button
                                                                            className="remove-file"
                                                                            onClick={() => {
                                                                                setResumeFile(null);
                                                                                setFormData({ ...formData, resume: '' });
                                                                                document.getElementById('resume-upload').value = '';
                                                                            }}
                                                                        >
                                                                            <X size={16} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {user?.resume && !resumeFile && (
                                                                    <div className="existing-resume">
                                                                        <FileText size={16} />
                                                                        <span>Current: {user.resume?.split('/').pop() || 'Resume'}</span>
                                                                        <a href={user.resume} target="_blank" rel="noopener noreferrer" className="view-resume-link">
                                                                            <Eye size={14} /> View
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="form-group full-width">
                                                                <label>Career Summary</label>
                                                                <textarea
                                                                    value={formData.career_summary || ''}
                                                                    onChange={(e) => setFormData({ ...formData, career_summary: e.target.value })}
                                                                    placeholder="Brief summary of your career..."
                                                                    rows="3"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Social Links */}
                                                    <div className="form-section">
                                                        <h4>Social Links</h4>
                                                        <div className="form-grid">
                                                            <div className="form-group">
                                                                <label>LinkedIn</label>
                                                                <input
                                                                    type="url"
                                                                    value={formData.linkedin_url || ''}
                                                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                                                    placeholder="https://linkedin.com/in/..."
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Portfolio</label>
                                                                <input
                                                                    type="url"
                                                                    value={formData.portfolio_url || ''}
                                                                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                                                                    placeholder="https://your-portfolio.com"
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>GitHub</label>
                                                                <input
                                                                    type="url"
                                                                    value={formData.github_url || ''}
                                                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                                                    placeholder="https://github.com/..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-actions">
                                                        <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="btn-save"
                                                            onClick={handleSaveProfile}
                                                            disabled={resumeUploading}
                                                        >
                                                            {resumeUploading ? (
                                                                <>
                                                                    <span className="spinner"></span>
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save size={16} />
                                                                    Save Changes
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode - Display Profile
                                                <div className="profile-display">
                                                    {/* Personal Details */}
                                                    <div className="info-section personal-details">
                                                        <h4>Personal Details</h4>
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <span className="info-label">Full Name</span>
                                                                <span className="info-value">{user?.full_name || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Email</span>
                                                                <span className="info-value">{user?.email || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Phone</span>
                                                                <span className="info-value">{user?.phone || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Gender</span>
                                                                <span className="info-value">{user?.gender || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Date of Birth</span>
                                                                <span className="info-value">
                                                                    {user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                                                                </span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Address</span>
                                                                <span className="info-value">{user?.address || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Location</span>
                                                                <span className="info-value">
                                                                    {[user?.city, user?.state, user?.country].filter(Boolean).join(', ') || 'Not provided'}
                                                                </span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Pincode</span>
                                                                <span className="info-value">{user?.pincode || 'Not provided'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Professional Details */}
                                                    <div className="info-section professional-details">
                                                        <h4>Professional Details</h4>
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <span className="info-label">Current Company</span>
                                                                <span className="info-value">{user?.current_company || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Current Designation</span>
                                                                <span className="info-value">{user?.current_designation || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Total Experience</span>
                                                                <span className="info-value">{user?.total_experience || '0'} years</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Current CTC</span>
                                                                <span className="info-value">{user?.current_ctc || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Expected CTC</span>
                                                                <span className="info-value">{user?.expected_ctc || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Notice Period</span>
                                                                <span className="info-value">{user?.notice_period || 'Not provided'} days</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Education */}
                                                    <div className="info-section education-details">
                                                        <h4>Education</h4>
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <span className="info-label">Highest Qualification</span>
                                                                <span className="info-value">{user?.highest_qualification || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Specialization</span>
                                                                <span className="info-value">{user?.specialization || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">University</span>
                                                                <span className="info-value">{user?.university || 'Not provided'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <span className="info-label">Graduation Year</span>
                                                                <span className="info-value">{user?.graduation_year || 'Not provided'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Skills & Links */}
                                                    <div className="info-section skills-links">
                                                        <h4>Skills & Links</h4>
                                                        <div className="info-grid">
                                                            <div className="info-item full-width">
                                                                <span className="info-label">Skills</span>
                                                                <span className="info-value skills-tags">
                                                                    {user?.skills ? (
                                                                        user.skills.split(',').map((skill, i) => (
                                                                            <span key={i} className="skill-tag">{skill.trim()}</span>
                                                                        ))
                                                                    ) : 'Not provided'}
                                                                </span>
                                                            </div>
                                                            <div className="info-item full-width">
                                                                <span className="info-label">Career Summary</span>
                                                                <span className="info-value">{user?.career_summary || 'Not provided'}</span>
                                                            </div>
                                                            {user?.linkedin_url && (
                                                                <div className="info-item">
                                                                    <span className="info-label">LinkedIn</span>
                                                                    <span className="info-value">
                                                                        <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer">
                                                                            View Profile
                                                                        </a>
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {user?.portfolio_url && (
                                                                <div className="info-item">
                                                                    <span className="info-label">Portfolio</span>
                                                                    <span className="info-value">
                                                                        <a href={user.portfolio_url} target="_blank" rel="noopener noreferrer">
                                                                            Visit Portfolio
                                                                        </a>
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {user?.github_url && (
                                                                <div className="info-item">
                                                                    <span className="info-label">GitHub</span>
                                                                    <span className="info-value">
                                                                        <a href={user.github_url} target="_blank" rel="noopener noreferrer">
                                                                            View GitHub
                                                                        </a>
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {user?.resume && (
                                                                <div className="info-item full-width">
                                                                    <span className="info-label">Resume</span>
                                                                    <span className="info-value">
                                                                        <a href={`${process.env.NEXT_PUBLIC_LOCAL_API_URL}${user.resume}`} target="_blank" rel="noopener noreferrer" className="view-resume-link">
                                                                            <Eye size={14} /> View Resume
                                                                        </a>
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
    );
}
