// app/careers-liaison-bank/jobs/components/JobDetailsModal.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Building,
  Mail,
  Phone,
  Globe,
  Share2,
  Bookmark,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  TrendingUp,
  ExternalLink,
  Heart,
  Clock as ClockIcon,
  FileText,
  CheckSquare,
  Star,
  Layers,
  Target,
  Zap,
  Shield,
  Coffee,
  Gift,
  Home,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import './JobDetailsModal.scss';

const JobDetailsModal = ({ job, isOpen, onClose}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Reset states when job changes
  useEffect(() => {
    if (job) {
      setIsApplied(false);
      setIsApplying(false);
      setActiveTab('description');
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

  // Handle body scroll when modal is open/closed - FIXED
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add a class to body for styling
      document.body.classList.add('modal-open');
      
      // Store scroll position
      document.body.dataset.scrollY = String(scrollY);
      
      // CRITICAL: Use overflow hidden on html AND body
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      
      return () => {
        // Remove class
        document.body.classList.remove('modal-open');
        
        // Restore scroll
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

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
    }, 1500);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.job_title || job.title,
        text: `Check out this opportunity: ${job.job_title || job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getJobTitle = () => {
    return job.job_title || job.title || job.job_opening_template || job.designation || 'Position';
  };

  const getCompany = () => {
    return job.company || job.organization || 'Company';
  };

  const getLocation = () => {
    return job.location || job.job_location || 'Remote';
  };

  const getJobType = () => {
    return job.employment_type || job.type || job.job_type || 'Full-time';
  };

  const getExperience = () => {
    return job.experience_level || job.experience || job.experience_required || 'Entry Level';
  };

  const getDescription = () => {
    return job.description || job.job_description || job.job_summary || 'No description provided.';
  };

  const getRequirements = () => {
    if (job.requirements && Array.isArray(job.requirements)) return job.requirements;
    if (job.qualifications && Array.isArray(job.qualifications)) return job.qualifications;
    if (job.skills_required && Array.isArray(job.skills_required)) return job.skills_required;
    if (typeof job.requirements === 'string') return job.requirements.split('\n').filter(r => r.trim());
    return ['Bachelor\'s degree in relevant field', '3+ years of experience', 'Strong communication skills'];
  };

  const getResponsibilities = () => {
    if (job.responsibilities && Array.isArray(job.responsibilities)) return job.responsibilities;
    if (job.duties && Array.isArray(job.duties)) return job.duties;
    if (typeof job.responsibilities === 'string') return job.responsibilities.split('\n').filter(r => r.trim());
    return ['Lead and manage projects', 'Collaborate with cross-functional teams', 'Drive innovation and excellence'];
  };

  const getBenefits = () => {
    if (job.benefits && Array.isArray(job.benefits)) return job.benefits;
    if (job.perks && Array.isArray(job.perks)) return job.perks;
    if (typeof job.benefits === 'string') return job.benefits.split('\n').filter(b => b.trim());
    return [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible work arrangements',
      'Paid time off and holidays'
    ];
  };

  const getSalary = () => {
    if (job.salary) return job.salary;
    if (job.salary_range) return job.salary_range;
    if (job.compensation) return job.compensation;
    return null;
  };

  const getApplicants = () => {
    return job.applicants || job.applicant_count || job.total_applicants || 0;
  };

  const getPostedDate = () => {
    return job.posted_on || job.posted_date || job.creation || job.created_at;
  };

  const getCompanyColor = () => {
    const colors = [
      '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', 
      '#f59e0b', '#ef4444', '#6366f1', '#06b6d4', '#84cc16'
    ];
    let hash = 0;
    const companyName = getCompany();
    for (let i = 0; i < companyName.length; i++) {
      hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const companyColor = getCompanyColor();
  const requirements = getRequirements();
  const responsibilities = getResponsibilities();
  const benefits = getBenefits();
  const salary = getSalary();

  const getBenefitIcon = (benefit) => {
    const benefitLower = benefit.toLowerCase();
    if (benefitLower.includes('health') || benefitLower.includes('medical') || benefitLower.includes('insurance')) 
      return <Shield size={16} />;
    if (benefitLower.includes('coffee') || benefitLower.includes('snack') || benefitLower.includes('food')) 
      return <Coffee size={16} />;
    if (benefitLower.includes('gift') || benefitLower.includes('bonus') || benefitLower.includes('commission')) 
      return <Gift size={16} />;
    if (benefitLower.includes('remote') || benefitLower.includes('work from home') || benefitLower.includes('flexible')) 
      return <Home size={16} />;
    if (benefitLower.includes('education') || benefitLower.includes('learning') || benefitLower.includes('training')) 
      return <GraduationCap size={16} />;
    if (benefitLower.includes('time off') || benefitLower.includes('holiday') || benefitLower.includes('vacation')) 
      return <ClockIcon size={16} />;
    return <Star size={16} />;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container"              onWheel={(e) => {
                e.stopPropagation();
 
                const element = e.currentTarget;
 
                if (e.deltaY !== 0) {
                  element.scrollTop += e.deltaY;
                }
              }}>
        {/* Header - Sticky */}
        <div className="modal-header">
          <div className="modal-header-left">
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <X size={24} />
            </button>
            <div className="header-breadcrumb">
              <span>Jobs</span>
              <span>/</span>
              <span className="current">{getJobTitle().substring(0, 30)}...</span>
            </div>
          </div>
          <div className="modal-header-right">
            <button className="action-btn" onClick={handleBookmark} aria-label="Bookmark">
              <Bookmark size={20} fill={isBookmarked ? '#f97316' : 'none'} stroke={isBookmarked ? '#f97316' : '#7a8a9e'} />
            </button>
            <button className="action-btn" onClick={handleShare} aria-label="Share">
              <Share2 size={20} />
            </button>
          </div>
        </div>



        {/* Scrollable Content */}
        <div className="modal-content-wrapper">
          <div className="modal-content">
            {/* Company Header */}
            <div className="company-header">
     
              <div className="company-info">
                <div className="company-badge">
                  <Building size={14} />
                  <span>{getCompany()}</span>
                </div>
                <h2 className="job-title">{getJobTitle()}</h2>
                <div className="job-meta-tags">
                  <span className="meta-tag">
                    <MapPin size={14} />
                    {getLocation()}
                  </span>
                  <span className="meta-tag">
                    <Briefcase size={14} />
                    {getJobType()}
                  </span>
                  <span className="meta-tag">
                    <Clock size={14} />
                    {getExperience()}
                  </span>
                  {salary && (
                    <span className="meta-tag highlight">
                      <DollarSign size={14} />
                      {salary}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-item">
                <Calendar size={16} />
                <div>
                  <span className="stat-label">Posted</span>
                  <span className="stat-value">{formatDate(getPostedDate())}</span>
                </div>
              </div>
              <div className="stat-item">
                <Users size={16} />
                <div>
                  <span className="stat-label">Applicants</span>
                  <span className="stat-value">{getApplicants()}</span>
                </div>
              </div>
              <div className="stat-item">
                <TrendingUp size={16} />
                <div>
                  <span className="stat-label">Status</span>
                  <span className="stat-value active-status">Active</span>
                </div>
              </div>
              <div className="stat-item">
                <Award size={16} />
                <div>
                  <span className="stat-label">Experience</span>
                  <span className="stat-value">{getExperience()}</span>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="apply-section">
              <div className="apply-left">
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
                    className="apply-btn"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <>
                        <span className="spinner"></span>
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
              <div className="apply-right">
                <button className="save-btn" onClick={handleBookmark}>
                  <Heart size={18} fill={isBookmarked ? '#f97316' : 'none'} stroke={isBookmarked ? '#f97316' : '#7a8a9e'} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="job-tabs">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                <FileText size={16} />
                Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
                onClick={() => setActiveTab('requirements')}
              >
                <CheckSquare size={16} />
                Requirements
              </button>
              <button 
                className={`tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                onClick={() => setActiveTab('benefits')}
              >
                <Gift size={16} />
                Benefits
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <div className="content-section">
                    <h3>About the Role</h3>
                    <p>{getDescription()}</p>
                  </div>
                  
                  {responsibilities.length > 0 && (
                    <div className="content-section">
                      <h3>Key Responsibilities</h3>
                      <ul className="responsibility-list">
                        {responsibilities.map((resp, index) => (
                          <li key={index}>
                            <Target size={16} />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="requirements-content">
                  <div className="content-section">
                    <h3>What You'll Need</h3>
                    <ul className="requirements-list">
                      {requirements.map((req, index) => (
                        <li key={index}>
                          <CheckCircle size={16} />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="content-section">
                    <h3>Preferred Qualifications</h3>
                    <ul className="requirements-list">
                      <li><CheckCircle size={16} /><span>Master's degree preferred</span></li>
                      <li><CheckCircle size={16} /><span>Industry certifications</span></li>
                      <li><CheckCircle size={16} /><span>Experience with enterprise solutions</span></li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="benefits-content">
                  <div className="benefits-grid-modern">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="benefit-card">
                        <div className="benefit-icon">{getBenefitIcon(benefit)}</div>
                        <div className="benefit-info">
                          <h4>{benefit}</h4>
                          <p>Competitive package</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="content-section">
                    <h3>Why Join Us?</h3>
                    <div className="perks-grid">
                      <div className="perk-item">
                        <Zap size={20} />
                        <div>
                          <strong>Innovation Culture</strong>
                          <span>Work on cutting-edge technologies</span>
                        </div>
                      </div>
                      <div className="perk-item">
                        <Layers size={20} />
                        <div>
                          <strong>Growth Opportunities</strong>
                          <span>Continuous learning and career advancement</span>
                        </div>
                      </div>
                      <div className="perk-item">
                        <Users size={20} />
                        <div>
                          <strong>Collaborative Environment</strong>
                          <span>Work with talented professionals</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="footer-actions">
                <button className="footer-btn" onClick={handleBookmark}>
                  <Bookmark size={16} fill={isBookmarked ? '#f97316' : 'none'} stroke={isBookmarked ? '#f97316' : '#5a6a7e'} />
                  {isBookmarked ? 'Saved' : 'Save Job'}
                </button>
                <button className="footer-btn" onClick={handleShare}>
                  <Share2 size={16} />
                  Share
                </button>
                <button className="footer-btn primary" onClick={handleApply}>
                  <ExternalLink size={16} />
                  Apply Now
                </button>
              </div>
              <div className="footer-meta">
                <span>Job ID: {job.id || job.name || 'N/A'}</span>
                <span>Posted: {formatDate(getPostedDate())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;