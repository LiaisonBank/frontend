"use client";
import Link from "next/link";
import useBodyClass from '@/components/useBodyClass';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  MapPin, 
  ChevronRight,
  Users,
  Award,
  TrendingUp,
  Shield,
  Sparkles,
  Globe,
  Building2,
  GraduationCap,
  Heart,
  Coffee,
  Plane,
  Search,
  X,
  ArrowUpRight,
  Mail,
  ExternalLink,
  Clock,
  User,
  LogOut,
  XCircle,
  PenTool,
  CheckCircle,
  Lightbulb,
  Target,
  Star,
  BookOpen,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import AuthModal from './AuthModal';
import './career.scss';
import CandidateExamForm from "./CandidateExamForm";

export default function CareersLiaisonPage() {
  useBodyClass('careers');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  const [isExamFormOpen, setIsExamFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // State for Read More modal
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const [readMoreJob, setReadMoreJob] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('career_token');
    const userData = localStorage.getItem('career_user');
    
    if (token && userData) {
      try {
        if (userData && userData !== 'undefined' && userData !== 'null') {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } else {
          localStorage.removeItem('career_token');
          localStorage.removeItem('career_user');
        }
      } catch (e) {
        localStorage.removeItem('career_token');
        localStorage.removeItem('career_user');
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-jobs`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch job openings');
        }
        const data = await response.json();
        
        if (data.message && data.message.success) {
          const openJobs = data.message.data.filter(job => job.status === 'Open');
          setJobs(openJobs);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const departments = ['all', ...new Set(jobs.map(job => job.department))];

  const getCategoryLabel = (dept) => {
    if (dept === 'all') return 'All Positions';
    return dept
      .replace('DEPARTMENT - DBRE', '')
      .replace(' - DBRE', '')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatSalary = (lower, upper, per) => {
    const formatNum = (num) => {
      if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
      return `₹${num.toLocaleString()}`;
    };
    return `${formatNum(lower)} - ${formatNum(upper)}/${per.toLowerCase()}`;
  };

  const getTimeAgo = (dateString) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchFilter = activeFilter === 'all' || job.department === activeFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = 
        job.job_title.toLowerCase().includes(searchLower) ||
        job.designation.toLowerCase().includes(searchLower) ||
        job.department.toLowerCase().includes(searchLower) ||
        (job.description && job.description.toLowerCase().includes(searchLower));
      return matchFilter && matchSearch;
    });

  const getDepartmentIcon = (dept) => {
    const deptLower = dept.toLowerCase();
    if (deptLower.includes('sales')) return '💼';
    if (deptLower.includes('technology') || deptLower.includes('it')) return '💻';
    if (deptLower.includes('finance') || deptLower.includes('banking')) return '💰';
    if (deptLower.includes('marketing')) return '📢';
    if (deptLower.includes('operation')) return '⚙️';
    if (deptLower.includes('human') || deptLower.includes('hr')) return '👥';
    if (deptLower.includes('liaison')) return '🤝';
    if (deptLower.includes('project')) return '📋';
    return '📌';
  };

  // Updated culture points with new values
  const culturePoints = [
    { 
      icon: <PenTool className="w-6 h-6" />, 
      title: "Creativity", 
      description: "Innovative thinking and fresh perspectives"
    },
    { 
      icon: <CheckCircle className="w-6 h-6" />, 
      title: "Responsibility", 
      description: "Ownership and accountability in every role"
    },
    { 
      icon: <Lightbulb className="w-6 h-6" />, 
      title: "Smart Work", 
      description: "Efficiency and intelligent solutions"
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      title: "Discipline", 
      description: "Commitment to excellence and consistency"
    },
    { 
      icon: <Star className="w-6 h-6" />, 
      title: "Leadership", 
      description: "Empowering growth and guiding success"
    }
  ];

  // Updated benefits with new values
  const benefits = [
    { 
      icon: <TrendingUpIcon className="w-6 h-6" />, 
      title: "Career Advancement", 
      description: "Build a strong foundation for your future with industry exposure, valuable experience, and opportunities for long-term growth." 
    },
    { 
      icon: <BookOpen className="w-6 h-6" />, 
      title: "Continuous Learning", 
      description: "Develop technical and professional skills through mentorship, collaboration, and continuous learning opportunities." 
    },
    { 
      icon: <Globe className="w-6 h-6" />, 
      title: "Meaningful Work", 
      description: "Contribute to real projects that create business impact while gaining practical, hands-on experience." 
    }
  ];

  const handleApplyClick = (job) => {
    if (isAuthenticated) {
      router.push('/careers-liaison-bank/candidate-dashboard');
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleExamSuccess = (data) => {
    console.log('Application submitted successfully:', data);
    setIsExamFormOpen(false);
    setSelectedJob(null);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('career_token');
    localStorage.removeItem('career_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Handle Read More click
  const handleReadMore = (job) => {
    setReadMoreJob(job);
    setIsReadMoreOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close Read More modal
  const closeReadMore = () => {
    setIsReadMoreOpen(false);
    setReadMoreJob(null);
    document.body.style.overflow = 'auto';
  };

  // Helper function to strip HTML tags and truncate description
  const getTruncatedDescription = (description, maxLength = 150) => {
    if (!description) return 'No description available';
    const plainText = description.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Helper to check if description is long
  const isDescriptionLong = (description, maxLength = 150) => {
    if (!description) return false;
    const plainText = description.replace(/<[^>]*>/g, '').trim();
    return plainText.length > maxLength;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="careers-page">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Exam Form Modal */}
      <CandidateExamForm
        isOpen={isExamFormOpen}
        onClose={() => {
          setIsExamFormOpen(false);
          setSelectedJob(null);
        }}
        jobData={selectedJob}
        onSuccess={handleExamSuccess}
      />

      {/* Read More Modal */}
      {isReadMoreOpen && readMoreJob && (
        <div className="read-more-overlay" onClick={closeReadMore}>
          <div className="read-more-modal" onClick={(e) => e.stopPropagation()}>
            <div className="read-more-header">
              <h3>{readMoreJob.job_title}</h3>
              <button className="read-more-close" onClick={closeReadMore}>
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="read-more-meta">
              <span className="meta-tag">
                <Briefcase className="w-4 h-4" />
                {readMoreJob.department ? getCategoryLabel(readMoreJob.department) : 'N/A'}
              </span>
              <span className="meta-tag">
                <MapPin className="w-4 h-4" />
                {readMoreJob.location || 'Mumbai, India'}
              </span>
              {readMoreJob.publish_salary_range === 1 && (
                <span className="meta-tag salary-tag">
                  {formatSalary(readMoreJob.lower_range, readMoreJob.upper_range, readMoreJob.salary_per)}
                </span>
              )}
              <span className="meta-tag">
                <Clock className="w-4 h-4" />
                Posted {getTimeAgo(readMoreJob.posted_on)}
              </span>
            </div>

            <div className="read-more-body">
              {readMoreJob.description ? (
                <div dangerouslySetInnerHTML={{ __html: readMoreJob.description }} />
              ) : (
                <p>No description available</p>
              )}
            </div>

            <div className="read-more-footer">
              <button 
                onClick={() => {
                  closeReadMore();
                  handleApplyClick(readMoreJob);
                }}
                className="apply-now-btn"
              >
                Apply Now
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button onClick={closeReadMore} className="close-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>{jobs.length} Open Positions</span>
            </div>
            
            <h1>
              Build Your <span className="highlight">Career</span> With Us
            </h1>
            
            <p className="hero-description">
              Join a team of innovators shaping the future of banking
            </p>

            <div className="hero-actions">
              <Link href="#openings" className="btn-primary">
                Explore Opportunities
                <ChevronRight className="w-4 h-4" />
              </Link>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{jobs.length}</span>
                <span className="stat-label">Open Positions</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{new Set(jobs.map(j => j.department)).size}</span>
                <span className="stat-label">Departments</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{jobs.reduce((acc, job) => acc + (job.vacancies || 0), 0)}</span>
                <span className="stat-label">Total Vacancies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Culture Section */}
      <section className="culture-section" id="culture">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Values</span>
            <h2>We Encourage</h2>
            <p>Creativity, Responsibility, Smart Work, Discipline, Leadership</p>
          </div>

          <div className="culture-grid">
            {culturePoints.map((point, index) => (
              <div key={index} className="culture-card">
                <div className="culture-icon">
                  {point.icon}
                </div>
                <h5>{point.title}</h5>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section" id="openings">
        <div className="container">
          <div className="jobs-header">
            <div className="jobs-header-left">
              <span className="section-tag">Opportunities</span>
              <h2>Current Openings</h2>
              <p className="jobs-subtitle">Find your perfect role</p>
            </div>
            <Link href="https://liaisonbank.frappe.cloud/jobs" className="btn-outline" target="_blank">
              View All
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              {departments.filter(d => d !== 'all').slice(0, 5).map(dept => (
                <button
                  key={dept}
                  className={`filter-btn ${activeFilter === dept ? 'active' : ''}`}
                  onClick={() => setActiveFilter(dept)}
                >
                  {getDepartmentIcon(dept)} {getCategoryLabel(dept)}
                </button>
              ))}
            </div>
            
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="jobs-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => {
                const descriptionText = job.description ? job.description.replace(/<[^>]*>/g, '') : '';
                const isLong = descriptionText.length > 150;
                
                return (
                  <div key={job.name || index} className="job-card">
                    <div className="job-card-top">
                      <div className="job-card-header">
                        <div className="job-card-header-left">
                          {job.publish_salary_range === 1 && (
                            <span className="salary-badge">
                              {formatSalary(job.lower_range, job.upper_range, job.salary_per)}
                            </span>
                          )}
                        </div>
                        <span className="job-date">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(job.posted_on)}
                        </span>
                      </div>
                      
                      <h5 className="job-title">{job.job_title}</h5>
                      
                      <div className="job-meta">
                        <span className="meta-item">
                          <MapPin className="w-4 h-4" />
                          {job.location || 'Mumbai, India'}
                        </span>
                        <span className="meta-item">
                          <Briefcase className="w-4 h-4" />
                          {job.vacancies || 1} {job.vacancies > 1 ? 'Openings' : 'Opening'}
                        </span>
                      </div>

                      <p className="job-description">
                        {getTruncatedDescription(job.description, 150)}
                      </p>

                      {isLong && (
                        <button 
                          className="read-more-btn"
                          onClick={() => handleReadMore(job)}
                        >
                          Read More
                        </button>
                      )}
                    </div>

                    <div className="job-card-footer">
                      <span className="department-tag">
                        {getCategoryLabel(job.department)}
                      </span>
                      <button 
                        onClick={() => handleApplyClick(job)}
                        className="apply-btn"
                      >
                        Apply Now
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h4>No positions found</h4>
                <p>Try adjusting your filters</p>
                <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {filteredJobs.length > 0 && (
            <div className="jobs-footer">
              <p>Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> positions</p>
            </div>
          )}
        </div>
      </section>

      {/* Updated Benefits Section */}
      <section className="benefits-section" id="benefits">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Join Us</span>
            <h2>Build Your Future With Us</h2>
            <p>Discover the opportunities that await you at Liaison Bank</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h6>{benefit.title}</h6>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <span className="cta-tag">Ready to Start?</span>
              <h3>Let's Build Something Great Together</h3>
              <p>Take the next step in your career journey</p>
              <div className="cta-actions">
                {isAuthenticated ? (
                  <Link href="mailto:manisha.panwar@liaisonbank.com" className="btn-primary">
                    <Mail className="w-4 h-4" />
                    Apply Now
                  </Link>
                ) : (
                  <button onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} className="btn-primary">
                    <User className="w-4 h-4" />
                    Get Started
                  </button>
                )}
                <Link href="/contact-us-liaison-bank" className="btn-secondary-cta">
                  Contact HR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}