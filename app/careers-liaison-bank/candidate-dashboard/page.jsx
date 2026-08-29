// app/careers-liaison-bank/candidate-dashboard/page.jsx
"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Building2,
    FileText,
    LogOut,
    ChevronRight,
    Search,
    ExternalLink,
    Eye,
    Edit2,
    Save,
    X,
    BarChart3,
    Star,
    Award,
    TrendingUp,
    Users,
    ChevronDown,
    Bell,
    Settings,
    HelpCircle,
    RefreshCw,
    Menu,
    Home,
    ClipboardList,
    Briefcase as BriefcaseIcon,
    UserCircle,
    Shield,
    BadgeCheck,
    LayoutDashboard,
    Filter,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Loader
} from 'lucide-react';
import Logo from "@/assets/images/logo_grey2.png";

import AuthModal from '../AuthModal';
import CandidateExamForm from '../CandidateExamForm';
import './dashboard.scss';

export default function CandidateDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [jobRecommendations, setJobRecommendations] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({});
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [showExamForm, setShowExamForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6;
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [candidateExamResults, setCandidateExamResults] = useState([]);
    const [candidateDetails, setCandidateDetails] = useState(null);
    const [examResultsMap, setExamResultsMap] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [introductoryVideos, setIntroductoryVideos] = useState([]);
    const [introductoryVideosMap, setIntroductoryVideosMap] = useState({});
    const introductoryVideosMapRef = useRef({});

    // Use ref to store the latest examResultsMap
    const examResultsMapRef = useRef({});

    // Resume upload states
    const [resume, setResume] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);

    // Show notification
    const showNotification = (message, type = 'warning', duration = 5000) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), duration);
    };

    // ============================================================
    // FETCH INTRODUCTORY VIDEOS
    // ============================================================
    const fetchIntroductoryVideos = async (candidateId) => {
        try {
            // console.log('🔍 Fetching introductory videos for candidate:', candidateId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/introduction-video/candidate/${candidateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('career_token')}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // console.log('No introductory videos found');
                    setIntroductoryVideos([]);
                    setIntroductoryVideosMap({});
                    introductoryVideosMapRef.current = {};
                    return;
                }
                throw new Error(`Failed to fetch introductory videos: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Introductory videos response:', data);

            let videos = [];
            
            if (data.success && data.data) {
                if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
                    videos = [data.data];
                    console.log('📹 Single video found:', data.data);
                } 
                else if (Array.isArray(data.data)) {
                    videos = data.data;
                    console.log('📹 Multiple videos found:', videos.length);
                }
            } else if (Array.isArray(data)) {
                videos = data;
            } else if (data.videos && Array.isArray(data.videos)) {
                videos = data.videos;
            }

            console.log('📊 Processed videos:', videos);
            setIntroductoryVideos(videos);

            const videosMap = {};
            videos.forEach(video => {
                const vacancyId = video.vacancy_id || video.vacancyId || video.job_id || video.jobId;
                if (vacancyId) {
                    const key = String(vacancyId).trim();
                    videosMap[key] = video;
                    console.log(`✅ Mapped introductory video for vacancy ${key}:`, video);
                }
            });

            console.log('🗺️ Final introductory videos map:', videosMap);
            console.log('📋 Keys in map:', Object.keys(videosMap));
            
            setIntroductoryVideosMap(videosMap);
            introductoryVideosMapRef.current = videosMap;

        } catch (error) {
            console.error('Error fetching introductory videos:', error);
            setIntroductoryVideos([]);
            setIntroductoryVideosMap({});
            introductoryVideosMapRef.current = {};
        }
    };

    // ============================================================
    // STATS
    // ============================================================
    const getApplicationStats = () => {
        const total = candidateExamResults.length;
        const active = candidateExamResults.filter(result => {
            const status = result.status || result.status_display || result.result || '';
            return status === 'Pass' || status === 'pass' || status === 'passed' || status === 'PASS';
        }).length;
        const rejected = candidateExamResults.filter(result => {
            const status = result.status || result.status_display || result.result || '';
            return status === 'Fail' || status === 'fail' || status === 'failed' || status === 'FAIL';
        }).length;
        const interviews = candidateExamResults.filter(result => {
            const status = result.status || result.status_display || result.result || '';
            return status !== 'Pass' && status !== 'pass' && status !== 'passed' && status !== 'PASS' &&
                status !== 'Fail' && status !== 'fail' && status !== 'failed' && status !== 'FAIL';
        }).length;

        return { total, active, interviews, rejected };
    };

    const stats = getApplicationStats();

    // ============================================================
    // FETCH CANDIDATE DATA - Only on initial load
    // ============================================================
    useEffect(() => {
        const token = localStorage.getItem('career_token');
        const userData = localStorage.getItem('career_user');

        if (token && userData && userData !== 'undefined' && userData !== 'null') {
            try {
                const parsedUser = JSON.parse(userData);
                setIsAuthenticated(true);
                setUser(parsedUser);
                setFormData(parsedUser);

                const fetchAllData = async () => {
                    try {
                        if (parsedUser.id) {
                            await Promise.all([
                                fetchCandidateDetails(parsedUser.id),
                                fetchCandidateExamResults(parsedUser.id),
                                fetchIntroductoryVideos(parsedUser.id)
                            ]);
                        }

                        await fetchVacancies();
                        setIsDataLoaded(true);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchAllData();
            } catch (e) {
                console.error('Error parsing user data:', e);
                router.push('/careers-liaison-bank');
                setLoading(false);
            }
        } else {
            router.push('/careers-liaison-bank');
            setLoading(false);
        }
    }, []);

    // Update refs whenever maps change
    useEffect(() => {
        examResultsMapRef.current = examResultsMap;
        console.log('🔄 examResultsMap updated in ref:', examResultsMap);
    }, [examResultsMap]);

    useEffect(() => {
        introductoryVideosMapRef.current = introductoryVideosMap;
        console.log('🔄 introductoryVideosMap updated in ref:', introductoryVideosMap);
    }, [introductoryVideosMap]);

    // ============================================================
    // LOAD APPLICATIONS
    // ============================================================
    const loadApplications = useCallback(() => {
        if (!candidateExamResults.length || !allJobs.length) {
            setApplications([]);
            return;
        }

        console.log('📊 Building applications from exam results and vacancies');
        console.log('📊 Exam Results:', candidateExamResults);
        console.log('📊 All Jobs:', allJobs);

        const jobMap = {};
        allJobs.forEach(job => {
            if (job.id) {
                jobMap[String(job.id).trim()] = job;
            }
            if (job.name && job.name !== job.id) {
                jobMap[String(job.name).trim()] = job;
            }
        });

        console.log('🗺️ Job Map keys:', Object.keys(jobMap));

        const videoMap = introductoryVideosMapRef.current;
        console.log('🎥 Introductory videos map:', videoMap);
        console.log('🎥 Video map keys:', Object.keys(videoMap));

        const apps = candidateExamResults.map(result => {
            const vacancyId = result.vacancy_id || result.vacancyId || result.vacancy || result.job_id || result.jobId;
            const vacancyIdStr = vacancyId ? String(vacancyId).trim() : null;
            const job = vacancyIdStr ? jobMap[vacancyIdStr] : null;
            
            const hasIntroVideo = vacancyIdStr ? !!videoMap[vacancyIdStr] : false;
            const introVideo = vacancyIdStr ? videoMap[vacancyIdStr] : null;

            console.log(`🔍 Processing vacancy ${vacancyIdStr}:`, {
                hasIntroVideo,
                introVideo,
                jobTitle: job?.title || 'Not found'
            });

            return {
                id: result.id || result._id || `exam-${Date.now()}`,
                job_title: job?.title || result.job_title || result.position || result.candidate_name || 'Position',
                department: job?.department || result.department || 'General',
                applied_date: result.created_at || result.completed_at || result.started_at || new Date().toISOString(),
                status: result.status || 'completed',
                status_display: getStatusDisplay(result.status || 'completed'),
                company: 'Liaison Bank',
                location: job?.location || 'Not specified',
                salary: job?.salary || 'Not specified',
                type: job?.type || 'Full-time',
                vacancy_id: vacancyIdStr,
                exam_result: result,
                has_taken_exam: true,
                exam_score: result.score || result.percentage || result.marks_obtained || 0,
                exam_status: result.status || 'N/A',
                exam_completed_at: result.completed_at || result.created_at,
                total_questions: result.total_questions || result.totalQuestions || 0,
                correct_answers: result.correct_answers || result.correctAnswers || 0,
                wrong_answers: result.wrong_answers || result.wrongAnswers || 0,
                attempted_questions: result.attempted_questions || result.attemptedQuestions || 0,
                has_introductory_video: hasIntroVideo,
                introductory_video: introVideo,
                video_path: introVideo?.video_path || null,
                video_transcript: introVideo?.transcript || null,
                video_created_at: introVideo?.created_at || null
            };
        });

        const sortedApps = apps.sort((a, b) => {
            const dateA = new Date(a.applied_date);
            const dateB = new Date(b.applied_date);
            return dateB - dateA;
        });

        console.log('✅ Transformed applications:', sortedApps.map(app => ({
            job_title: app.job_title,
            vacancy_id: app.vacancy_id,
        
            has_introductory_video: app.has_introductory_video
        })));
        
        setApplications(sortedApps);
    }, [candidateExamResults, allJobs]);

    // ============================================================
    // WATCH FOR CHANGES IN EXAM RESULTS OR JOBS
    // ============================================================
    useEffect(() => {
        if (candidateExamResults.length > 0 && allJobs.length > 0) {
            loadApplications();
        } else if (candidateExamResults.length === 0) {
            setApplications([]);
        }
    }, [candidateExamResults, allJobs, loadApplications]);

    // ============================================================
    // FETCH CANDIDATE DETAILS
    // ============================================================
    const fetchCandidateDetails = async (candidateId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/career-candidates/profile/${candidateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('career_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch candidate details: ${response.status}`);
            }

            const data = await response.json();
            const candidateData = data.data || data.candidate || data;
            setCandidateDetails(candidateData);

            const updatedUser = { ...user, ...candidateData };
            setUser(updatedUser);
            setFormData(updatedUser);
            localStorage.setItem('career_user', JSON.stringify(updatedUser));

        } catch (error) {
            console.error('Error fetching candidate details:', error);
        }
    };

    // ============================================================
    // FETCH CANDIDATE EXAM RESULTS
    // ============================================================
    const fetchCandidateExamResults = async (candidateId) => {
        try {
            // console.log('🔍 Fetching exam results for candidate:', candidateId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-exam-result/candidate/${candidateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('career_token')}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // console.log('No exam results found for candidate');
                    setCandidateExamResults([]);
                    setExamResultsMap({});
                    examResultsMapRef.current = {};
                    setApplications([]);
                    return;
                }
                throw new Error(`Failed to fetch exam results: ${response.status}`);
            }

            const data = await response.json();
                        // console.log('📥 Exam results response:', data);

            let results = [];

            if (data.data && Array.isArray(data.data)) {
                results = data.data;
            } else if (data.results && Array.isArray(data.results)) {
                results = data.results;
            } else if (Array.isArray(data)) {
                results = data;
            } else if (data.message && data.message.data && Array.isArray(data.message.data)) {
                results = data.message.data;
            } else if (data.id || data.vacancy_id || data.exam_id) {
                results = [data];
            } else {
                for (const key in data) {
                    if (Array.isArray(data[key]) && data[key].length > 0) {
                        if (data[key][0] && (data[key][0].vacancy_id || data[key][0].exam_id || data[key][0].score)) {
                            results = data[key];
                            break;
                        }
                    }
                }
            }

            // console.log('📊 Parsed exam results:', results);
            setCandidateExamResults(results);

            const resultsMap = {};
            results.forEach(result => {
                const vacancyId = result.vacancy_id || result.vacancyId || result.vacancy || result.job_id || result.jobId;
                if (vacancyId) {
                    const key = String(vacancyId).trim();
                    resultsMap[key] = result;
                    // console.log(`✅ Mapped exam result for vacancy ${key}:`, result);
                }
            });

            // console.log('🗺️ Final exam results map:', resultsMap);
            setExamResultsMap(resultsMap);
            examResultsMapRef.current = resultsMap;

        } catch (error) {
            console.error('Error fetching exam results:', error);
            setCandidateExamResults([]);
            setExamResultsMap({});
            examResultsMapRef.current = {};
            setApplications([]);
        }
    };

    // ============================================================
    // CHECK EXAM STATUS
    // ============================================================
    const hasTakenExamForVacancy = useCallback((vacancyId) => {
        if (!vacancyId) return false;
        const vacancyIdStr = String(vacancyId).trim();
        const currentMap = examResultsMapRef.current;
        const hasExam = !!currentMap[vacancyIdStr];
        // console.log(`🔍 Checking exam status for vacancy ${vacancyIdStr}: ${hasExam}`);
        return hasExam;
    }, []);

    const getExamResultForVacancy = useCallback((vacancyId) => {
        if (!vacancyId) return null;
        const vacancyIdStr = String(vacancyId).trim();
        const currentMap = examResultsMapRef.current;
        return currentMap[vacancyIdStr] || null;
    }, []);

    // ============================================================
    // FETCH VACANCIES
    // ============================================================
    const fetchVacancies = useCallback(async () => {
        setIsLoadingJobs(true);
        setApiError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-jobs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch vacancies: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            let jobs = [];

            if (data.message && data.message.data && Array.isArray(data.message.data)) {
                jobs = data.message.data;
            } else if (data.data && Array.isArray(data.data)) {
                jobs = data.data;
            } else if (Array.isArray(data)) {
                jobs = data;
            } else if (data.jobs && Array.isArray(data.jobs)) {
                jobs = data.jobs;
            } else {
                console.warn('Unexpected API response structure:', data);
                jobs = [];
            }

            const currentExamMap = examResultsMapRef.current;
            // console.log('📋 Current exam map for job processing:', currentExamMap);

            const transformedJobs = jobs.map((job, index) => {
                const vacancyId = job.name || job.id || job._id || `job-${index}`;
                const vacancyIdStr = String(vacancyId).trim();

                const title = job.title || job.job_title || job.position || job.name || `Position ${index + 1}`;
                const department = job.department || job.category || job.team || job.division || 'General';
                const location = job.location || job.city || job.office || job.work_location || 'Not specified';
                const type = job.type || job.employment_type || job.work_type || 'Full-time';
                const description = job.description || job.job_description || job.details || job.overview || 'No description available';
                const salary = job.salary || job.salary_range || job.compensation || 'Not specified';
                const posted_date = job.posted_date || job.createdAt || job.creation || job.date || new Date().toISOString();

                let requirements = job.requirements || job.qualifications || job.skills || [];
                if (typeof requirements === 'string') {
                    requirements = requirements.split(',').map(r => r.trim()).filter(r => r);
                }

                const match_score = job.match_score || job.relevance || (60 + Math.floor(Math.random() * 35));

                const hasExam = !!currentExamMap[vacancyIdStr];
                const examResult = currentExamMap[vacancyIdStr] || null;

                // console.log(`📋 Job "${title}" (ID: ${vacancyIdStr}) - Has Exam: ${hasExam}`);

                return {
                    id: vacancyIdStr,
                    name: vacancyIdStr,
                    title: title,
                    department: department,
                    location: location,
                    type: type,
                    posted_date: posted_date,
                    description: description,
                    salary: salary,
                    requirements: requirements,
                    match_score: match_score,
                    original_data: job,
                    has_taken_exam: hasExam,
                    exam_result: examResult,
                    is_eligible: !hasExam
                };
            });

            console.log('✅ Transformed jobs with exam status:', transformedJobs.map(j => ({
                title: j.title,
                id: j.id,
                has_taken_exam: j.has_taken_exam
            })));

            setAllJobs(transformedJobs);
            setFilteredJobs(transformedJobs);
            generateJobRecommendations(transformedJobs);

        } catch (error) {
            console.error('Error fetching vacancies:', error);
            setApiError(error.message || 'Failed to load job vacancies');
            setAllJobs([]);
            setFilteredJobs([]);
            setJobRecommendations([]);
        } finally {
            setIsLoadingJobs(false);
        }
    }, []);

    // ============================================================
    // GENERATE JOB RECOMMENDATIONS
    // ============================================================
    const generateJobRecommendations = useCallback((jobs) => {
        if (!jobs || jobs.length === 0) {
            setJobRecommendations([]);
            return;
        }

        const candidateSkills = user?.skills
            ? user.skills.split(',').map(s => s.trim().toLowerCase())
            : [];

        const candidateDepartment = user?.current_designation || user?.department || '';
        const candidateLocation = user?.city || user?.location || '';
        const candidateExperience = parseInt(user?.total_experience) || 0;

        const scoredJobs = jobs.map(job => {
            let score = 0;

            const jobTitle = (job.title || '').toLowerCase();
            const jobDepartment = (job.department || '').toLowerCase();
            const jobLocation = (job.location || '').toLowerCase();
            const jobDescription = (job.description || '').toLowerCase();

            if (candidateDepartment) {
                const deptKeywords = candidateDepartment.toLowerCase().split(' ');
                deptKeywords.forEach(keyword => {
                    if (jobTitle.includes(keyword) || jobDepartment.includes(keyword)) {
                        score += 30;
                    }
                });
            }

            if (candidateSkills.length > 0) {
                let skillMatches = 0;
                candidateSkills.forEach(skill => {
                    if (
                        jobTitle.includes(skill) ||
                        jobDepartment.includes(skill) ||
                        jobDescription.includes(skill)
                    ) {
                        skillMatches++;
                    }
                });
                score += Math.min((skillMatches / candidateSkills.length) * 35, 35);
            }

            if (
                candidateLocation &&
                jobLocation.includes(candidateLocation.toLowerCase())
            ) {
                score += 15;
            }

            const expMatch = job.requirements?.some(req => {
                const match = req.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
                if (match && candidateExperience > 0) {
                    return candidateExperience >= parseInt(match[1]);
                }
                return false;
            });

            if (expMatch) {
                score += 10;
            }

            if (job.is_eligible) {
                score += 10;
            }

            return {
                ...job,
                recommendationScore: Math.min(score, 100),
            };
        });

        const recommendations = scoredJobs
            .filter(job => job.is_eligible === true)
            .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0))
            .slice(0, 5);

        console.log('📊 Generated recommendations:', recommendations.map(j => ({ title: j.title, score: j.recommendationScore })));
        setJobRecommendations(recommendations);

    }, [user]);

    const getStatusDisplay = (status) => {
        const statusMap = {
            'interview_scheduled': 'Interview Scheduled',
            'under_review': 'Under Review',
            'accepted': 'Accepted',
            'rejected': 'Not Selected',
            'pending': 'Pending Review',
            'shortlisted': 'Shortlisted',
            'in_progress': 'In Progress',
            'Pass': 'Passed',
            'pass': 'Passed',
            'PASS': 'Passed',
            'Fail': 'Failed',
            'fail': 'Failed',
            'FAIL': 'Failed'
        };
        return statusMap[status] || status;
    };

    // ============================================================
    // HANDLE LOGOUT
    // ============================================================
