// app/careers-liaison-bank/candidate-dashboard/page.jsx
"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    LogOut,
    X,
    Home,
    ClipboardList,
    Briefcase as BriefcaseIcon,
    UserCircle,
    Loader
} from 'lucide-react';
import Logo from "@/assets/images/company/logo_tagline.jpg";

import AuthModal from '../AuthModal';
import CandidateExamForm from '../CandidateExamForm';
import OverviewTab from "./OverviewTab";
import ProfileTab from "./ProfileTab";
import ApplicationsTab from "./ApplicationsTab";
import JobsTab from "./JobsTab";

import './dashboard.scss';



const normalizeJobMatchText = (value) =>
    String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const getProfileMatchedJobs = (jobs, profile) => {
    const skills = (
        Array.isArray(profile?.skills)
            ? profile.skills
            : String(profile?.skills || '').split(/[,;\n]+/)
    )
        .map(normalizeJobMatchText)
        .filter(skill => skill.length >= 2);

    const designation = normalizeJobMatchText(profile?.current_designation);
    const specialization = normalizeJobMatchText(profile?.specialization);
    const city = normalizeJobMatchText(profile?.city);
    const candidateExperience = Number.parseFloat(profile?.total_experience) || 0;



    const genericRoleWords = new Set([
        'developer', 'engineer', 'senior', 'junior',
        'manager', 'executive', 'associate', 'lead'
    ]);

    const designationTerms = designation
        .split(' ')
        .filter(word => word.length > 2 && !genericRoleWords.has(word));

    const rankedJobs = jobs.map(job => {
        const requirements = Array.isArray(job.requirements)
            ? job.requirements.map(item =>
                typeof item === 'string'
                    ? item
                    : item?.name || item?.title || ''
            )
            : typeof job.requirements === 'string'
                ? [job.requirements]
                : [];

        const requirementsText = requirements.join(' ');

        const jobText = normalizeJobMatchText([
            job.title,
            job.department,
            job.description,
            requirementsText
        ].join(' '));

        const jobLocation = normalizeJobMatchText(job.location);

        let score = 0;

        // Skills match
        const matchedSkills = skills.filter(skill =>
            jobText.includes(skill)
        );

        score += Math.min(matchedSkills.length * 12, 48);

        // Current designation match
        if (designation && jobText.includes(designation)) {
            score += 18;
        } else {
            const matchedRoleTerms = designationTerms.filter(term =>
                jobText.includes(term)
            );

            score += Math.min(matchedRoleTerms.length * 5, 10);
        }

        // Specialization match
        if (specialization && jobText.includes(specialization)) {
            score += 10;
        }

        // City/location match
        if (
            city &&
            jobLocation &&
            (jobLocation.includes(city) || city.includes(jobLocation))
        ) {
            score += 15;
        }

        // Experience match, only when the vacancy explicitly states it
        const experienceRequirement = requirementsText.match(
            /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/i
        );

        if (
            experienceRequirement &&
            candidateExperience >= Number(experienceRequirement[1]) &&
            candidateExperience > 0
        ) {
            score += 8;
        }

        return {
            ...job,
            profileMatchScore: score
        };
    });

    // Keep all vacancies and rank them by profile relevance.
    // Jobs without matching keywords receive a score of 0.
    return rankedJobs.sort(
        (a, b) => b.profileMatchScore - a.profileMatchScore
    );
};

