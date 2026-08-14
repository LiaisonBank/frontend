// app/careers-liaison-bank/jobs/components/JobDetailsModal.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import './JobDetailsModal.scss';
import { useRouter } from "next/navigation";

const JobDetailsModal = ({ job, isOpen, onClose, onRequireLogin }) => {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Reset states when job changes
  useEffect(() => {
    if (job) {
      setIsApplied(false);
      setIsApplying(false);
    }
  }, [job]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle body scroll when modal is open/closed
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.classList.add('modal-open');
      document.body.dataset.scrollY = String(scrollY);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      return () => {
        document.body.classList.remove('modal-open');
        const scrollY = parseInt(document.body.dataset.scrollY || '0');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        window.scrollTo(0, scrollY);
        delete document.body.dataset.scrollY;
      };
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  // Helper to safely extract string value from object
  const safeString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
      if (value.name) return value.name;
      if (value.title) return value.title;
      if (value.value) return value.value;
      return JSON.stringify(value);
    }
    return '';
  };

  // Helper to safely extract array from object
  const safeArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return value.split('\n').filter(item => item.trim());
      }
    }
    if (value && typeof value === 'object') {
      if (value.roles_and_responsibilities) {
        return safeArray(value.roles_and_responsibilities);
      }
      if (value.data) {
        return safeArray(value.data);
      }
      return Object.values(value).filter(v => v);
    }
    return [];
  };

  // --- Data Extraction Functions (no dummy data) ---
  const getJobTitle = () => {
    const title = job?.job_title || job?.title || '';
    return safeString(title);
  };
  
  const getCompany = () => {
    const company = job?.company || '';
    return safeString(company);
  };
  
  const getLocation = () => {
    const location = job?.location || job?.job_location || '';
    return safeString(location);
  };
  
  const getJobType = () => {
    const type = job?.employment_type || job?.type || job?.job_type || '';
    return safeString(type);
  };
  
  const getExperience = () => {
    if (job?.custom_min_experience !== undefined && job?.custom_max_experience !== undefined) {
      const min = job.custom_min_experience;
      const max = job.custom_max_experience;
      if (min && max) return `${min} - ${max} years`;
      if (min) return `${min}+ years`;
      if (max) return `Up to ${max} years`;
    }
    const exp = job?.experience_level || job?.experience || '';
    return safeString(exp);
  };

  const getDescription = () => {
    const desc = job?.description || job?.job_description || '';
    return safeString(desc);
  };

  const getSummary = () => {
    const summary = job?.job_summary || '';
    return safeString(summary);
  };

  const getResponsibilities = () => {
    const fields = [
      job?.custom_roles_and_responsibilities,
      job?.custom_responsibilities,
      job?.responsibilities,
      job?.duties,
      job?.roles_and_responsibilities,
      job?.job_roles
    ];
    
    for (const field of fields) {
      if (field) {
        const arr = safeArray(field);
        if (arr && arr.length > 0) {
          return arr.map(item => safeString(item));
        }
      }
    }
    
    return [];
  };

  const getSkills = () => {
    const fields = [
      job?.custom_required_skills,
      job?.custom_skills,
      job?.skills_required,
      job?.skills,
      job?.required_skills
    ];
    
    for (const field of fields) {
      if (field) {
        const arr = safeArray(field);
        if (arr && arr.length > 0) {
          return arr.map(item => safeString(item));
        }
      }
    }
    
    return [];
  };

  const getEducation = () => {
    const fields = [
      job?.education,
      job?.educational_requirements,
      job?.education_requirements
    ];
    
    for (const field of fields) {
      if (field) {
        const arr = safeArray(field);
        if (arr && arr.length > 0) {
          return arr.map(item => safeString(item));
        }
      }
    }
    
    return [];
  };

  const getRequirements = () => {
    const fields = [
      job?.custom_required_skills,
      job?.requirements,
      job?.qualifications,
      job?.custom_qualifications,
      job?.job_requirements
    ];
    
    for (const field of fields) {
      if (field) {
        const arr = safeArray(field);
        if (arr && arr.length > 0) {
          return arr.map(item => safeString(item));
        }
      }
    }
    
    return [];
  };

  const getSalary = () => {
    if (job?.salary) return safeString(job.salary);
    if (job?.salary_range) {
      if (typeof job.salary_range === 'string') return job.salary_range;
      if (typeof job.salary_range === 'object') {
        const { min, max } = job.salary_range;
        if (min && max) {
          return formatSalary(min, max);
        }
      }
    }
    if (job?.lower_range !== undefined && job?.upper_range !== undefined) {
      const lower = Number(job.lower_range);
      const upper = Number(job.upper_range);
      if (!isNaN(lower) && !isNaN(upper)) {
        return formatSalary(lower, upper);
      }
    }
    return '';
  };

  const formatSalary = (lower, upper) => {
    const formatIndianCurrency = (amount) => {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
      if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
      return `₹${Math.round(amount)}`;
    };
    
    const formattedLower = formatIndianCurrency(lower);
    const formattedUpper = formatIndianCurrency(upper);
    
    if (lower !== upper) {
      const lowerUnit = formattedLower.includes('Cr') ? 'Cr' : formattedLower.includes('L') ? 'L' : '';
      const upperUnit = formattedUpper.includes('Cr') ? 'Cr' : formattedUpper.includes('L') ? 'L' : '';
      
      if (lowerUnit && lowerUnit === upperUnit) {
        const lowerNum = parseFloat(formattedLower);
        const upperNum = parseFloat(formattedUpper);
        return `₹${lowerNum.toFixed(1)} - ${upperNum.toFixed(1)} ${upperUnit}`;
      }
      return `${formattedLower} - ${formattedUpper}`;
    }
    return formattedLower;
  };

  const getOpenings = () => {
    const openings = job?.vacancies || job?.openings || '';
    return safeString(openings);
  };
  
  const getApplyBefore = () => {
    const date = job?.closes_on || job?.apply_before || job?.deadline || job?.closing_date || '';
    return safeString(date);
  };
  
  const getJobId = () => {
    const id = job?.name || job?.id || job?.job_id || '';
    return safeString(id);
  };
  
  const getDepartment = () => {
    const dept = job?.department || '';
    return safeString(dept);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return safeString(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return safeString(dateString);
    }
  };

  // --- Event Handlers ---
  const handleApply = () => {
    const token = localStorage.getItem('career_token');
    const user = localStorage.getItem('career_user');

    if (token && user) {
      onClose();
      window.open(
        '/careers-liaison-bank/candidate-dashboard',
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    onClose();
    if (onRequireLogin) {
      onRequireLogin();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getJobTitle(),
        text: `Check out this opportunity: ${getJobTitle()} at ${getCompany()}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // --- Data ---
  const jobTitle = getJobTitle();
  const company = getCompany();
  const location = getLocation();
  const jobType = getJobType();
  const experience = getExperience();
  const description = getDescription();
  const summary = getSummary();
  const responsibilities = getResponsibilities();
  const skills = getSkills();
  const education = getEducation();
  const requirements = getRequirements();
  const salary = getSalary();
  const openings = getOpenings();
  const applyBefore = getApplyBefore();
  const jobId = getJobId();
  const department = getDepartment();

  // Check if there's any content to show
  const hasContent = jobTitle || company || location || description || 
                     responsibilities.length > 0 || skills.length > 0 || 
                     education.length > 0 || requirements.length > 0;

  if (!hasContent) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      onWheel={(e) => {
        e.stopPropagation();
        const element = e.currentTarget;
        if (e.deltaY !== 0) {
          element.scrollTop += e.deltaY;
        }
      }}
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- HEADER --- */}
        <div className="modal-header">
          <div className="modal-header-left">
            <button className="close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
            <div className="header-title">
              {jobTitle || 'Job Details'}
            </div>
          </div>
          <div className="modal-header-right">
            <button className="share-btn" onClick={handleShare} aria-label="Share">
              Share
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="modal-content-wrapper" ref={contentRef}>
          <div className="modal-content">
            
            {/* --- JOB TITLE --- */}
            {jobTitle && <h1 className="job-title">{jobTitle}</h1>}

            {/* --- JOB META --- */}
            {(company || location || jobType || openings || salary || experience) && (
              <div className="job-meta-grid">
                {company && (
                  <div className="meta-item">
                    <span className="meta-label">Company:</span>
                    <span>{company}</span>
                  </div>
                )}
                {location && (
                  <div className="meta-item">
                    <span className="meta-label">Location:</span>
                    <span>{location}</span>
                  </div>
                )}
                {jobType && (
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span>{jobType}</span>
                  </div>
                )}
                {openings && (
                  <div className="meta-item">
                    <span className="meta-label">Openings:</span>
                    <span>{openings}</span>
                  </div>
                )}
                {salary && (
                  <div className="meta-item highlight">
                    <span className="meta-label">Salary:</span>
                    <span>{salary}</span>
                  </div>
                )}
                {experience && (
                  <div className="meta-item">
                    <span className="meta-label">Experience:</span>
                    <span>{experience}</span>
                  </div>
                )}
              </div>
            )}

            {/* --- JOB DESCRIPTION --- */}
            {description && (
              <div className="info-section">
                <h2>Job Description</h2>
                <p>{description}</p>
              </div>
            )}

            {/* --- JOB SUMMARY --- */}
            {summary && (
              <div className="info-section">
                <h2>Job Summary</h2>
                <p>{summary}</p>
              </div>
            )}

            {/* --- ROLES AND RESPONSIBILITIES --- */}
            {responsibilities.length > 0 && (
              <div className="info-section">
                <h2>Roles and Responsibilities</h2>
                <ul className="list-items">
                  {responsibilities.map((resp, index) => (
                    <li key={index}>{safeString(resp)}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* --- REQUIRED SKILLS --- */}
            {skills.length > 0 && (
              <div className="info-section">
                <h2>Required Skills</h2>
                <div className="skills-grid">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{safeString(skill)}</span>
                  ))}
                </div>
              </div>
            )}

            {/* --- EDUCATION --- */}
            {education.length > 0 && (
              <div className="info-section">
                <h2>Education</h2>
                <ul className="list-items education-list">
                  {education.map((edu, index) => (
                    <li key={index}>{safeString(edu)}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* --- QUALIFICATIONS --- */}
            {requirements.length > 0 && (
              <div className="info-section">
                <h2>Qualifications</h2>
                <ul className="list-items qualifications-list">
                  {requirements.map((req, index) => (
                    <li key={index}>{safeString(req)}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* --- JOB INFO --- */}
            {(jobId || department || jobType || experience || applyBefore) && (
              <div className="job-info-footer">
                <h2>Job Information</h2>
                <div className="details-list">
                  {jobId && (
                    <div className="detail-item">
                      <span className="label">Job ID</span>
                      <span className="value">{jobId}</span>
                    </div>
                  )}
                  {department && (
                    <div className="detail-item">
                      <span className="label">Department</span>
                      <span className="value">{department}</span>
                    </div>
                  )}
                  {jobType && (
                    <div className="detail-item">
                      <span className="label">Employment Type</span>
                      <span className="value">{jobType}</span>
                    </div>
                  )}
                  {experience && (
                    <div className="detail-item">
                      <span className="label">Experience</span>
                      <span className="value">{experience}</span>
                    </div>
                  )}
                  {applyBefore && (
                    <div className="detail-item">
                      <span className="label">Apply Before</span>
                      <span className="value">{formatDate(applyBefore)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- APPLY BUTTON --- */}
            <div className="apply-section">
              <button 
                className="apply-btn"
                onClick={handleApply}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <span className="spinner" />
                    Applying...
                  </>
                ) : (
                  'APPLY NOW'
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;