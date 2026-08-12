// app/careers-liaison-bank/jobs/page.jsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
    const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/erp-jobs');
        
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
    setSelectedJob(jobs[selectedJobIndex - 1]);
  }
};

const handleNextJob = () => {
  if (selectedJobIndex < jobs.length - 1) {
    setSelectedJobIndex(selectedJobIndex + 1);
    setSelectedJob(jobs[selectedJobIndex + 1]);
  }
};

  // Filter and sort jobs
  useEffect(() => {
    let result = jobs;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        (job.job_title || job.title || '')?.toLowerCase().includes(term) ||
        (job.department || '')?.toLowerCase().includes(term) ||
        (job.description || '')?.toLowerCase().includes(term) ||
        (job.location || '')?.toLowerCase().includes(term) ||
        (job.company || '')?.toLowerCase().includes(term) ||
        (job.job_opening_template || '')?.toLowerCase().includes(term)
      );
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

    // Job type filter
    if (selectedType) {
      result = result.filter(job => 
        (job.employment_type || job.type || '') === selectedType
      );
    }

    // Company filter
    if (selectedCompany) {
      result = result.filter(job => 
        (job.company || '') === selectedCompany
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
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedDepartment, selectedType, selectedCompany, sortOrder, jobs]);

  // Get unique values for filters
  const locations = useMemo(() => 
    [...new Set(jobs.map(job => job.location).filter(Boolean))],
    [jobs]
  );
  
  const departments = useMemo(() => 
    [...new Set(jobs.map(job => job.department).filter(Boolean))],
    [jobs]
  );
  
  const jobTypes = useMemo(() => 
    [...new Set(jobs.map(job => job.employment_type || job.type).filter(Boolean))],
    [jobs]
  );
  
  const companies = useMemo(() => 
    [...new Set(jobs.map(job => job.company).filter(Boolean))],
    [jobs]
  );

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedDepartment('');
    setSelectedType('');
    setSelectedCompany('');
    setSortOrder('newest');
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

  // Helper to get job title
  const getJobTitle = (job) => {
    return job.job_title || job.title || job.job_opening_template || job.designation || 'Position';
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
    return job.company || 'Company';
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
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
                  placeholder="Job title, skill, keyword"
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
                className={`filter-chip ${selectedType ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                Job Functions ▼
              </button>
              <button 
                className={`filter-chip ${selectedCompany ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                Organizations ▼
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
                  <label>Work Location</label>
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

                <div className="filter-group">
                  <label>Job Function</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Organization</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="">All Companies</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
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
              <p>Try adjusting your search or filter criteria</p>
              <button onClick={clearFilters} className="clear-filters-btn primary">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Jobs Grid */}
              <div className="jobs-grid">
                {currentJobs.map((job, index) => {
                  const orangeShade = getOrangeShade(index);
                  return (
                    <div key={job.name || job.id} className="job-card">
                      <div className="job-card-header" style={{ backgroundColor: orangeShade }}>
                        <div className="job-card-badge">
                          <Building2 size={16} />
                          <span>{getCompany(job)}</span>
                        </div>
                        {index < 2 && (
                          <span className="trending-badge">
                            <TrendingUp size={12} />
                            TRENDING
                          </span>
                        )}
                      </div>
                      
                      <div className="job-card-body">
                        <h3 className="job-title">{getJobTitle(job)}</h3>
                        
                        <div className="job-meta">
                          <div className="job-meta-item">
                            <MapPin size={14} />
                            <span>{getJobLocation(job) || 'Location not specified'}</span>
                          </div>
                          <div className="job-meta-item">
                            <Calendar size={14} />
                            <span>Posted: {formatDate(job.posted_on || job.creation)}</span>
                          </div>
                          {job.vacancies && (
                            <div className="job-meta-item">
                              <Users size={14} />
                              <span>{job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="job-description">
                          {getJobDescription(job).length > 120 
                            ? `${getJobDescription(job).substring(0, 120)}...` 
                            : getJobDescription(job) || 'No description available'}
                        </p>
                        
                        <div className="job-footer"      onClick={() => handleViewDetails(job, index)}
>
        
                            View Details
                            <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination - Separated from grid */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn prev"
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn next"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
               <JobDetailsModal
  job={selectedJob}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  onPrevious={handlePreviousJob}
  onNext={handleNextJob}
  hasPrevious={selectedJobIndex > 0}
  hasNext={selectedJobIndex < jobs.length - 1}
/>

            </>
          )}
        </div>
      </section>
    </div>
  );
}