const getManualFilteredJobs = (jobs, term, department, location) => {
    const query = normalizeJobMatchText(term);

    return jobs.filter(job => {
        const requirements = Array.isArray(job.requirements)
            ? job.requirements.join(' ')
            : job.requirements || '';

        const searchableText = normalizeJobMatchText([
            job.title,
            job.department,
            job.location,
            job.description,
            requirements
        ].join(' '));

        const matchesSearch =
            !query || searchableText.includes(query);

        const matchesDepartment =
            department === 'all' ||
            job.department?.toLowerCase() === department.toLowerCase();

        const matchesLocation =
            location === 'all' ||
            job.location?.toLowerCase() === location.toLowerCase();

        return matchesSearch && matchesDepartment && matchesLocation;
    });
};




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
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    // UI-only selection for the Indeed-style job detail preview.
    const [activePreviewJobId, setActivePreviewJobId] = useState(null);
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
    const [jobViewMode, setJobViewMode] = useState('recommended');

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
        setJobViewMode('filters');
    };

    const handleDepartmentFilter = (department) => {
        setSelectedDepartment(department);
        setJobViewMode('filters');
    };

    const handleLocationFilter = (location) => {
        setSelectedLocation(location);
        setJobViewMode('filters');
    };



    useEffect(() => {
        if (jobViewMode === 'recommended') {
            setFilteredJobs(
                getProfileMatchedJobs(allJobs, user)
            );
            return;
        }

        // Strict manual filters
        setFilteredJobs(
            getManualFilteredJobs(
                allJobs,
                searchTerm,
                selectedDepartment,
                selectedLocation
            )
        );
    }, [
        allJobs,
        user,
        jobViewMode,
        searchTerm,
        selectedDepartment,
        selectedLocation
    ]);


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

    // Browse Jobs uses a continuous scroll list instead of pagination.
    const currentJobs = filteredJobs;
    const previewJob = currentJobs.find(job => String(job.id) === String(activePreviewJobId)) || currentJobs[0] || null;

    // Fix mouse-wheel scrolling for Indeed-style job panels
    useEffect(() => {
        if (activeTab !== 'jobs' || isLoadingJobs || apiError) return;

        const jobsSection = document.querySelector(
            '.candidate-dashboard .jobs-section'
        );

        if (!jobsSection) return;

        const scrollPanels = jobsSection.querySelectorAll(
            '.jobs-list, .job-detail-content'
        );

        const handleWheel = (event) => {
            if (event.ctrlKey) return;

            const panel = event.currentTarget;
            const maxScroll = panel.scrollHeight - panel.clientHeight;

            if (maxScroll <= 1 || event.deltaY === 0) return;

            // Convert wheel delta into pixels
            const multiplier =
                event.deltaMode === 1 ? 40 :
                    event.deltaMode === 2 ? panel.clientHeight : 1;

            const delta = event.deltaY * multiplier;

            const atTop = panel.scrollTop <= 0;
            const atBottom =
                panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;

            // Allow normal page scrolling when a panel reaches its boundary
            if (
                (delta < 0 && atTop) ||
                (delta > 0 && atBottom)
            ) {
                return;
            }

            event.preventDefault();

            panel.scrollTop = Math.max(
                0,
                Math.min(maxScroll, panel.scrollTop + delta)
            );
        };

        const cleanup = [];

        scrollPanels.forEach((panel) => {
            panel.addEventListener('wheel', handleWheel, {
                passive: false
            });

            cleanup.push(() => {
                panel.removeEventListener('wheel', handleWheel);
            });
        });

        return () => cleanup.forEach((remove) => remove());

    }, [activeTab, isLoadingJobs, apiError, currentJobs.length]);

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
                    <div className="dashboard-brand" aria-label="Liaison Bank Career Portal">
                        <Image src={Logo} alt="Liaison Bank" width={168} height={54} priority />
                        {/* <span>CAREER PORTAL</span> */}
                    </div>
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
                            <OverviewTab user={user} stats={stats} isRefreshing={isRefreshing} jobRecommendations={jobRecommendations} setActiveTab={setActiveTab} refreshAllData={refreshAllData} handleApply={handleApply} />
                        )}

                        {activeTab === 'profile' && (
                            <ProfileTab user={user} isEditing={isEditing} setIsEditing={setIsEditing} formData={formData} setFormData={setFormData} handleResumeChange={handleResumeChange} resume={resume} resumeFile={resumeFile} resumeUploading={resumeUploading} handleSaveProfile={handleSaveProfile} setResumeFile={setResumeFile} />
                        )}

                        {activeTab === 'applications' && (
                            <ApplicationsTab applications={applications} setActiveTab={setActiveTab} router={router} showNotification={showNotification} />
                        )}


                        {activeTab === 'jobs' && (
                            <JobsTab jobViewMode={jobViewMode} setJobViewMode={setJobViewMode} filteredJobs={filteredJobs} selectedDepartment={selectedDepartment} handleDepartmentFilter={handleDepartmentFilter} departments={departments} selectedLocation={selectedLocation} handleLocationFilter={handleLocationFilter} locations={locations} searchTerm={searchTerm} handleSearch={handleSearch} setSearchTerm={setSearchTerm} setSelectedDepartment={setSelectedDepartment} setSelectedLocation={setSelectedLocation} isLoadingJobs={isLoadingJobs} apiError={apiError} fetchVacancies={fetchVacancies} currentJobs={currentJobs} expandedDescriptions={expandedDescriptions} truncateDescription={truncateDescription} previewJob={previewJob} activePreviewJobId={activePreviewJobId} setActivePreviewJobId={setActivePreviewJobId} handleApply={handleApply} toggleDescription={toggleDescription} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}