// app/careers-liaison-bank/CandidateExamForm.jsx
"use client";
import { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Calendar,
  Clock,
  Building2,
  Award
} from 'lucide-react';
import './candidate_exam_form.scss';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-content">
        {type === 'error' && <AlertCircle size={20} className="toast-icon" />}
        {type === 'success' && <CheckCircle size={20} className="toast-icon" />}
        <span className="toast-message">{message}</span>
      </div>
      <button onClick={onClose} className="toast-close">
        <X size={16} />
      </button>
    </div>
  );
};

export default function CandidateExamForm({ 
  isOpen, 
  onClose, 
  jobData,
  onSuccess,
  candidateData
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_location: '',
    years_of_experience: '',
    current_company: '',
    current_designation: '',
    highest_qualification: '',
    skills: '',
    cover_letter: '',
    notice_period: '',
    expected_salary: '',
    available_for_interview: '',
    preferred_interview_time: '',
    gender: '',
    country: 'India',
    area_pin_code: '',
    current_salary: '',
    currency: 'INR',
    current_ctc: '',
    expected_ctc: '',
    city: '',
    state: '',
    pincode: '',
    date_of_birth: '',
    specialization: '',
    university: '',
    graduation_year: '',
    linkedin_url: '',
    portfolio_url: '',
    github_url: '',
    career_summary: '',
    total_experience: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examTimer, setExamTimer] = useState(1800);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [isExamAvailable, setIsExamAvailable] = useState(true);
  const [toast, setToast] = useState(null);
  const [showExamNotAvailable, setShowExamNotAvailable] = useState(false);
  const [alreadyTakenExam, setAlreadyTakenExam] = useState(false);
  const [examIdFromApi, setExamIdFromApi] = useState('');
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [showErrorState, setShowErrorState] = useState(false); // New state for error display

  // Show toast notification
  const showToast = (message, type = 'error') => {
    console.log(`📢 Toast: ${type} - ${message}`);
    setToast({ message, type });
  };

  // CRITICAL: Check if candidate already took exam BEFORE loading anything
  useEffect(() => {
    if (isOpen && jobData) {
      console.log('🔍 Checking exam eligibility for job:', jobData);
      console.log('🔍 has_taken_exam:', jobData.has_taken_exam);
      console.log('🔍 exam_result:', jobData.exam_result);
      
      // Check if candidate already took exam
      if (jobData.has_taken_exam === true || jobData.exam_result) {
        console.log('🚫 Candidate already took this exam');
        setAlreadyTakenExam(true);
        setShowExamNotAvailable(true);
        const message = 'You have already taken the exam for this position. You are not eligible to take it again.';
        setError(message);
        setApiResponseMessage(message);
        showToast(message, 'error');
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
        return;
      }
      
      // If eligible, proceed with loading
      setAlreadyTakenExam(false);
      setShowExamNotAvailable(false);
      setError(null);
      setApiResponseMessage('');
      setShowErrorState(false);
    }
  }, [isOpen, jobData, onClose]);

  // Load user data - use candidateData prop first, fallback to localStorage
  useEffect(() => {
    const loadUserData = async () => {
      // First try to use candidateData from props
      if (candidateData && Object.keys(candidateData).length > 0) {
        console.log('✅ Using candidateData from props:', candidateData);
        
        if (candidateData.id) {
          setCandidateId(parseInt(candidateData.id));
        }
        
        setFormData(prev => ({
          ...prev,
          full_name: candidateData.full_name || candidateData.name || '',
          email: candidateData.email || '',
          phone: candidateData.phone || '',
          gender: candidateData.gender || '',
          date_of_birth: candidateData.date_of_birth || '',
          current_location: candidateData.city || candidateData.current_location || '',
          city: candidateData.city || '',
          state: candidateData.state || '',
          country: candidateData.country || 'India',
          area_pin_code: candidateData.pincode || candidateData.area_pin_code || '',
          pincode: candidateData.pincode || '',
          current_company: candidateData.current_company || '',
          current_designation: candidateData.current_designation || '',
          years_of_experience: candidateData.total_experience || '',
          total_experience: candidateData.total_experience || '',
          current_ctc: candidateData.current_ctc || '',
          expected_ctc: candidateData.expected_ctc || '',
          current_salary: candidateData.current_ctc || candidateData.current_salary || '',
          expected_salary: candidateData.expected_ctc || candidateData.expected_salary || '',
          notice_period: candidateData.notice_period || '',
          highest_qualification: candidateData.highest_qualification || '',
          specialization: candidateData.specialization || '',
          university: candidateData.university || '',
          graduation_year: candidateData.graduation_year || '',
          skills: candidateData.skills || '',
          linkedin_url: candidateData.linkedin_url || '',
          portfolio_url: candidateData.portfolio_url || '',
          github_url: candidateData.github_url || '',
          career_summary: candidateData.career_summary || '',
          currency: candidateData.currency || 'INR'
        }));
        
        setUserDataLoaded(true);
        return;
      }
      
      // Fallback to localStorage
      const userData = localStorage.getItem('career_user');
      const token = localStorage.getItem('career_token');
      
      if (token && userData && userData !== 'undefined' && userData !== 'null') {
        try {
          const user = JSON.parse(userData);
          console.log('📦 Loading user data from localStorage:', user);
          
          if (user.id) {
            setCandidateId(parseInt(user.id));
          }
          
          setFormData(prev => ({
            ...prev,
            full_name: user.full_name || user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: user.gender || '',
            date_of_birth: user.date_of_birth || '',
            current_location: user.city || user.current_location || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || 'India',
            area_pin_code: user.pincode || user.area_pin_code || '',
            pincode: user.pincode || '',
            current_company: user.current_company || '',
            current_designation: user.current_designation || '',
            years_of_experience: user.total_experience || '',
            total_experience: user.total_experience || '',
            current_ctc: user.current_ctc || '',
            expected_ctc: user.expected_ctc || '',
            current_salary: user.current_ctc || user.current_salary || '',
            expected_salary: user.expected_ctc || user.expected_salary || '',
            notice_period: user.notice_period || '',
            highest_qualification: user.highest_qualification || '',
            specialization: user.specialization || '',
            university: user.university || '',
            graduation_year: user.graduation_year || '',
            skills: user.skills || '',
            linkedin_url: user.linkedin_url || '',
            portfolio_url: user.portfolio_url || '',
            github_url: user.github_url || '',
            career_summary: user.career_summary || '',
            currency: user.currency || 'INR'
          }));
          
          setUserDataLoaded(true);
          
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setUserDataLoaded(true);
      }
    };
    
    if (isOpen && !alreadyTakenExam && !showExamNotAvailable) {
      loadUserData();
    }
  }, [isOpen, candidateData, alreadyTakenExam, showExamNotAvailable]);

  // Fetch questions from API when component opens and user data is loaded
  useEffect(() => {
    if (isOpen && userDataLoaded && !examStarted && !examSubmitted && !success && isExamAvailable && !showExamNotAvailable && !alreadyTakenExam && !showErrorState) {
      const timer = setTimeout(() => {
        fetchQuestionsAndStartExam();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, userDataLoaded, examStarted, examSubmitted, success, isExamAvailable, showExamNotAvailable, alreadyTakenExam, showErrorState]);

  // Fetch questions from API
  const fetchQuestionsFromAPI = async (department) => {
    try {
      setFetchingQuestions(true);
      
      const encodedDepartment = encodeURIComponent(department || 'IT DEPARTMENT - DBRE');
      const apiUrl = `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-exam-questions?department=${encodedDepartment}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.message && data.message.success && data.message.questions) {
        const questions = data.message.questions;
        const apiExamId = encodedDepartment;
        setExamIdFromApi(apiExamId);
        console.log('✅ Exam ID (department) from API:', apiExamId);
        
        const transformedQuestions = questions.map((q, index) => {
          const options = [
            q.option_a || 'Option A not available',
            q.option_b || 'Option B not available',
            q.option_c || 'Option C not available',
            q.option_d || 'Option D not available'
          ].filter(opt => opt && opt !== 'Option A not available' && opt !== 'Option B not available' && opt !== 'Option C not available' && opt !== 'Option D not available');
          
          let correctAnswerText = '';
          const correctLetter = (q.correct_answer || '').toUpperCase();
          if (correctLetter === 'A' && q.option_a) correctAnswerText = q.option_a;
          else if (correctLetter === 'B' && q.option_b) correctAnswerText = q.option_b;
          else if (correctLetter === 'C' && q.option_c) correctAnswerText = q.option_c;
          else if (correctLetter === 'D' && q.option_d) correctAnswerText = q.option_d;
          
          return {
            id: q.name || `q-${index}`,
            question: q.question || 'Question not available',
            options: options,
            correct_answer: correctAnswerText || options[0] || '',
            explanation: q.explanation || 'No explanation provided'
          };
        });
        
        return transformedQuestions;
      } else {
        console.warn('API response structure unexpected, using fallback questions:', data);
        return getManualExamQuestions(jobData?.job_title, jobData?.department);
      }
      
    } catch (error) {
      console.error('Error fetching questions from API:', error);
      return getManualExamQuestions(jobData?.job_title, jobData?.department);
    } finally {
      setFetchingQuestions(false);
    }
  };

  // Start exam with API questions
  const fetchQuestionsAndStartExam = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowErrorState(false);
      
      const department = jobData?.department || jobData?.original_data?.department || 'IT DEPARTMENT - DBRE';
      const questions = await fetchQuestionsFromAPI(department);
      
      if (questions && questions.length > 0) {
        setExamQuestions(questions);
        setExamStarted(true);
        setExamTimer(1800);
        setIsApplicationSubmitted(true);
        
        const mockSubmissionData = {
          id: Date.now().toString(),
          ...formData,
          job_id: jobData?.name || jobData?.id,
          job_title: jobData?.job_title || jobData?.title,
          department: jobData?.department || jobData?.original_data?.department,
          application_date: new Date().toISOString(),
          status: 'pending'
        };
        setSubmittedData(mockSubmissionData);
      } else {
        const errorMsg = 'No questions available for this department. Please contact HR.';
        setError(errorMsg);
        setApiResponseMessage(errorMsg);
        setShowErrorState(true);
        showToast(errorMsg, 'error');
        // Show error state in modal
        setShowExamNotAvailable(true);
      }
      
    } catch (err) {
      const errorMsg = err.message || 'Failed to start exam. Please try again.';
      setError(errorMsg);
      setApiResponseMessage(errorMsg);
      setShowErrorState(true);
      setShowExamNotAvailable(true);
      showToast(errorMsg, 'error');
      console.error('Error starting exam:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit exam result to API
  const submitExamResultToAPI = async (examData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/erp-exam-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData)
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      // Check if the response contains a message
      if (data && data.message) {
        setApiResponseMessage(data.message);
        
        if (data.message.includes('already exists') || 
            data.message.includes('already taken') ||
            data.message.includes('not eligible')) {
          return { success: false, message: data.message };
        }
      }

      if (!response.ok) {
        if (data.message) {
          return { success: false, message: data.message };
        }
        return { success: false, message: `Failed to submit exam result: ${response.status}` };
      }

      if (data.success === false) {
        return { success: false, message: data.message || 'Failed to submit exam result' };
      }

      return { success: true, data: data };
    } catch (error) {
      console.error('Error submitting exam result:', error);
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

 
 

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleExamSubmit = async () => {
    setLoading(true);
    setError(null);
    setApiResponseMessage('');

    try {
      // Calculate score
      const totalQuestions = examQuestions.length;
      let correctAnswers = 0;
      
      examQuestions.forEach((q, index) => {
        const selectedAnswer = answers[index] || '';
        const correctAnswer = q.correct_answer || '';
        
        if (selectedAnswer.trim() === correctAnswer.trim()) {
          correctAnswers++;
        }
      });
      
      const attemptedQuestions = Object.keys(answers).length;
      const wrongAnswers = attemptedQuestions - correctAnswers;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= 60;

      // Get the vacancy ID from jobData
      const vacancyId = jobData?.vacancy_id || jobData?.id || jobData?.name || '2';
      const examId = examIdFromApi || jobData?.exam_id || jobData?.name || jobData?.id || '';
      const candidateIdInt = parseInt(candidateId || 1);

      console.log('📋 Job Data:', jobData);
      console.log('📋 Using vacancy_id:', vacancyId);
      console.log('📋 Using exam_id (final):', examId);
      console.log('📋 Using candidate_id:', candidateIdInt);

      // Prepare exam result data with correct types
      const examResultData = {
        candidate_name: formData.full_name || submittedData?.full_name || 'Unknown Candidate',
        candidate_id: candidateIdInt,
        exam_id: String(examId),
        vacancy_id: String(vacancyId),
        total_questions: totalQuestions,
        attempted_questions: attemptedQuestions,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        score: score,
        percentage: score,
        status: passed ? "Pass" : "Fail",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };

      console.log('📤 Submitting exam result:', examResultData);

      // Submit exam result to API
      const result = await submitExamResultToAPI(examResultData);
      
      if (!result.success) {
        const errorMessage = result.message || 'Failed to submit exam';
        console.log('🔴 API Error:', errorMessage);
        
        setError(errorMessage);
        setApiResponseMessage(errorMessage);
        showToast(errorMessage, 'error');
        
        if (errorMessage.includes('already exists') || errorMessage.includes('already taken')) {
          const userFriendlyMessage = '⚠️ You have already taken this exam. You are not eligible to take it again.';
          setShowExamNotAvailable(true);
          setIsExamAvailable(false);
          setError(userFriendlyMessage);
          setApiResponseMessage(userFriendlyMessage);
          showToast(userFriendlyMessage, 'error');
          
          setTimeout(() => {
            onClose();
          }, 3000);
          
          setLoading(false);
          return;
        } else if (errorMessage.includes('not eligible')) {
          const userFriendlyMessage = '⚠️ You are not eligible for this position based on your previous exam results.';
          setShowExamNotAvailable(true);
          setIsExamAvailable(false);
          setError(userFriendlyMessage);
          setApiResponseMessage(userFriendlyMessage);
          showToast(userFriendlyMessage, 'error');
          
          setTimeout(() => {
            onClose();
          }, 3000);
          
          setLoading(false);
          return;
        } else {
          showToast(errorMessage, 'error');
          setLoading(false);
          return;
        }
      }

      console.log('✅ Exam result submitted successfully:', result.data);
      
      setExamSubmitted(true);
      setExamResult({
        score,
        passed,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        attemptedQuestions
      });
      
      setSuccess(true);
      
      const successMessage = passed ? '🎉 Exam passed successfully!' : 'Exam submitted successfully';
      showToast(successMessage, 'success');
      
      if (onSuccess) { 
        onSuccess({
          exam_passed: passed,
          exam_score: score,
          exam_results: {
            total: totalQuestions,
            correct: correctAnswers,
            wrong: wrongAnswers,
            attempted: attemptedQuestions,
            percentage: score,
            status: passed ? "Pass" : "Fail"
          },
          api_response: result.data,
          ...examResultData
        });
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setApiResponseMessage(errorMessage);
      showToast(errorMessage, 'error');
      console.error('❌ Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (examStarted && examTimer > 0 && !examSubmitted) {
      const timer = setInterval(() => {
        setExamTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (examTimer === 0 && examStarted && !examSubmitted) {
      handleExamSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStarted, examTimer, examSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Render error state when exam is not available
  if (showExamNotAvailable || alreadyTakenExam || showErrorState) {
    return (
      <div className="exam-modal-overlay" >
        <div className="exam-modal form-modal">
          <div className="exam-modal-header">
            <h3>{error?.includes('already') ? 'Exam Not Available' : 'Error'}</h3>
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>
          <div className="error-container">
            <AlertCircle size={48} className="error-icon-large" />
            <h4>{error?.includes('already') ? 'Cannot Start Exam' : 'Something Went Wrong'}</h4>
            <p className="error-message-text">{error || apiResponseMessage || 'An error occurred. Please try again.'}</p>
            {apiResponseMessage && apiResponseMessage !== error && (
              <p className="api-response-message">Details: {apiResponseMessage}</p>
            )}
            <div className="error-actions">
              <button onClick={onClose} className="btn-primary">
                Close
              </button>
              {showErrorState && !error?.includes('already') && (
                <button onClick={() => {
                  setShowErrorState(false);
                  setShowExamNotAvailable(false);
                  fetchQuestionsAndStartExam();
                }} className="btn-secondary">
                  Retry
                </button>
              )}
            </div>
          </div>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading && !examStarted) {
    return (
      <div className="exam-modal-overlay">
        <div className="exam-modal form-modal">
          <div className="exam-modal-header">
            <h3>Loading Exam...</h3>
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>
          <div className="loading-container">
            <Loader2 className="spinner large" />
            <p>Preparing your assessment...</p>
          </div>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
      </div>
    );
  }

  // Render exam
 // Render exam
if (examStarted && !examSubmitted) {
  return (
    <div className="exam-modal-overlay">
      <div className="exam-modal">
        <div className="exam-modal-header">
          <h3>Technical Assessment - {jobData?.job_title || jobData?.title || 'Position'}</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        
        <div className="exam-info-bar">
          <div className="exam-info-item">
            <User size={16} />
            <span>{formData.full_name || 'Candidate'}</span>
          </div>
          <div className="exam-info-item">
            <Mail size={16} />
            <span>{formData.email || 'Email'}</span>
          </div>
          <div className="exam-info-item">
            <Briefcase size={16} />
            <span>{jobData?.job_title || jobData?.title || 'Position'}</span>
          </div>
        </div>
        
        <div className="exam-timer">
          <span className="timer-label">⏱️ Time Remaining:</span>
          <span className={`timer-value ${examTimer < 300 ? 'warning' : ''}`}>
            {formatTime(examTimer)}
          </span>
        </div>

        <div className="exam-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {examQuestions.length}
          </span>
        </div>

        {/* ADDED onWheel handler here */}
        <div 
          className="exam-content"
          onWheel={(e) => {
            e.stopPropagation();
            const element = e.currentTarget;
            if (e.deltaY !== 0) {
              element.scrollTop += e.deltaY;
            }
          }}
        >
          {examQuestions.length > 0 && examQuestions[currentQuestion] && (
            <div className="question-container">
              <h4 className="question-text">
                Q{currentQuestion + 1}: {examQuestions[currentQuestion].question}
              </h4>
              
              <div className="options-container">
                {examQuestions[currentQuestion].options.map((option, idx) => (
                  <label key={idx} className="option-label">
                    <input
                      type="radio"
                      name={`question_${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() => handleAnswerSelect(currentQuestion, option)}
                      className="option-radio"
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* UPDATED navigation with restrictions */}
        <div className="exam-navigation">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="nav-btn prev"
          >
            Previous
          </button>
          
          {currentQuestion === examQuestions.length - 1 ? (
            <button
              onClick={handleExamSubmit}
              disabled={loading || !answers[currentQuestion] || Object.keys(answers).length < examQuestions.length}
              className="nav-btn submit-exam"
            >
              {loading ? <Loader2 className="spinner" /> : 'Submit Exam'}
            </button>
          ) : (
            <button
              onClick={() => {
                // Only allow navigation if current question is answered
                if (answers[currentQuestion]) {
                  setCurrentQuestion(prev => Math.min(examQuestions.length - 1, prev + 1));
                } else {
                  showToast('Please answer the current question before proceeding.', 'error');
                }
              }}
              disabled={!answers[currentQuestion]}
              className={`nav-btn next ${!answers[currentQuestion] ? 'disabled' : ''}`}
            >
              Next
            </button>
          )}
        </div>

        <div className="exam-questions-status">
          <div className="status-label">Questions:</div>
          {examQuestions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                // Allow clicking on status buttons only if question is answered
                if (answers[idx] || idx === currentQuestion) {
                  setCurrentQuestion(idx);
                } else {
                  showToast('Please answer the current question first.', 'error');
                }
              }}
              className={`question-status-btn ${answers[idx] ? 'answered' : ''} ${currentQuestion === idx ? 'active' : ''}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        <div className="exam-footer">
          <p className="exam-instructions">
            Please answer all questions. You have {Math.floor(examTimer / 60)} minutes to complete the assessment.
          </p>
        </div>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </div>
  );
}

  // Render success/result state
  if (success || examSubmitted) {
    return (
      <div className="exam-modal-overlay">
        <div className="exam-modal form-modal">
          <div className="exam-modal-header">
            <h3>{examResult?.passed ? '🎉 Congratulations!' : 'Assessment Complete'}</h3>
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>
          
          <div className="success-content">
            {examResult?.passed ? (
              <>
                <CheckCircle size={48} className="success-icon" />
                <h4>Exam Passed Successfully!</h4>
                <div className="score-display">
                  <span className="score-value">{Math.round(examResult.score)}%</span>
                  <span className="score-label">Score</span>
                </div>
                <div className="exam-result">
                  <div className="result-grid">
                    <div className="result-item">
                      <span className="result-label">Total Questions</span>
                      <span className="result-value">{examResult.totalQuestions}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Attempted</span>
                      <span className="result-value">{examResult.attemptedQuestions}</span>
                    </div>
                    <div className="result-item correct">
                      <span className="result-label">✅ Correct</span>
                      <span className="result-value">{examResult.correctAnswers}</span>
                    </div>
                    <div className="result-item wrong">
                      <span className="result-label">❌ Wrong</span>
                      <span className="result-value">{examResult.wrongAnswers}</span>
                    </div>
                  </div>
                  <p className="exam-details">Your exam result has been recorded successfully.</p>
                </div>
              </>
            ) : examResult && !examResult.passed ? (
              <>
                <AlertCircle size={48} className="error-icon" />
                <h4>Exam Score: {Math.round(examResult.score)}%</h4>
                <div className="score-display">
                  <span className="score-value">{Math.round(examResult.score)}%</span>
                  <span className="score-label">Score</span>
                </div>
                <div className="exam-result failed">
                  <div className="result-grid">
                    <div className="result-item">
                      <span className="result-label">Total Questions</span>
                      <span className="result-value">{examResult.totalQuestions}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Attempted</span>
                      <span className="result-value">{examResult.attemptedQuestions}</span>
                    </div>
                    <div className="result-item correct">
                      <span className="result-label">✅ Correct</span>
                      <span className="result-value">{examResult.correctAnswers}</span>
                    </div>
                    <div className="result-item wrong">
                      <span className="result-label">❌ Wrong</span>
                      <span className="result-value">{examResult.wrongAnswers}</span>
                    </div>
                  </div>
                  <p className="exam-feedback">
                    Thank you for your interest. We encourage you to apply for other positions.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle size={48} className="success-icon" />
                <h4>Exam Submitted Successfully!</h4>
                <p>Your exam results have been recorded.</p>
              </>
            )}
            
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}