const handleLogout = () => {
    localStorage.removeItem('career_token');
    localStorage.removeItem('career_user');
    setIsAuthenticated(false);

    window.location.href = '/careers-liaison-bank';
};

    // ============================================================
    // HANDLE AUTH SUCCESS
    // ============================================================
    const handleAuthSuccess = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        setFormData(userData);
        setIsAuthModalOpen(false);
        fetchVacancies();
    };

    // ============================================================
    // HANDLE APPLY
    // ============================================================
const handleApply = (job) => {
    // console.log('🔄 handleApply called for job:', job);

    // Check if user has already taken the exam
    if (job.has_taken_exam) {
        const examResult = job.exam_result;
        let message = '❌ You have already taken the exam for this position.';

        if (examResult) {
            const status = examResult.status || examResult.status_display || examResult.result;
            const score = examResult.score || examResult.percentage || examResult.marks_obtained || 'N/A';

            if (status === 'Pass' || status === 'pass' || status === 'passed' || status === 'PASS') {
                message = `✅ You have already passed the exam for this position with a score of ${score}%. You are not eligible to take it again.`;
            } else {
                message = `❌ You have already taken the exam for this position with a score of ${score}%. You are not eligible to take it again.`;
            }
        }

        showNotification(message, 'warning');
        return;
    }

    // Check if job is eligible
    if (job.is_eligible === false) {
        showNotification('⚠️ This position is not available for application at this time.', 'error');
        return;
    }

    // Check if user is logged in
    if (!user || !user.id) {
        showNotification('⚠️ Please log in to apply for this position.', 'error');
        return;
    }

    // ============================================================
    // PROFILE COMPLETENESS CHECK - ADD THIS SECTION
    // ============================================================
    const requiredProfileFields = [
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'current_designation', label: 'Current Designation' },
        { key: 'total_experience', label: 'Total Experience' },
        { key: 'highest_qualification', label: 'Highest Qualification' },
        { key: 'skills', label: 'Skills' }
    ];

    const missingFields = requiredProfileFields.filter(field => {
        const value = user[field.key];
        return !value || value === '' || value === null || value === undefined;
    });

    if (missingFields.length > 0) {
        const fieldNames = missingFields.map(f => f.label).join(', ');
        const message = `⚠️ Please complete your profile before applying. Missing: ${fieldNames}`;
        showNotification(message, 'error', 8000);
        
        // Optionally, switch to profile tab to help user complete it
        setActiveTab('profile');
        return;
    }

    // Optional: Check if resume is uploaded
    if (!user.resume) {
        showNotification('⚠️ Please upload your resume before applying.', 'error', 5000);
        setActiveTab('profile');
        setIsEditing(true); // Open edit mode so user can upload resume
        return;
    }

    // Optional: Check for minimum experience requirements for the specific job
    // This would require parsing the job requirements
    // Example: if job has experience requirement, check if candidate meets it
    // This is a more advanced check you can add later

    // console.log('✅ All validations passed. Opening exam form for job:', job.title);

    const jobData = {
        ...job,
        job_title: job.title,
        title: job.title,
        department: job.department,
        designation: job.title,
        custom_department: job.department,
        original_data: job.original_data || job,
        vacancy_id: job.id || job.name,
        has_taken_exam: job.has_taken_exam || false,
        exam_result: job.exam_result || null
    };

    setSelectedJob(jobData);
    setShowExamForm(true);
};
    // ============================================================
    // HANDLE EXAM FORM CLOSE
    // ============================================================
    const handleExamFormClose = () => {
        setShowExamForm(false);
        setSelectedJob(null);
        refreshAllData();
    };

    // ============================================================
    // HANDLE EXAM FORM SUCCESS
    // ============================================================
    const handleExamFormSuccess = (resultData) => {
        setShowExamForm(false);
        setSelectedJob(null);

        const passed = resultData?.exam_passed || false;
        showNotification(
            passed ? '🎉 Exam passed successfully!' : '📝 Exam submitted successfully!',
            passed ? 'success' : 'info'
        );

        setTimeout(() => {
            refreshAllData();
        }, 1000);
    };

    // ============================================================
    // REFRESH ALL DATA
    // ============================================================
    const refreshAllData = async () => {
        setIsRefreshing(true);
        try {
            if (user?.id) {
                await Promise.all([
                    fetchCandidateExamResults(user.id),
                    fetchIntroductoryVideos(user.id)
                ]);
                await new Promise(resolve => setTimeout(resolve, 200));
                await fetchVacancies();
                showNotification('🔄 Data refreshed successfully!', 'success', 2000);
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
            showNotification('⚠️ Failed to refresh data. Please try again.', 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    // ============================================================
    // HANDLE SEARCH & FILTERS
    // ============================================================
    const handleSearch = (term) => {
        setSearchTerm(term);
        filterJobs(term, selectedDepartment, selectedLocation);
    };

    const handleDepartmentFilter = (department) => {
        setSelectedDepartment(department);
        filterJobs(searchTerm, department, selectedLocation);
        setCurrentPage(1);
    };

    const handleLocationFilter = (location) => {
        setSelectedLocation(location);
        filterJobs(searchTerm, selectedDepartment, location);
        setCurrentPage(1);
    };

    const filterJobs = (term, department, location) => {
        let filtered = allJobs;

        if (term) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(term.toLowerCase()) ||
                job.department?.toLowerCase().includes(term.toLowerCase()) ||
                job.location?.toLowerCase().includes(term.toLowerCase()) ||
                job.description?.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (department !== 'all') {
            filtered = filtered.filter(job =>
                job.department?.toLowerCase() === department.toLowerCase()
            );
        }

        if (location !== 'all') {
            filtered = filtered.filter(job =>
                job.location?.toLowerCase() === location.toLowerCase()
            );
        }

        setFilteredJobs(filtered);
    };

    // ============================================================
    // TOGGLE DESCRIPTION
    // ============================================================
    const toggleDescription = (jobId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [jobId]: !prev[jobId]
        }));
    };

    const truncateDescription = (description, maxLength = 120) => {
        if (!description) return '';
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + '...';
    };

    // ============================================================
    // STATUS HELPERS
    // ============================================================
    const getStatusIcon = (status) => {
        switch (status) {
            case 'interview_scheduled': return <Calendar className="status-icon scheduled" />;
            case 'under_review': return <Clock className="status-icon review" />;
            case 'accepted': return <CheckCircle className="status-icon accepted" />;
            case 'rejected': return <XCircle className="status-icon rejected" />;
            default: return <AlertCircle className="status-icon pending" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'interview_scheduled': return 'scheduled';
            case 'under_review': return 'review';
            case 'accepted': return 'accepted';
            case 'rejected': return 'rejected';
            default: return 'pending';
        }
    };

    // ============================================================
    // RESUME UPLOAD
    // ============================================================
    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file.');
                e.target.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB.');
                e.target.value = '';
                return;
            }

            setResumeFile(file);
            setResume(file);
            setFormData({ ...formData, resume: file.name });
        }
    };

    // ============================================================
    // SAVE PROFILE
    // ============================================================
    const handleSaveProfile = async () => {
        try {
            setResumeUploading(true);
            const candidateId = user?.id || user?.candidate_id || user?._id;

            if (!candidateId) {
                throw new Error('Candidate ID not found');
            }

            const formDataToSend = new FormData();

            const fields = {
                full_name: formData.full_name,
                phone: formData.phone,
                date_of_birth: formData.date_of_birth,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                pincode: formData.pincode,
                total_experience: formData.total_experience,
                current_company: formData.current_company,
                current_designation: formData.current_designation,
                current_ctc: formData.current_ctc,
                expected_ctc: formData.expected_ctc,
                notice_period: formData.notice_period,
                highest_qualification: formData.highest_qualification,
                specialization: formData.specialization,
                university: formData.university,
                graduation_year: formData.graduation_year,
                skills: formData.skills,
                linkedin_url: formData.linkedin_url,
                portfolio_url: formData.portfolio_url,
                github_url: formData.github_url,
                career_summary: formData.career_summary
            };

            Object.keys(fields).forEach(key => {
                if (fields[key] !== null && fields[key] !== undefined && fields[key] !== '') {
                    formDataToSend.append(key, fields[key]);
                }
            });

            if (resumeFile) {
                formDataToSend.append('resume', resumeFile);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/career-candidates/${candidateId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('career_token')}`,
                },
                body: formDataToSend,
            });

            let responseData;
            try {
                responseData = await response.json();
            } catch (e) {
                const textResponse = await response.text();
                console.error('Raw response:', textResponse);
                throw new Error(`Server returned: ${textResponse}`);
            }

            if (!response.ok) {
                if (responseData.detail) {
                    if (Array.isArray(responseData.detail)) {
                        const errorMessages = responseData.detail.map(err => {
                            const field = err.loc ? err.loc.join('.') : 'unknown';
                            return `${field}: ${err.msg}`;
                        }).join(', ');
                        throw new Error(errorMessages);
                    } else if (typeof responseData.detail === 'string') {
                        throw new Error(responseData.detail);
                    } else {
                        throw new Error(JSON.stringify(responseData.detail));
                    }
                }
                throw new Error(responseData.message || 'Failed to update profile');
            }

            const updatedUser = responseData.data || responseData.candidate || responseData.user || { ...user };

            if (resumeFile && responseData.data?.resume) {
                updatedUser.resume_url = responseData.data.resume;
            }

            localStorage.setItem('career_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setFormData(updatedUser);
            setIsEditing(false);
            setResume(null);
            setResumeFile(null);
            setResumeUploading(false);

            showNotification('✅ Profile updated successfully!', 'success');
            generateJobRecommendations(allJobs);

        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification(error.message || 'Failed to update profile. Please try again.', 'error');
            setResumeUploading(false);
        }
    };

    // ============================================================
    // FILTERS & PAGINATION
    // ============================================================
    const departments = ['all', ...new Set(allJobs.map(job => job.department).filter(Boolean))];
    const locations = ['all', ...new Set(allJobs.map(job => job.location).filter(Boolean))];

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // ============================================================
    // LOADING STATE
    // ============================================================
    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader-wrapper">
                    <Loader size={48} className="spinning" />
                </div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="candidate-dashboard">
            {/* Notification Component */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    <AlertCircle size={20} />
                    <span className="notification-message">{notification.message}</span>
                    <button
                        className="notification-close"
                        onClick={() => setNotification(null)}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onSuccess={handleAuthSuccess}
            />

            {showExamForm && selectedJob && (
                <CandidateExamForm
                    isOpen={showExamForm}
                    onClose={handleExamFormClose}
                    jobData={selectedJob}
                    candidateData={user}
                    onSuccess={handleExamFormSuccess}
                />
            )}

            <div className="dashboard-layout">
                <aside className={`dashboard-sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('overview'); setShowMobileMenu(false); }}
                        >
                            <Home size={20} />
                            <span>Overview</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('profile'); setShowMobileMenu(false); }}
                        >
                            <UserCircle size={20} />
                            <span>My Profile</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('applications'); setShowMobileMenu(false); }}
                        >
                            <ClipboardList size={20} />
                            <span>My Applications</span>
                            {applications.length > 0 && (
                                <span className="nav-badge">{applications.length}</span>
                            )}
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('jobs'); setShowMobileMenu(false); }}
                        >
                            <BriefcaseIcon size={20} />
                            <span>Browse Jobs</span>
                            {isRefreshing && <Loader size={16} className="spinning" />}
                        </button>

                                                <button className="nav-item logout" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">

                    </div>
                </aside>

                <main className="dashboard-main">
                    <div className="container">
                        {activeTab === 'overview' && (
                            <div className="overview-section">
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
                        )}

                        {/* ============================================================
                            PROFILE TAB - COMPLETE FIXED VERSION
                        ============================================================ */}
                        {activeTab === 'profile' && (
                            <div className="profile-section">
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
                                            <div className="info-section">
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
                                            <div className="info-section">
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
                                            <div className="info-section">
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
                                            <div className="info-section">
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
                        )}

                        {activeTab === 'applications' && (
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
                        )}


