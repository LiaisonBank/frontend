// app/careers-liaison-bank/jobs/page.jsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  X,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  Briefcase,
  Building2,
  Users
} from 'lucide-react';
import './jobs.scss';
import JobDetailsModal from './JobDetailsModal';
import AuthModal from '../AuthModal';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState(serviceParam || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-jobs`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }
        
        const data = await response.json();
        
        let jobsData = [];
        if (Array.isArray(data)) {
          jobsData = data;
        } else if (data && data.message && typeof data.message === 'object') {
          if (Array.isArray(data.message.data)) {
            jobsData = data.message.data;
          } else if (Array.isArray(data.message)) {
            jobsData = data.message;
          }
        } else if (data && Array.isArray(data.data)) {
          jobsData = data.data;
        } else if (data && Array.isArray(data.message)) {
          jobsData = data.message;
        } else {
          jobsData = [];
        }
        
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper function to extract service type from job
  const getServiceType = (job) => {
    console.log("results",job)
    // Check various possible field names for service type
    return job.custom_service_type || 
           job.serviceType || 
          //  job.service_category || 
          //  job.category || 
          //  job.department || 
           '';
  };

  // Helper function to extract skills from job
  const getJobSkills = (job) => {
    const skills = [];
    
    if (job.custom_skills) {
      if (typeof job.custom_skills === 'string') {
        skills.push(...job.custom_skills.split('\n').filter(s => s.trim()));
      } else if (Array.isArray(job.custom_skills)) {
        skills.push(...job.custom_skills.filter(s => s));
      }
    }
    
    if (job.skills_required) {
      if (typeof job.skills_required === 'string') {
        skills.push(...job.skills_required.split('\n').filter(s => s.trim()));
      } else if (Array.isArray(job.skills_required)) {
        skills.push(...job.skills_required.filter(s => s));
      }
    }
    
    if (job.skills) {
      if (typeof job.skills === 'string') {
        skills.push(...job.skills.split('\n').filter(s => s.trim()));
      } else if (Array.isArray(job.skills)) {
        skills.push(...job.skills.filter(s => s));
      }
    }
    
    return skills;
  };

  // Helper function to get job title
  const getJobTitle = (job) => {
    return job.job_title || job.title || job.job_opening_template || job.designation || '';
  };

  // Filter and sort jobs
  useEffect(() => {
    let result = jobs;

    // Service Type filter (applied first, before search)
    if (selectedServiceType) {
      const serviceTypeLower = selectedServiceType.toLowerCase().trim();
      result = result.filter(job => {
        const serviceType = getServiceType(job).toLowerCase();
        // Check if job's service type matches the selected service
        return serviceType.includes(serviceTypeLower) || 
               serviceType === serviceTypeLower;
      });
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      
      if (term !== '') {
        const searchWords = term.split(' ').filter(word => word.length > 0);
        
        result = result.filter(job => {
          const title = getJobTitle(job).toLowerCase();
          const department = (job.department || '').toLowerCase();
          const skills = getJobSkills(job);
          const skillsString = skills.join(' ').toLowerCase();
          const serviceType = getServiceType(job).toLowerCase();
          
          const titleMatch = title.includes(term);
          const departmentMatch = department.includes(term);
          const skillMatch = skillsString.includes(term);
          const serviceMatch = serviceType.includes(term);
          
          if (searchWords.length > 1) {
            const allWordsMatchTitle = searchWords.every(word => title.includes(word));
            const allWordsMatchDept = searchWords.every(word => department.includes(word));
            const allWordsMatchSkills = searchWords.every(word => skillsString.includes(word));
            const allWordsMatchService = searchWords.every(word => serviceType.includes(word));
            
            return allWordsMatchTitle || allWordsMatchDept || allWordsMatchSkills || allWordsMatchService;
          }
          
          return titleMatch || departmentMatch || skillMatch || serviceMatch;
        });
      }
    }

    // Location filter
    if (selectedLocation) {
      result = result.filter(job => 
        (job.location || '') === selectedLocation
      );
    }

    // Department filter
    if (selectedDepartment) {
      result = result.filter(job => 
        (job.department || '') === selectedDepartment
      );
    }

    // Sort
    if (sortOrder === 'newest') {
      result = [...result].sort((a, b) => 
        new Date(b.posted_on || b.creation) - new Date(a.posted_on || a.creation)
      );
    } else if (sortOrder === 'oldest') {
      result = [...result].sort((a, b) => 
        new Date(a.posted_on || a.creation) - new Date(b.posted_on || b.creation)
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedLocation, selectedDepartment, selectedServiceType, sortOrder, jobs]);

  // Get unique values for filters
  const locations = useMemo(() => 
    [...new Set(jobs.map(job => job.location).filter(Boolean))],
    [jobs]
  );
  
  const departments = useMemo(() => 
    [...new Set(jobs.map(job => job.department).filter(Boolean))],
    [jobs]
  );

  const serviceTypes = useMemo(() => 
    [...new Set(jobs.map(job => getServiceType(job)).filter(Boolean))],
    [jobs]
  );

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedDepartment('');
    setSelectedServiceType('');
    setSortOrder('newest');
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Helper to get job title (formatted)
  const getFormattedJobTitle = (job) => {
    const title =
      job.job_title ||
      job.title ||
      job.job_opening_template ||
      job.designation ||
      'Position';

    return title
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Helper to get job description
  const getJobDescription = (job) => {
    return job.description || job.job_description || '';
  };

  // Helper to get location
  const getJobLocation = (job) => {
    return job.location || job.job_location || '';
  };

  // Helper to get company
  const getCompany = (job) => {
    return 'Liaison Bank';
  };

  // Helper to get experience
  const getExperience = (job) => {
    if (job.custom_min_experience !== undefined && job.custom_max_experience !== undefined) {
      const min = job.custom_min_experience;
      const max = job.custom_max_experience;
      if (min && max) return `${min} - ${max} years`;
      if (min) return `${min}+ years`;
      if (max) return `Up to ${max} years`;
    }
    return job.experience_level || job.experience || 'Not specified';
  };

  // Helper to get openings
  const getOpenings = (job) => {
    return job.vacancies || job.openings || 1;
  };

  // Get orange shade for card header
  const getOrangeShade = (index) => {
    const shades = [
      '#f97316',
      '#ea580c',
      '#f59e0b',
      '#d97706',
      '#f97316',
      '#ea580c'
    ];
    return shades[index % shades.length];
  };

  // Handle view details
  const handleViewDetails = (job, index) => {
    setSelectedJob(job);
    setSelectedJobIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handlePreviousJob = () => {
    if (selectedJobIndex > 0) {
      setSelectedJobIndex(selectedJobIndex - 1);
      setSelectedJob(filteredJobs[selectedJobIndex - 1]);
    }
  };

  const handleNextJob = () => {
    if (selectedJobIndex < filteredJobs.length - 1) {
      setSelectedJobIndex(selectedJobIndex + 1);
      setSelectedJob(filteredJobs[selectedJobIndex + 1]);
    }
  };

  return (
    <div className="jobs-page">
      {/* Hero Section */}
      <section className="jobs-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Jobs</h1>
            <p>Discover exciting career opportunities and join our team of innovators</p>
          </div>

          {/* Search & Filter */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search by job title, skills, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <div className="location-dropdown">
                <MapPin size={18} className="location-icon" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="location-select"
                >
                  <option value="">Near Location ▼</option>
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips">
              <span className="jobs-count">{filteredJobs.length} Open Jobs</span>
              
              {serviceParam && (
                <span className="filter-chip active service-chip">
                  {serviceParam}
                  <button 
                    className="remove-filter"
                    onClick={() => {
                      setSelectedServiceType('');
                      // Optionally update URL to remove query param
                      window.history.replaceState({}, '', '/careers-liaison-bank/jobs');
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button 
                className={`filter-chip ${selectedLocation ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                Locations ▼
              </button>
              <button 
                className={`filter-chip ${selectedDepartment ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                Work Locations ▼
              </button>
              <button 
                className="filter-chip sort-chip"
                onClick={toggleSortOrder}
              >
                Posting Date {sortOrder === 'newest' ? '↑↓' : '↓↑'}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="filters-expanded">
                <div className="filter-group">
                  <label>Service Type</label>
                  <select
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                  >
                    <option value="">All Services</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs Grid Section */}
      <section className="jobs-grid-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" size={48} />
              <p>Loading job opportunities...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={56} className="empty-icon" />
              <h3>No jobs found</h3>
              <p>
                {serviceParam 
                  ? `No openings available for ${serviceParam} at the moment. Try exploring other services.`
                  : 'Try adjusting your search or filter criteria'}
              </p>
              <button onClick={clearFilters} className="clear-filters-btn primary">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Service Type Header */}
              {serviceParam && (
                <div className="service-type-header">
                  <h2>Jobs in {serviceParam}</h2>
                  <p>Showing {filteredJobs.length} opportunities</p>
                </div>
              )}

              {/* Jobs Grid */}
              <div className="jobs-grid">
                {filteredJobs.map((job, index) => {
                  const orangeShade = getOrangeShade(index);
                  return (
                    <div key={job.name || job.id || index} className="job-card">
                      <div className="job-card-header" style={{ backgroundColor: orangeShade }}>
                        {getFormattedJobTitle(job)}
                      </div>
                      
                      <div className="job-card-body">
                        {/* Service Type Badge */}
                       
                        
                        {/* Job Meta */}
                        <div className="job-meta">
                          {getOpenings(job) && (
                            <div className="job-meta-item">
                              <Users size={14} />
                              <span>{getOpenings(job)} {getOpenings(job) === 1 ? 'Opening' : 'Openings'}</span>
                            </div>
                          )}
                          
                          {getExperience(job) && (
                            <div className="job-meta-item">
                              <Briefcase size={14} />
                              <span>{getExperience(job)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Job Description */}
                        <p className="job-description">
                          {getJobDescription(job).length > 120 
                            ? `${getJobDescription(job).substring(0, 120)}...` 
                            : getJobDescription(job) || 'No description available'}
                        </p>
                        
                        {/* View Details Button */}
                        <div className="job-footer" onClick={() => handleViewDetails(job, index)}>
                          View Details
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode="login"
        onSuccess={(userData) => {
          setAuthModalOpen(false);
          window.open(
            '/careers-liaison-bank/candidate-dashboard',
            '_blank',
            'noopener,noreferrer'
          );
        }}
      />
      
      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrevious={handlePreviousJob}
        onNext={handleNextJob}
        hasPrevious={selectedJobIndex > 0}
        hasNext={selectedJobIndex < filteredJobs.length - 1}
        onRequireLogin={() => setAuthModalOpen(true)}
      />
    </div>
  );
}