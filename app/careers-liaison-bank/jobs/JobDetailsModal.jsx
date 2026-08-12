// app/careers-liaison-bank/jobs/components/JobDetailsModal.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Building,
  Share2,
  Bookmark,
  CheckCircle,
  Users,
  Award,
  Compass,
  Target,
  Wrench,
  HardHat,
  AlertCircle,
  Scale,
  FileCheck,
  Sparkles,
  ListChecks,
  CheckSquare,
  Star,
  Zap,
  Shield,
  Clock as ClockIcon,
  FileText,
  Layers,
  Gauge,
  Leaf,
  Network,
  Plug,
  ShieldCheck,
  FileCheck as FileCheckIcon,
  Hammer,
  Flag,
  Truck,
  ClipboardCheck,
  GraduationCap,
  Heart,
  ExternalLink
} from 'lucide-react';
import './JobDetailsModal.scss';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Reset states when job changes
  useEffect(() => {
    if (job) {
      setIsApplied(false);
      setIsApplying(false);
      setActiveTab('overview');
      setImageError(false);
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
      
      // Focus trap
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

  // --- Data Extraction Functions ---
  const getJobTitle = () => job.job_title || job.title || 'Position';
  const getCompany = () => job.company || 'Adani';
  const getLocation = () => job.location || job.job_location || 'Mundra, Gujarat, India';
  const getJobType = () => job.employment_type || job.type || job.job_type || 'Full-time';
  
  const getExperience = () => {
    if (job.custom_min_experience !== undefined && job.custom_max_experience !== undefined) {
      const min = job.custom_min_experience;
      const max = job.custom_max_experience;
      if (min && max) return `${min} - ${max} years`;
      if (min) return `${min}+ years`;
      if (max) return `Up to ${max} years`;
    }
    return job.experience_level || job.experience || '15-18 years';
  };

  const getDescription = () => {
    return job.description || job.job_description || job.job_summary || 
      'Lead the on-site execution of wind power projects with a strong focus on technical precision and safety.';
  };

  const getResponsibilities = () => {
    if (job.custom_responsibilities) {
      if (typeof job.custom_responsibilities === 'string') {
        return job.custom_responsibilities.split('\n').filter(r => r.trim());
      }
      if (Array.isArray(job.custom_responsibilities)) {
        return job.custom_responsibilities;
      }
    }
    if (job.responsibilities && Array.isArray(job.responsibilities)) return job.responsibilities;
    if (job.duties && Array.isArray(job.duties)) return job.duties;
    if (typeof job.responsibilities === 'string') return job.responsibilities.split('\n').filter(r => r.trim());
    
    // Default responsibilities from the job data
    return [
      'Technical - Lead on-site execution of wind power projects with technical precision and safety, overseeing foundation works, WTG erection, crane operations, lifting activities, work-at-height procedures, 33KV network and PSS and EHV line work.',
      'Managerial - Plan and lead end-to-end project execution, including resource mobilization, contractor coordination, and site logistics.',
      'Strategic - Align construction activities with overall project goals and business strategy. Identify risks and opportunities to optimize execution.',
      'Financial/P&L - Monitor budget utilization and control construction costs. Validate contractor bills and ensure timely certification.',
      'Quality/Safety - Ensure strict compliance with quality standards and safety protocols. Implement risk assessments and safe work practices.',
      'Business Risk - Identify and mitigate risks related to construction delays, vendor performance, and regulatory issues.',
      'Statutory/Regulatory Compliance - Ensure all construction activities comply with local laws and grid regulations.'
    ];
  };

  const getRequirements = () => {
    if (job.custom_skills) {
      if (typeof job.custom_skills === 'string') {
        return job.custom_skills.split('\n').filter(r => r.trim());
      }
      if (Array.isArray(job.custom_skills)) {
        return job.custom_skills;
      }
    }
    if (job.requirements && Array.isArray(job.requirements)) return job.requirements;
    if (job.qualifications && Array.isArray(job.qualifications)) return job.qualifications;
    if (job.skills_required && Array.isArray(job.skills_required)) return job.skills_required;
    if (typeof job.requirements === 'string') return job.requirements.split('\n').filter(r => r.trim());
    
    // Default requirements from the job data
    return [
      'Bachelor\'s degree in engineering (Electrical/Mechanical) with MBA or equivalent preferred.',
      'Minimum 15-18 years of experience in leading Wind project execution, Power Sector, infra. Sector.',
      'Proven track record in project execution and scaling renewable energy businesses.',
      'PMP Certification has an added advantage.',
      'Strong commercial acumen, stakeholder management, and people leadership skills.'
    ];
  };

  const getSalary = () => {
    if (job.salary) return job.salary;
    if (job.salary_range) {
      if (typeof job.salary_range === 'string') return job.salary_range;
      if (typeof job.salary_range === 'object') {
        const { min, max, currency } = job.salary_range;
        if (min && max) {
          return formatSalary(min, max, currency);
        }
      }
    }
    if (job.lower_range !== undefined && job.upper_range !== undefined) {
      const lower = Number(job.lower_range);
      const upper = Number(job.upper_range);
      if (!isNaN(lower) && !isNaN(upper)) {
        return formatSalary(lower, upper, job.currency || 'INR');
      }
    }
    return null;
  };

  const formatSalary = (lower, upper, currency = 'INR') => {
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

  const getPostedDate = () => job.posted_on || job.posted_date || job.creation || job.created_at || new Date().toISOString();
  const getApplyBefore = () => job.closes_on || job.apply_before || job.deadline || job.closing_date || null;
  const getJobId = () => job.name || job.id || job.job_id || '56285';
  const getOpenings = () => job.vacancies || job.openings || 1;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // --- UI Helpers ---
  const getResponsibilityIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('technical')) return <Wrench size={18} />;
    if (lower.includes('managerial')) return <Users size={18} />;
    if (lower.includes('strategic')) return <Compass size={18} />;
    if (lower.includes('financial') || lower.includes('p&l') || lower.includes('budget')) return <DollarSign size={18} />;
    if (lower.includes('quality') || lower.includes('safety')) return <HardHat size={18} />;
    if (lower.includes('risk')) return <AlertCircle size={18} />;
    if (lower.includes('statutory') || lower.includes('regulatory') || lower.includes('compliance')) return <Scale size={18} />;
    if (lower.includes('license') || lower.includes('permit') || lower.includes('approval')) return <FileCheck size={18} />;
    if (lower.includes('liaise') || lower.includes('government') || lower.includes('municipal')) return <Building size={18} />;
    if (lower.includes('document') || lower.includes('record')) return <FileText size={18} />;
    return <Target size={18} />;
  };

  const getResponsibilityColor = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('technical')) return '#2563eb';
    if (lower.includes('managerial')) return '#7c3aed';
    if (lower.includes('strategic')) return '#d97706';
    if (lower.includes('financial') || lower.includes('p&l')) return '#16a34a';
    if (lower.includes('quality') || lower.includes('safety')) return '#dc2626';
    if (lower.includes('risk')) return '#ea580c';
    if (lower.includes('statutory') || lower.includes('regulatory')) return '#0891b2';
    return '#6b7280';
  };

  // --- Event Handlers ---
  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
    }, 1500);
  };

  const handleBookmark = () => setIsBookmarked(!isBookmarked);
  
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
  const responsibilities = getResponsibilities();
  const requirements = getRequirements();
  const salary = getSalary();

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          if (contentRef.current) {
            contentRef.current.scrollTop += e.deltaY;
            e.preventDefault();
          }
        }}
      >
        {/* --- HEADER --- */}
        <div className="modal-header">
          <div className="modal-header-left">
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <X size={24} />
            </button>
            <div className="header-breadcrumb">
              <span>Careers</span>
              <span className="separator">/</span>
              <span>{getCompany()}</span>
              <span className="separator">/</span>
              <span className="current">{getJobTitle().substring(0, 30)}...</span>
            </div>
          </div>
          <div className="modal-header-right">
            <button className="action-btn" onClick={handleBookmark} aria-label="Bookmark">
              <Bookmark size={20} fill={isBookmarked ? '#f97316' : 'none'} stroke={isBookmarked ? '#f97316' : '#94a3b8'} />
            </button>
            <button className="action-btn" onClick={handleShare} aria-label="Share">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="modal-content-wrapper" ref={contentRef}>
          <div className="modal-content">
            
            {/* --- HERO SECTION --- */}
            <div className="hero-section">
              <div className="hero-badge">
                <div className="badge-icon">
                  <Zap size={14} />
                </div>
                <span>Wind Energy</span>
                <span className="badge-dot">•</span>
                <span>Renewable</span>
              </div>
              
              <h1 id="job-modal-title" className="hero-title">{getJobTitle()}</h1>
              
              <div className="hero-meta">
                <div className="meta-item">
                  <div className="meta-icon"><Building size={16} /></div>
                  <span>{getCompany()}</span>
                </div>
                <div className="meta-divider" />
                <div className="meta-item">
                  <div className="meta-icon"><MapPin size={16} /></div>
                  <span>{getLocation()}</span>
                </div>
                <div className="meta-divider" />
                <div className="meta-item">
                  <div className="meta-icon"><Briefcase size={16} /></div>
                  <span>{getJobType()}</span>
                </div>
              </div>

              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#e8f5e9', color: '#16a34a' }}>
                    <Calendar size={18} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Posted</span>
                    <span className="stat-value">{formatDate(getPostedDate())}</span>
                  </div>
                </div>
                {getApplyBefore() && (
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff3e0', color: '#ea580c' }}>
                      <ClockIcon size={18} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Apply Before</span>
                      <span className="stat-value">{formatDate(getApplyBefore())}</span>
                    </div>
                  </div>
                )}
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#e3f2fd', color: '#2563eb' }}>
                    <Users size={18} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Vacancies</span>
                    <span className="stat-value">{getOpenings()}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fce4ec', color: '#dc2626' }}>
                    <Award size={18} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Experience</span>
                    <span className="stat-value">{getExperience()}</span>
                  </div>
                </div>
                {salary && (
                  <div className="stat-card highlight">
                    <div className="stat-icon" style={{ background: '#fef3e8', color: '#f97316' }}>
                      <DollarSign size={18} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Salary</span>
                      <span className="stat-value">{salary}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- ACTION BAR --- */}
            <div className="action-bar">
              <div className="action-left">
                {isApplied ? (
                  <div className="applied-status">
                    <CheckCircle size={24} />
                    <div>
                      <strong>Application Submitted!</strong>
                      <span>We'll review your application and get back to you soon.</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="apply-btn primary"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <>
                        <span className="spinner" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Apply Now
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="action-right">
                <button className="apply-btn secondary" onClick={handleBookmark}>
                  <Heart size={18} fill={isBookmarked ? '#f97316' : 'none'} stroke={isBookmarked ? '#f97316' : '#64748b'} />
                  {isBookmarked ? 'Saved' : 'Save Job'}
                </button>
                <button className="apply-btn secondary" onClick={handleShare}>
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>

            {/* --- TABS --- */}
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FileText size={16} />
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'responsibilities' ? 'active' : ''}`}
                onClick={() => setActiveTab('responsibilities')}
              >
                <ListChecks size={16} />
                Responsibilities
              </button>
              <button 
                className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
                onClick={() => setActiveTab('requirements')}
              >
                <CheckSquare size={16} />
                Qualifications
              </button>
            </div>

            {/* --- TAB CONTENT --- */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  <div className="content-block">
                    <h3>
                      <Compass size={18} />
                      About the Role
                    </h3>
                    <p>{getDescription()}</p>
                  </div>

                  <div className="content-block">
                    <h3>
                      <Target size={18} />
                      Key Highlights
                    </h3>
                    <div className="highlight-grid">
                      <div className="highlight-item">
                        <div className="highlight-icon" style={{ background: '#e8f5e9', color: '#16a34a' }}>
                          <Leaf size={20} />
                        </div>
                        <div>
                          <strong>Renewable Energy</strong>
                          <span>Wind Power Projects</span>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <div className="highlight-icon" style={{ background: '#e3f2fd', color: '#2563eb' }}>
                          <Gauge size={20} />
                        </div>
                        <div>
                          <strong>Technical Leadership</strong>
                          <span>WTG Erection & EHV Line Work</span>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <div className="highlight-icon" style={{ background: '#fce4ec', color: '#dc2626' }}>
                          <Shield size={20} />
                        </div>
                        <div>
                          <strong>Safety First</strong>
                          <span>Work-at-Height & Crane Operations</span>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <div className="highlight-icon" style={{ background: '#fff3e0', color: '#ea580c' }}>
                          <Network size={20} />
                        </div>
                        <div>
                          <strong>Grid Integration</strong>
                          <span>33KV Network & PSS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="content-block">
                    <h3>
                      <Layers size={18} />
                      Job Details
                    </h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Employment Type</span>
                        <span className="detail-value">{getJobType()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{getLocation()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Experience</span>
                        <span className="detail-value">{getExperience()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Vacancies</span>
                        <span className="detail-value">{getOpenings()}</span>
                      </div>
                      {salary && (
                        <div className="detail-item">
                          <span className="detail-label">Salary</span>
                          <span className="detail-value">{salary}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Department</span>
                        <span className="detail-value">{job.department || 'Wind Energy'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Job ID</span>
                        <span className="detail-value">{getJobId()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Posted</span>
                        <span className="detail-value">{formatDate(getPostedDate())}</span>
                      </div>
                    </div>
                  </div>

                  <div className="note-box">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Important Note</strong>
                      <span>Adani does not charge any fee at any stage of the recruitment process and has not authorized any individual/agencies/partners to collect any fee for recruitment.</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'responsibilities' && (
                <div className="responsibilities-content">
                  <div className="content-block">
                    <h3>
                      <ListChecks size={18} />
                      Key Responsibilities
                    </h3>
                    <ul className="responsibility-list">
                      {responsibilities.map((resp, index) => (
                        <li key={index}>
                          <div 
                            className="resp-icon" 
                            style={{ 
                              background: `${getResponsibilityColor(resp)}15`, 
                              color: getResponsibilityColor(resp) 
                            }}
                          >
                            {getResponsibilityIcon(resp)}
                          </div>
                          <div className="resp-text">{resp}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="requirements-content">
                  <div className="content-block">
                    <h3>
                      <GraduationCap size={18} />
                      Qualifications & Requirements
                    </h3>
                    <ul className="requirements-list">
                      {requirements.map((req, index) => (
                        <li key={index}>
                          <CheckCircle size={18} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="content-block">
                    <h3>
                      <Star size={18} />
                      Preferred Skills
                    </h3>
                    <div className="skills-grid">
                      <div className="skill-tag">
                        <span>Project Management</span>
                      </div>
                      <div className="skill-tag">
                        <span>Stakeholder Management</span>
                      </div>
                      <div className="skill-tag">
                        <span>Commercial Acumen</span>
                      </div>
                      <div className="skill-tag">
                        <span>Team Leadership</span>
                      </div>
                      <div className="skill-tag">
                        <span>Regulatory Compliance</span>
                      </div>
                      <div className="skill-tag">
                        <span>Risk Management</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- FOOTER --- */}
            <div className="modal-footer">
              <div className="footer-left">
                <span className="footer-id">Job ID: {getJobId()}</span>
                <span className="footer-divider">•</span>
                <span className="footer-date">Posted: {formatDate(getPostedDate())}</span>
              </div>
              <div className="footer-right">
                <button className="footer-btn primary" onClick={handleApply}>
                  <ExternalLink size={16} />
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;