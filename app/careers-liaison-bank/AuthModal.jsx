// app/careers-liaison-bank/components/AuthModal.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import './AuthModal.scss';
import Swal from 'sweetalert2';

const createInitialFormData = () => ({
  email: '',
  password: '',
  full_name: '',
  phone: '',
  confirm_password: '',
  date_of_birth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  total_experience: '',
  current_company: '',
  current_designation: '',
  current_ctc: '',
  expected_ctc: '',
  notice_period: '',
  highest_qualification: '',
  specialization: '',
  university: '',
  graduation_year: '',
  skills: '',
  linkedin_url: '',
  portfolio_url: '',
  github_url: '',
  career_summary: '',
  profile_image: null,
  resume: null,
});

export default function AuthModal({ isOpen, onClose, mode = 'login', onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState(createInitialFormData);

  const resumeInputRef = useRef(null);
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentRegisterStep, setCurrentRegisterStep] = useState(0);
  const registerStepRef = useRef(null);
  const authModalRef = useRef(null);

  const registerSteps = [
    {
      id: 'profile',
      label: 'Your Profile',
      description: 'Enter your account information to create your candidate profile.',
    },
    {
      id: 'professional',
      label: 'Professional Info',
      description: 'Tell us about your education, skills, and work experience.',
    },
    {
      id: 'additional',
      label: 'Additional Details',
      description: 'Add your address, resume, and optional professional links.',
    },
  ];

  const updateRegisterField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: '' }));
    setError('');
  };

  // Resume validation is opt-in and should run only when the user clicks
  // Create Account, never while navigating into the Additional Details step.
  const validateRegisterStep = (
    stepIndex,
    { validateResume = false, showAlert = false } = {}
  ) => {
    console.log("inside validate");
    const nextErrors = {};
    const checkedFields =
      stepIndex === 0
        ? ['full_name', 'email', 'phone', 'password', 'confirm_password']
        : stepIndex === 1
          ? ['graduation_year', 'notice_period']
          : stepIndex === 2 && validateResume
            ? ['resume', 'pincode']
            : [];

    if (stepIndex === 0) {
      if (!formData.full_name.trim()) nextErrors.full_name = 'Full name is required.';
      if (!formData.email.trim()) {
        nextErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        nextErrors.email = 'Enter a valid email address.';
      }
      if (!formData.phone.trim()) {
        nextErrors.phone = 'Phone number is required.';
      } else if (!/^\d{10}$/.test(formData.phone.trim())) {
        nextErrors.phone = 'Phone number must contain exactly 10 digits.';
      }
      if (!formData.password) {
        nextErrors.password = 'Password is required.';
      } else if (formData.password.length < 6) {
        nextErrors.password = 'Password must be at least 6 characters.';
      }
      if (!formData.confirm_password) {
        nextErrors.confirm_password = 'Please confirm your password.';
      } else if (formData.password !== formData.confirm_password) {
        nextErrors.confirm_password = 'Passwords do not match.';
      }
    }

    if (stepIndex === 1) {
      const graduationYear = formData.graduation_year.trim();
      const currentYear = new Date().getFullYear();

      if (graduationYear) {
        if (!/^\d{4}$/.test(graduationYear)) {
          nextErrors.graduation_year =
            'Enter a valid four-digit graduation year.';
        } else if (
          Number(graduationYear) < 1900 ||
          Number(graduationYear) > currentYear + 10
        ) {
          nextErrors.graduation_year =
            `Graduation year must be between 1900 and ${currentYear + 10}.`;
        }
      }

      const noticePeriod = formData.notice_period.trim();

      if (noticePeriod && !/^\d+$/.test(noticePeriod)) {
        nextErrors.notice_period =
          'Notice period must be a whole number of days.';
      }
    }

    if (stepIndex === 2 && formData.pincode.trim()) {
      if (!/^\d{6}$/.test(formData.pincode.trim())) {
        nextErrors.pincode = 'Pincode must contain exactly 6 digits.';
      }
    }

    if (stepIndex === 3 && validateResume) {
      console.log("stepIndex", stepIndex)
      console.log("validate resume", validateResume);
      if (!formData.resume) {
        nextErrors.resume = 'Please upload your resume.';
      } else {
        const extension = formData.resume.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(extension)) {
          nextErrors.resume = 'Resume must be a PDF, DOC, or DOCX file.';
        } else if (formData.resume.size > 5 * 1024 * 1024) {
          nextErrors.resume = 'Resume file size must not exceed 5 MB.';
        }
      }
    }

    setFieldErrors((previous) => {
      const next = { ...previous };
      checkedFields.forEach((field) => delete next[field]);
      return { ...next, ...nextErrors };
    });

    const firstMessage = Object.values(nextErrors)[0];
    if (firstMessage) {
      setError('');
      if (showAlert) {
        Swal.fire({
          icon: 'warning',
          title: 'Please check your details',
          text: firstMessage,
          confirmButtonColor: '#F26522',
        });
      }
      return false;
    }

    setError('');
    return true;
  };

  const goToNextRegisterStep = () => {
    // Next validates only the currently visible step. Resume is not validated
    // until the final Create Account action.
    if (!validateRegisterStep(currentRegisterStep)) return;

    const nextStep = Math.min(currentRegisterStep + 1, registerSteps.length - 1);
    if (nextStep === 2) {
      setFieldErrors((previous) => ({ ...previous, resume: '' }));
    }
    setCurrentRegisterStep(nextStep);
  };

  const handleRegisterStepClick = (targetIndex) => {
    if (targetIndex <= currentRegisterStep) {
      if (targetIndex === 2) {
        setFieldErrors((previous) => ({ ...previous, resume: '' }));
      }
      setCurrentRegisterStep(targetIndex);
      setError('');
      return;
    }

    for (let stepIndex = currentRegisterStep; stepIndex < targetIndex; stepIndex += 1) {
      if (!validateRegisterStep(stepIndex)) return;
    }

    // Entering Additional Details should not produce a resume error yet.
    if (targetIndex === 2) {
      setFieldErrors((previous) => ({ ...previous, resume: '' }));
    }
    setCurrentRegisterStep(targetIndex);
    setError('');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  useEffect(() => {
    if (!error) return;

    Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text: error,
      confirmButtonText: 'OK',
      confirmButtonColor: '#F26522',
    });
  }, [error]);


  useEffect(() => {
    if (!isOpen || currentMode !== 'register') return;

    const modal = authModalRef.current;
    if (!modal) return;

    modal.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [isOpen, currentMode, currentRegisterStep]);



  if (!isOpen) return null;


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/career-candidates/login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const token = data.access_token || data.token;
        const userData = data.data || data.user;

        if (token && userData) {
          localStorage.setItem('career_token', token);
          localStorage.setItem('career_user', JSON.stringify(userData));
          setSuccess(true);

          if (onSuccess) onSuccess(userData);

          setTimeout(() => {
            setSuccess(false);
            onClose();
          }, 1000);
        } else {
          setError('Invalid response from server');
        }
      } else {
        setError(data.detail || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("inside handle submit");
    // The registration API may only be called from the final step.
    // Enter-key submissions on earlier steps advance the wizard instead.
    if (currentRegisterStep !== registerSteps.length - 1) {
      const isCurrentStepValid = validateRegisterStep(currentRegisterStep);

      if (isCurrentStepValid) {
        setCurrentRegisterStep((step) =>
          Math.min(step + 1, registerSteps.length - 1)
        );
      }
      return;
    }

    if (loading) return;

    // setLoading(true);
setError('');

    // Re-check required details before submitting, even if the user navigated
    // backward or the component state was changed unexpectedly.
    // 1. Validate Your Profile
if (!validateRegisterStep(0)) {
  setCurrentRegisterStep(0);
  Swal.fire({
    icon: 'warning',
    title: 'Complete your profile',
    text: 'Please correct the highlighted fields in Your Profile before submitting.',
    confirmButtonColor: '#F26522',
  });
  return;
}

// 2. Validate Professional Info
if (!validateRegisterStep(1, { showAlert: true })) {
  setCurrentRegisterStep(1);
  return;
}

// 3. Validate Additional Details, including pincode and resume
if (!validateRegisterStep(2, {
  validateResume: true,
  showAlert: true,
})) return;

    setLoading(true);
    setError('');

    // Validation
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Resume is required for registration.
    if (!formData.resume) {
      const message = 'Please upload your resume before creating your account.';

      setFieldErrors((prev) => ({
        ...prev,
        resume: message,
      }));

      setError('');

      await Swal.fire({
        icon: 'warning',
        title: 'Resume Required',
        text: message,
        confirmButtonText: 'Upload Resume',
        confirmButtonColor: '#F26522',
      });

      setLoading(false);
      return;
    }

    const resumeExtension = formData.resume.name.split('.').pop()?.toLowerCase();
    const allowedResumeExtensions = ['pdf', 'doc', 'docx'];
    if (!allowedResumeExtensions.includes(resumeExtension)) {
      setError('Resume must be a PDF, DOC, or DOCX file.');
      setLoading(false);
      return;
    }

    if (formData.resume.size > 5 * 1024 * 1024) {
      setError('Resume file size must not exceed 5 MB.');
      setLoading(false);
      return;
    }

    // Create FormData
    const formDataObj = new FormData();

    // Required fields
    formDataObj.append('full_name', formData.full_name.trim());
    formDataObj.append('email', formData.email.trim().toLowerCase());
    formDataObj.append('phone', formData.phone.trim());
    formDataObj.append('password', formData.password);
    formDataObj.append('resume', formData.resume);

    // Optional fields - only append if they have values
    if (formData.date_of_birth) {
      formDataObj.append('date_of_birth', formData.date_of_birth);
    }
    if (formData.gender) {
      formDataObj.append('gender', formData.gender);
    }
    if (formData.address) {
      formDataObj.append('address', formData.address.trim());
    }
    if (formData.city) {
      formDataObj.append('city', formData.city.trim());
    }
    if (formData.state) {
      formDataObj.append('state', formData.state.trim());
    }
    if (formData.country) {
      formDataObj.append('country', formData.country.trim());
    }
    if (formData.pincode) {
      formDataObj.append('pincode', formData.pincode.trim());
    }
    if (formData.total_experience) {
      formDataObj.append('total_experience', formData.total_experience);
    }
    if (formData.current_company) {
      formDataObj.append('current_company', formData.current_company.trim());
    }
    if (formData.current_designation) {
      formDataObj.append('current_designation', formData.current_designation.trim());
    }
    if (formData.current_ctc) {
      formDataObj.append('current_ctc', formData.current_ctc.trim());
    }
    if (formData.expected_ctc) {
      formDataObj.append('expected_ctc', formData.expected_ctc.trim());
    }
    if (formData.notice_period) {
      formDataObj.append('notice_period', formData.notice_period.trim());
    }
    if (formData.highest_qualification) {
      formDataObj.append('highest_qualification', formData.highest_qualification);
    }
    if (formData.specialization) {
      formDataObj.append('specialization', formData.specialization.trim());
    }
    if (formData.university) {
      formDataObj.append('university', formData.university.trim());
    }
    if (formData.graduation_year) {
      formDataObj.append('graduation_year', formData.graduation_year.trim());
    }
    if (formData.skills) {
      formDataObj.append('skills', formData.skills.trim());
    }
    if (formData.linkedin_url) {
      formDataObj.append('linkedin_url', formData.linkedin_url.trim());
    }
    if (formData.portfolio_url) {
      formDataObj.append('portfolio_url', formData.portfolio_url.trim());
    }
    if (formData.github_url) {
      formDataObj.append('github_url', formData.github_url.trim());
    }
    if (formData.career_summary) {
      formDataObj.append('career_summary', formData.career_summary.trim());
    }

    // Log FormData contents for debugging
    console.log('📤 Sending FormData:');
    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/career-candidates`, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with proper boundary
        body: formDataObj,
      });

      const data = await response.json();
      console.log('📥 Response:', { status: response.status, data });

      if (response.ok) {
        // Reset every registration field and the native file input immediately.
        // The success screen stays visible while the reset form state is already clean.
        setFormData(createInitialFormData());
        setFieldErrors({});
        setCurrentRegisterStep(0);
        setIsDraggingResume(false);
        setError('');
        if (resumeInputRef.current) resumeInputRef.current.value = '';

        setSuccess(true);
        setTimeout(() => {
          setCurrentMode('login');
          setSuccess(false);
        }, 2000);
      } else {
        // Handle validation errors
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const errorMessages = data.detail.map(err => err.msg || err).join(', ');
            setError(errorMessages);
          } else if (typeof data.detail === 'object') {
            setError(JSON.stringify(data.detail));
          } else {
            setError(data.detail);
          }
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setCurrentMode(currentMode === 'login' ? 'register' : 'login');
    setCurrentRegisterStep(0);
    setFieldErrors({});
    setError('');
    setSuccess(false);
    setIsDraggingResume(false);
    setFormData(createInitialFormData());
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const handleResumeSelection = (file) => {
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedExtensions.includes(extension)) {
      const message = 'Resume must be a PDF, DOC, or DOCX file.';
      setFormData((previous) => ({ ...previous, resume: null }));
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      setFieldErrors((previous) => ({ ...previous, resume: message }));
      setError('');
      Swal.fire({ icon: 'warning', title: 'Invalid resume', text: message, confirmButtonColor: '#F26522' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = 'Resume file size must not exceed 5 MB.';
      setFormData((previous) => ({ ...previous, resume: null }));
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      setFieldErrors((previous) => ({ ...previous, resume: message }));
      setError('');
      Swal.fire({ icon: 'warning', title: 'Resume is too large', text: message, confirmButtonColor: '#F26522' });
      return;
    }

    setFormData((previous) => ({ ...previous, resume: file }));
    setFieldErrors((previous) => ({ ...previous, resume: '' }));
    setError('');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        ref={authModalRef}
        className={`auth-modal ${
  currentMode === 'register' ? 'auth-modal--register' : ''
} ${
  success && currentMode === 'register'
    ? 'auth-modal--register-success'
    : ''
}`}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          e.stopPropagation();
          if (e.deltaY !== 0) e.currentTarget.scrollTop += e.deltaY;
        }}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close authentication dialog"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <div className="auth-modal-content">
          {success && currentMode === 'login' && (
            <div className="auth-success">
              <span className="success-icon">✓</span>
              <h3>Login Successful!</h3>
              <p>Welcome back!</p>
            </div>
          )}

          {success && currentMode === 'register' && (
  <div
    className="auth-success auth-success--register"
    role="status"
    aria-live="polite"
  >
    <span className="success-icon" aria-hidden="true">
      ✓
    </span>

    <h3>Registration Successful!</h3>

    <p>
      Your account has been created successfully.
      Please sign in with your credentials.
    </p>
  </div>
)}

          {!success && (
            <>
              {currentMode === 'login' && (
                <div className="auth-header">
                  <h2>Welcome Back</h2>
                </div>
              )}

              {/* {error && (
                <div className="auth-error" role="alert">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <span>{error}</span>
                </div>
              )} */}

              {currentMode === 'login' ? (
                <form onSubmit={handleLogin} className="auth-form login-form">
                  <div className="form-group">
                    <label htmlFor="auth-login-email">Email Address <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <input
                        id="auth-login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="auth-login-password">Password <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <input
                        id="auth-login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="remember-me">
                      <input type="checkbox" />
                      Remember me
                    </label>
                    <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                  </div>

                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => e.preventDefault()} className="auth-form register-form register-wizard-form" noValidate>
                  <div className="register-wizard">
                    <div className="register-mobile-progress-header" aria-live="polite">
                      <div className="register-mobile-progress-header-bars" role="img" aria-label={`Step ${currentRegisterStep + 1} of ${registerSteps.length}`}>
                        {registerSteps.map((step, index) => (
                          <span
                            key={step.id}
                            className={`register-mobile-progress-header-segment ${index < currentRegisterStep ? 'is-complete' : ''} ${index === currentRegisterStep ? 'is-active' : ''}`}
                          />
                        ))}
                      </div>
                      <div className="register-mobile-progress-header-meta">
                        {/* <span>Create IBMid</span> */}
                        <span>{currentRegisterStep + 1}/{registerSteps.length}</span>
                      </div>
                    </div>
                    <nav className="register-wizard-sidebar" aria-label="Registration steps">
                      {registerSteps.map((step, index) => (
                        <div className="register-step-item" key={step.id}>
                          <button
                            type="button"
                            className={`register-step-nav ${currentRegisterStep === index ? 'is-active' : ''} ${currentRegisterStep > index ? 'is-complete' : ''}`}
                            aria-current={currentRegisterStep === index ? 'step' : undefined}
                            onClick={() => handleRegisterStepClick(index)}
                          >
                            <span className="register-step-number" aria-hidden="true">{index + 1}</span>
                            <span className="register-step-label">{step.label}</span>
                          </button>
                          {index < registerSteps.length - 1 && (
                            <span
                              className={`register-step-connector ${currentRegisterStep > index ? 'is-complete' : ''}`}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      ))}
                    </nav>

                    <div className="register-wizard-panel">
                      <div className="register-step-heading">
                        <span className="register-step-count">Step {currentRegisterStep + 1}</span>
                        <h3>{registerSteps[currentRegisterStep].label}</h3>
                        <p>{registerSteps[currentRegisterStep].description}</p>
                      </div>

                      <div className="register-step-content" ref={registerStepRef} key={registerSteps[currentRegisterStep].id}>
                        {currentRegisterStep === 0 && (
                          <div className="register-grid register-grid--two">
                            <div className="form-group">
                              <label htmlFor="auth-full-name">Full Name <span className="required">*</span></label>
                              <div className="input-wrapper">
                                <input id="auth-full-name" type="text" placeholder="Enter your full name" autoComplete="name" value={formData.full_name} onChange={(e) => updateRegisterField('full_name', e.target.value)} aria-invalid={Boolean(fieldErrors.full_name)} required />
                              </div>
                              {fieldErrors.full_name && <small className="register-field-error" role="alert">{fieldErrors.full_name}</small>}
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-register-email">Email Address <span className="required">*</span></label>
                              <div className="input-wrapper">
                                <input id="auth-register-email" type="email" placeholder="Enter your email" autoComplete="email" value={formData.email} onChange={(e) => updateRegisterField('email', e.target.value)} aria-invalid={Boolean(fieldErrors.email)} required />
                              </div>
                              {fieldErrors.email && <small className="register-field-error" role="alert">{fieldErrors.email}</small>}
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-register-phone">Phone Number <span className="required">*</span></label>
                              <div className="input-wrapper">
                                <input
                                  id="auth-register-phone"
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]{10}"
                                  maxLength={10}
                                  placeholder="Enter your 10-digit phone number"
                                  autoComplete="tel"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    updateRegisterField(
                                      'phone',
                                      e.target.value.replace(/\D/g, '').slice(0, 10)
                                    )
                                  }
                                  aria-invalid={Boolean(fieldErrors.phone)}
                                  required
                                />
                              </div>
                              {fieldErrors.phone && <small className="register-field-error" role="alert">{fieldErrors.phone}</small>}
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-dob">Date of Birth</label>
                              <div className="input-wrapper">
                                <input id="auth-dob" type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} />
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-gender">Gender</label>
                              <div className="input-wrapper">
                                <select id="auth-gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                  <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-total-experience">Total Experience</label>
                              <div className="input-wrapper">
                                <select id="auth-total-experience" value={formData.total_experience} onChange={(e) => setFormData({ ...formData, total_experience: e.target.value })}>
                                  <option value="">Select Experience</option>
                                  <option value="0">Fresher</option>
                                  <option value="1">1 year</option>
                                  <option value="2">2 years</option>
                                  <option value="3">3 years</option>
                                  <option value="4">4 years</option>
                                  <option value="5">5 years</option>
                                  <option value="6">6 years</option>
                                  <option value="7">7 years</option>
                                  <option value="8">8 years</option>
                                  <option value="9">9 years</option>
                                  <option value="10">10 years</option>
                                  <option value="10+">10+ years</option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-register-password">Password <span className="required">*</span></label>
                              <div className="input-wrapper">
                                <input id="auth-register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create password" value={formData.password} onChange={(e) => updateRegisterField('password', e.target.value)} aria-invalid={Boolean(fieldErrors.password)} required minLength={6} />
                                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? '👁️' : '👁️‍🗨️'}</button>
                              </div>
                              <div className="helper-text">Minimum 6 characters</div>
                              {fieldErrors.password && <small className="register-field-error" role="alert">{fieldErrors.password}</small>}
                            </div>
                            <div className="form-group">
                              <label htmlFor="auth-confirm-password">Confirm Password <span className="required">*</span></label>
                              <div className="input-wrapper">
                                <input id="auth-confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your password" value={formData.confirm_password} onChange={(e) => updateRegisterField('confirm_password', e.target.value)} aria-invalid={Boolean(fieldErrors.confirm_password)} required />
                                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</button>
                              </div>
                              {fieldErrors.confirm_password && <small className="register-field-error" role="alert">{fieldErrors.confirm_password}</small>}
                            </div>
                          </div>
                        )}

                        {currentRegisterStep === 1 && (
                          <div className="register-step-sections">
                            <section className="register-form-section">
                              <h4 className="register-section-heading">Education</h4>
                              <div className="register-grid register-grid--two">
                                <div className="form-group">
                                  <label htmlFor="auth-qualification">Highest Qualification</label>
                                  <div className="input-wrapper">
                                    <select id="auth-qualification" value={formData.highest_qualification} onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}>
                                      <option value="">Select Qualification</option>
                                      <option value="10th">10th</option>
                                      <option value="12th">12th</option>
                                      <option value="Diploma">Diploma</option>
                                      <option value="Bachelor">Bachelor's Degree</option>
                                      <option value="Master">Master's Degree</option>
                                      <option value="PhD">PhD</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-specialization">Specialization</label>
                                  <div className="input-wrapper">
                                    <input id="auth-specialization" type="text" placeholder="e.g. Computer Science" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-university">University</label>
                                  <div className="input-wrapper">
                                    <input id="auth-university" type="text" placeholder="University name" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-graduation-year">Graduation Year</label>
                                  <div className="input-wrapper">
                                    <input
                                      id="auth-graduation-year"
                                      type="number"
                                      inputMode="numeric"
                                      min="1900"
                                      max={new Date().getFullYear() + 10}
                                      step="1"
                                      placeholder="e.g. 2020"
                                      value={formData.graduation_year}
                                      onChange={(e) =>
                                        updateRegisterField('graduation_year', e.target.value)
                                      }
                                      aria-invalid={Boolean(fieldErrors.graduation_year)}
                                    />
                                  </div>
                                  {fieldErrors.graduation_year && (
                                    <small className="register-field-error" role="alert">
                                      {fieldErrors.graduation_year}
                                    </small>
                                  )}
                                </div>
                                <div className="form-group register-grid-full">
                                  <label htmlFor="auth-skills">Skills</label>
                                  <div className="input-wrapper">
                                    <input id="auth-skills" type="text" placeholder="React, Python, SQL" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section className="register-form-section">
                              <h4 className="register-section-heading">Professional Information</h4>
                              <div className="register-grid register-grid--two">
                                <div className="form-group">
                                  <label htmlFor="auth-current-company">Current Company</label>
                                  <div className="input-wrapper">
                                    <input id="auth-current-company" type="text" placeholder="Current organization" value={formData.current_company} onChange={(e) => setFormData({ ...formData, current_company: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-current-designation">Current Designation</label>
                                  <div className="input-wrapper">
                                    <input id="auth-current-designation" type="text" placeholder="Current designation" value={formData.current_designation} onChange={(e) => setFormData({ ...formData, current_designation: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-current-ctc">Current CTC (₹ LPA)</label>
                                  <div className="input-wrapper">
                                    <input id="auth-current-ctc" type="text" placeholder="Current annual salary" value={formData.current_ctc} onChange={(e) => setFormData({ ...formData, current_ctc: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-expected-ctc">Expected CTC (₹ LPA)</label>
                                  <div className="input-wrapper">
                                    <input id="auth-expected-ctc" type="text" placeholder="Expected annual salary" value={formData.expected_ctc} onChange={(e) => setFormData({ ...formData, expected_ctc: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-notice-period">Notice Period (days)</label>
                                  <div className="input-wrapper">
                                    <input
                                      id="auth-notice-period"
                                      type="number"
                                      inputMode="numeric"
                                      min="0"
                                      step="1"
                                      placeholder="e.g. 30"
                                      value={formData.notice_period}
                                      onChange={(e) =>
                                        updateRegisterField('notice_period', e.target.value)
                                      }
                                      aria-invalid={Boolean(fieldErrors.notice_period)}
                                    />
                                  </div>
                                  {fieldErrors.notice_period && (
                                    <small className="register-field-error" role="alert">
                                      {fieldErrors.notice_period}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </section>
                          </div>
                        )}

                        {currentRegisterStep === 2 && (
                          <div className="register-step-sections">
                            <section className="register-form-section">
                              <h4 className="register-section-heading">Address</h4>
                              <div className="register-grid register-grid--two">
                                <div className="form-group">
                                  <label htmlFor="auth-country">Country</label>
                                  <div className="input-wrapper">
                                    <input id="auth-country" type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-state">State</label>
                                  <div className="input-wrapper">
                                    <input id="auth-state" type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-city">City</label>
                                  <div className="input-wrapper">
                                    <input id="auth-city" type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="auth-pincode">Pincode</label>
                                  <div className="input-wrapper">
                                    <input
                                      id="auth-pincode"
                                      type="number"
                                      inputMode="numeric"
                                      min="100000"
                                      max="999999"
                                      step="1"
                                      placeholder="Enter 6-digit pincode"
                                      value={formData.pincode}
                                      onChange={(e) =>
                                        updateRegisterField('pincode', e.target.value)
                                      }
                                      aria-invalid={Boolean(fieldErrors.pincode)}
                                    />
                                  </div>
                                  {fieldErrors.pincode && (
                                    <small className="register-field-error" role="alert">
                                      {fieldErrors.pincode}
                                    </small>
                                  )}
                                </div>
                                <div className="form-group register-grid-full">
                                  <label htmlFor="auth-address">Address</label>
                                  <div className="input-wrapper">
                                    <textarea id="auth-address" placeholder="Street address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} />
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section className="register-form-section">
                              <h4 className="register-section-heading">Resume & Professional Links</h4>
                              <div className="register-documents-content">
                                <div className="form-group resume-upload-group">
                                  <input
                                    ref={resumeInputRef}
                                    id="auth-resume-upload"
                                    className="resume-file-input"
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(e) => handleResumeSelection(e.target.files?.[0])}
                                    aria-describedby="resume-upload-help"
                                  />
                                  <div
                                    className={`resume-upload-zone ${isDraggingResume ? 'is-dragging' : ''} ${formData.resume ? 'has-file' : ''}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Upload resume"
                                    onClick={() => resumeInputRef.current?.click()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        resumeInputRef.current?.click();
                                      }
                                    }}
                                    onDragEnter={(e) => {
                                      e.preventDefault();
                                      setIsDraggingResume(true);
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      setIsDraggingResume(true);
                                    }}
                                    onDragLeave={(e) => {
                                      e.preventDefault();
                                      if (!e.currentTarget.contains(e.relatedTarget)) setIsDraggingResume(false);
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      setIsDraggingResume(false);
                                      handleResumeSelection(e.dataTransfer.files?.[0]);
                                    }}
                                  >
                                    <svg className="resume-upload-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15.5V20h14v-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="resume-upload-copy">{formData.resume ? formData.resume.name : 'Drag and Drop Your Resume'}</span>
                                    <span className="resume-or">OR</span>
                                    <button
                                      type="button"
                                      className="resume-browse-button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        resumeInputRef.current?.click();
                                      }}
                                    >
                                      Browse File
                                    </button>
                                    {formData.resume && (
                                      <button
                                        type="button"
                                        className="resume-remove-button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFormData((previous) => ({ ...previous, resume: null }));
                                          if (resumeInputRef.current) resumeInputRef.current.value = '';
                                          setError('');
                                        }}
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                  <p id="resume-upload-help" className="resume-helper-text"><span className="required">*</span> Required. PDF, DOC, or DOCX format, up to 5 MB.</p>
                                  {fieldErrors.resume && <small className="register-field-error" role="alert">{fieldErrors.resume}</small>}
                                </div>

                                <div className="register-grid register-grid--two register-social-grid">
                                  <div className="form-group">
                                    <label htmlFor="auth-linkedin">LinkedIn URL</label>
                                    <div className="input-wrapper">
                                      <input id="auth-linkedin" type="url" placeholder="https://linkedin.com/in/username" value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="auth-portfolio">Portfolio URL</label>
                                    <div className="input-wrapper">
                                      <input id="auth-portfolio" type="url" placeholder="https://yourportfolio.com" value={formData.portfolio_url} onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })} />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="auth-github">GitHub URL</label>
                                    <div className="input-wrapper">
                                      <input id="auth-github" type="url" placeholder="https://github.com/username" value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group register-career-summary">
                                  <label htmlFor="auth-career-summary">Career Summary</label>
                                  <div className="input-wrapper">
                                    <textarea id="auth-career-summary" placeholder="Brief summary of your career" value={formData.career_summary} onChange={(e) => setFormData({ ...formData, career_summary: e.target.value })} rows={3} />
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
                        )}
                      </div>

                      <div className={`register-actions ${currentRegisterStep === 0 ? 'is-first-step' : ''}`}>
                        <button
                          type="button"
                          className={`register-back-btn ${currentRegisterStep === 0 ? 'is-first-step' : ''}`}
                          onClick={() => {
                            if (currentRegisterStep === 0) {
                              switchMode();
                            } else {
                              setCurrentRegisterStep((step) => Math.max(step - 1, 0));
                              setError('');
                            }
                          }}
                        >
                          <span aria-hidden="true">‹</span> Back
                        </button>
                        {currentRegisterStep < registerSteps.length - 1 ? (
                          <button type="button" className="register-next-btn" onClick={goToNextRegisterStep}>
                            Next <span aria-hidden="true">›</span>
                          </button>
                        ) : (
                          <button type="submit" onClick={handleRegister} className="auth-create-btn" disabled={loading}>
                            {loading ? 'Creating Accountt...' : 'Create Account'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              )}

              <div className="auth-footer">
                <p>
                  {currentMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button type="button" className="auth-switch-btn" onClick={switchMode}>
                    {currentMode === 'login' ? 'Create one now' : 'Sign in instead'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
