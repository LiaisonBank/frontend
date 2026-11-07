"use client";

import { AlertCircle, Award, Briefcase, BriefcaseIcon, CheckCircle, ChevronLeft, Clock, ExternalLink, Filter, MapPin, Search, Star } from "lucide-react";

export default function JobsTab({ jobViewMode, setJobViewMode, filteredJobs, selectedDepartment, handleDepartmentFilter, departments, selectedLocation, handleLocationFilter, locations, searchTerm, handleSearch, setSearchTerm, setSelectedDepartment, setSelectedLocation, isLoadingJobs, apiError, fetchVacancies, currentJobs, expandedDescriptions, truncateDescription, previewJob, activePreviewJobId, setActivePreviewJobId, handleApply, toggleDescription }) {
    return (
        <div className="jobs-section">
                                        <div className="section-header jobs-section-header">
                                            <div>
                                                <h2>
                                                    {jobViewMode === 'recommended'
                                                        ? 'Recommended for You'
                                                        : 'Filter Jobs'}
                                                </h2>

                                                <p>
                                                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                                                    {jobViewMode === 'recommended'
                                                        ? ' ranked based on your profile'
                                                        : ' found'}
                                                </p>
                                            </div>

                                            <div className="job-view-toggle">
                                                <button
                                                    type="button"
                                                    className={`job-view-tab ${jobViewMode === 'recommended' ? 'active' : ''
                                                        }`}
                                                    aria-pressed={jobViewMode === 'recommended'}
                                                    onClick={() => setJobViewMode('recommended')}
                                                >
                                                    <Star size={16} />
                                                    Recommended for You
                                                </button>

                                                <button
                                                    type="button"
                                                    className={`job-view-tab ${jobViewMode === 'filters' ? 'active' : ''
                                                        }`}
                                                    aria-pressed={jobViewMode === 'filters'}
                                                    onClick={() => setJobViewMode('filters')}
                                                >
                                                    <Filter size={16} />
                                                    Filter Jobs
                                                </button>
                                            </div>
                                        </div>

                                        {jobViewMode === 'filters' && (
                                            <div className="filters-bar">
                                                <div className="filter-group">
                                                    <label>Department</label>
                                                    <select
                                                        value={selectedDepartment}
                                                        onChange={(e) => handleDepartmentFilter(e.target.value)}
                                                    >
                                                        {departments.map(dept => (
                                                            <option key={dept} value={dept}>
                                                                {dept === 'all' ? 'All Departments' : dept}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="filter-group">
                                                    <label>Location</label>
                                                    <select
                                                        value={selectedLocation}
                                                        onChange={(e) => handleLocationFilter(e.target.value)}
                                                    >
                                                        {locations.map(loc => (
                                                            <option key={loc} value={loc}>
                                                                {loc === 'all' ? 'All Locations' : loc}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="filter-group search-filter">
                                                    <Search size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search jobs..."
                                                        value={searchTerm}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-clear-filters"
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setSelectedDepartment('all');
                                                        setSelectedLocation('all');
                                                        setJobViewMode('filters');
                                                    }}
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        )}
                                        <p className="profile-filter-status">
                                            {jobViewMode === 'recommended'
                                                ? 'Jobs are ranked by your skills, designation, specialization, location and experience.'
                                                : 'Apply Department, Location and Search filters to find specific vacancies.'}
                                        </p>

                                        {isLoadingJobs && (
                                            <div className="loading-jobs">
                                                <div className="loader"></div>
                                                <p>Loading job vacancies...</p>
                                            </div>
                                        )}

                                        {apiError && (
                                            <div className="error-state">
                                                <AlertCircle size={48} />
                                                <h3>Failed to Load Jobs</h3>
                                                <p>{apiError}</p>
                                                <button
                                                    className="btn-retry"
                                                    onClick={fetchVacancies}
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        )}

                                        {!isLoadingJobs && !apiError && (
                                            <>
                                                <div className="jobs-grid jobs-split-view">
                                                    <div className="jobs-list" aria-label="Job results">
                                                        {currentJobs.length > 0 ? (
                                                            currentJobs.map((job) => {
                                                                const isExpanded = expandedDescriptions[job.id] || false;
                                                                const description = job.description || 'No description available';
                                                                const shouldTruncate = description.length > 120;
                                                                const displayDescription = shouldTruncate && !isExpanded
                                                                    ? truncateDescription(description)
                                                                    : description;
                                                                const isSelected = String(previewJob?.id) === String(job.id);

                                                                return (
                                                                    <article
                                                                        key={job.id}
                                                                        className={`job-card ${isSelected ? 'is-selected' : ''}`}
                                                                        tabIndex={0}
                                                                        aria-label={`View details for ${job.title}`}
                                                                        onClick={() => setActivePreviewJobId(job.id)}
                                                                        onKeyDown={(event) => {
                                                                            if (event.key === 'Enter' || event.key === ' ') {
                                                                                event.preventDefault();
                                                                                setActivePreviewJobId(job.id);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="job-card-header">
                                                                            <div className="job-title-wrapper">
                                                                                <h4>{job.title}</h4>
                                                                            </div>
                                                                            <span className="job-department">{job.department}</span>
                                                                            {jobViewMode === 'recommended' &&
                                                                                job.profileMatchScore > 0 && (
                                                                                    <span className="job-match-badge">
                                                                                        <Star size={12} />
                                                                                        {Math.round((job.profileMatchScore / 99) * 100)}% Match
                                                                                    </span>
                                                                                )}
                                                                            {job.has_taken_exam && (
                                                                                <span className="exam-status-badge already-taken">
                                                                                    <CheckCircle size={12} />
                                                                                    Exam Taken
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="job-card-body">
                                                                            <div className="job-description-wrapper">
                                                                                <p className={`job-description ${isExpanded ? 'expanded' : ''}`}>
                                                                                    {displayDescription}
                                                                                </p>
                                                                                {shouldTruncate && (
                                                                                    <button
                                                                                        type="button"
                                                                                        className="read-more-btn"
                                                                                        onClick={(event) => {
                                                                                            event.stopPropagation();
                                                                                            toggleDescription(job.id);
                                                                                        }}
                                                                                    >
                                                                                        {isExpanded ? 'Read Less' : 'Read More'}
                                                                                    </button>
                                                                                )}
                                                                            </div>

                                                                            <div className="job-meta">
                                                                                <span><MapPin size={14} /> {job.location}</span>
                                                                                <span><Briefcase size={14} /> {job.type}</span>
                                                                                <span><Clock size={14} /> Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                                                                                <span className="salary"><Award size={14} /> {job.salary}</span>
                                                                            </div>

                                                                            {job.requirements && job.requirements.length > 0 && (
                                                                                <div className="job-requirements">
                                                                                    <span className="req-label">Requirements:</span>
                                                                                    {job.requirements.slice(0, 3).map((req, idx) => (
                                                                                        <span key={idx} className="req-tag">{req}</span>
                                                                                    ))}
                                                                                    {job.requirements.length > 3 && (
                                                                                        <span className="req-tag more">+{job.requirements.length - 3} more</span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </article>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="empty-state jobs-empty-state">
                                                                <BriefcaseIcon size={64} />
                                                                <h3>No Jobs Found</h3>
                                                                <p>Try adjusting your filters or search terms</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {previewJob && (
                                                        <section
                                                            className={`job-detail-panel ${activePreviewJobId && String(activePreviewJobId) === String(previewJob.id) ? 'mobile-detail-open' : ''}`}
                                                            aria-label={`Details for ${previewJob.title}`}
                                                            aria-live="polite"
                                                        >
                                                            <div className="job-detail-header">
                                                                <button
                                                                    type="button"
                                                                    className="mobile-jobs-back"
                                                                    onClick={() => setActivePreviewJobId(null)}
                                                                    aria-label="Back to job results"
                                                                >
                                                                    <ChevronLeft size={18} />
                                                                    <span>Back to jobs</span>
                                                                </button>
                                                                <div className="job-detail-heading">
                                                                    <h3>{previewJob.title}</h3>
                                                                    <div className="job-detail-badges">
                                                                        <span className="job-department">{previewJob.department}</span>
                                                                        {previewJob.has_taken_exam && (
                                                                            <span className="exam-status-badge already-taken">
                                                                                <CheckCircle size={12} />
                                                                                Exam Taken
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="job-detail-content">
                                                                <section className="job-detail-description">
                                                                    <h4>Full job description</h4>
                                                                    <p>{previewJob.description || 'No description available'}</p>
                                                                </section>

                                                                <section className="job-detail-facts">
                                                                    <h4>Job details</h4>
                                                                    <div className="job-detail-facts-grid">
                                                                        <div className="job-detail-fact">
                                                                            <MapPin size={17} />
                                                                            <div>
                                                                                <span>Location</span>
                                                                                <strong>{previewJob.location}</strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="job-detail-fact">
                                                                            <Briefcase size={17} />
                                                                            <div>
                                                                                <span>Job type</span>
                                                                                <strong>{previewJob.type}</strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="job-detail-fact">
                                                                            <Clock size={17} />
                                                                            <div>
                                                                                <span>Posted</span>
                                                                                <strong>{new Date(previewJob.posted_date).toLocaleDateString()}</strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="job-detail-fact">
                                                                            <Award size={17} />
                                                                            <div>
                                                                                <span>Salary</span>
                                                                                <strong>{previewJob.salary}</strong>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>

                                                                {previewJob.requirements && previewJob.requirements.length > 0 && (
                                                                    <section className="job-detail-requirements">
                                                                        <h4>Requirements</h4>
                                                                        <div className="job-requirements">
                                                                            {previewJob.requirements.map((req, idx) => (
                                                                                <span key={idx} className="req-tag">{req}</span>
                                                                            ))}
                                                                        </div>
                                                                    </section>
                                                                )}
                                                            </div>

                                                            <div className="job-detail-footer">
                                                                <button
                                                                    type="button"
                                                                    className={`btn-apply ${!previewJob.is_eligible ? 'disabled' : ''}`}
                                                                    onClick={() => handleApply(previewJob)}
                                                                    disabled={!previewJob.is_eligible}
                                                                >
                                                                    {previewJob.has_taken_exam ? 'Exam Already Taken' : 'Apply Now'}
                                                                    {!previewJob.has_taken_exam && <ExternalLink size={14} />}
                                                                </button>
                                                            </div>
                                                        </section>
                                                    )}
                                                </div>

                                            </>
                                        )}
                                    </div>
    );
}