{activeTab === 'jobs' && (
    <div className="jobs-section">
        <div className="section-header">
           <div>
                <h2>Available Positions</h2>
                <p>{filteredJobs.length} jobs found</p>
            </div>
            <button
                className="btn-primary"
                onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('all');
                    setSelectedLocation('all');
                    setFilteredJobs(allJobs);
                }}
            >
                Clear Filters
            </button>
        </div>

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
        </div>

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
                <div className="jobs-grid">
                    {currentJobs.length > 0 ? (
                        currentJobs.map((job) => {
                            const isExpanded = expandedDescriptions[job.id] || false;
                            const description = job.description || 'No description available';
                            const shouldTruncate = description.length > 120;
                            const displayDescription = shouldTruncate && !isExpanded
                                ? truncateDescription(description)
                                : description;

                            return (
                                <div key={job.id} className="job-card">
                                    <div className="job-card-header">
                                        <div className="job-title-wrapper">
                                            <h4>{job.title}</h4>
                                     
                                        </div>
                                        <span className="job-department">{job.department}</span>
                                        {job.has_taken_exam && (
                                            <span className="exam-status-badge already-taken">
                                                <CheckCircle size={12} />
                                                Exam Taken
                                            </span>
                                        )}
                                    </div>
                                    <div className="job-card-body">
                                        <div className="job-description-wrapper">
                                            <p className="job-description">
                                                {displayDescription}
                                            </p>
                                            {shouldTruncate && (
                                                <button
                                                    className="read-more-btn"
                                                    onClick={() => toggleDescription(job.id)}
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
                                        {/* {job.has_taken_exam && job.exam_result && (
                                            <div className="exam-result-info">
                                                <span className={`exam-status ${job.exam_result.status === 'Pass' || job.exam_result.status === 'pass' || job.exam_result.status === 'PASS' ? 'passed' : 'failed'}`}>
                                                    {job.exam_result.status === 'Pass' || job.exam_result.status === 'pass' || job.exam_result.status === 'PASS' ? '✅ Passed' : '❌ Failed'}
                                                    Score: {job.exam_result.score || job.exam_result.percentage || job.exam_result.marks_obtained || 'N/A'}%
                                                </span>
                                            </div>
                                        )} */}
                                    </div>
                                    <div className="job-card-footer">
                                        <button
                                            className={`btn-apply ${!job.is_eligible ? 'disabled' : ''}`}
                                            onClick={() => handleApply(job)}
                                            disabled={!job.is_eligible}
                                        >
                                            {job.has_taken_exam ? 'Exam Already Taken' : 'Apply Now'}
                                            {!job.has_taken_exam && <ExternalLink size={14} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <BriefcaseIcon size={64} />
                            <h3>No Jobs Found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                            <ChevronRightIcon size={18} />
                        </button>
                    </div>
                )}
            </>
        )}
    </div>
)}
                    </div>
                </main>
            </div>
        </div>
    );
}