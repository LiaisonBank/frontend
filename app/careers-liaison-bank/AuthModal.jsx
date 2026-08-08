// app/careers-liaison-bank/components/AuthModal.jsx
"use client";
import { useState, useEffect } from 'react';
import './AuthModal.scss';

export default function AuthModal({ isOpen, onClose, mode = 'login', onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
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
    resume: null
  });

  const [showRegistrationFields, setShowRegistrationFields] = useState(false);

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
        // Store token and user data
        const token = data.access_token || data.token;
        const userData = data.data || data.user;
        
        if (token && userData) {
          localStorage.setItem('career_token', token);
          localStorage.setItem('career_user', JSON.stringify(userData));
          
          setSuccess(true);
          
          // Call onSuccess with user data
          if (onSuccess) {
            onSuccess(userData);
          }
          
          // Close modal after short delay without page reload
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

    // Create FormData
    const formDataObj = new FormData();
    
    // Required fields
    formDataObj.append('full_name', formData.full_name.trim());
    formDataObj.append('email', formData.email.trim().toLowerCase());
    formDataObj.append('phone', formData.phone.trim());
    formDataObj.append('password', formData.password);
    
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
        setSuccess(true);
        setTimeout(() => {
          setCurrentMode('login');
          setSuccess(false);
          // Reset form
          setFormData({
            ...formData,
            password: '',
            confirm_password: ''
          });
          setError('');
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
    setError('');
    setSuccess(false);
    setFormData({
      ...formData,
      password: '',
      confirm_password: ''
    });
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-modal-content">
          {success && currentMode === 'login' && (
            <div className="auth-success">
              <span className="success-icon">✅</span>
              <h3>Login Successful!</h3>
              <p>Welcome back!</p>
            </div>
          )}

          {success && currentMode === 'register' && (
            <div className="auth-success">
              <span className="success-icon">✅</span>
              <h3>Registration Successful!</h3>
              <p>Please login with your credentials.</p>
            </div>
          )}

          {!success && (
            <>
              <div className="auth-header">
                <h2>{currentMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{currentMode === 'login' ? 'Sign in to apply for positions' : 'Join our talent community'}</p>
              </div>

              {error && (
                <div className="auth-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {currentMode === 'login' ? (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="form-group">
                    <label>Email Address <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
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
                    <a href="#" className="forgot-link">Forgot password?</a>
                  </div>

                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="auth-form register-form">
                  {/* Personal Information */}
                  <div className="section-title">Personal Information</div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email Address <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Date of Birth</label>
                      <div className="input-wrapper">
                        <input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Gender</label>
                      <div className="input-wrapper">
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Total Experience</label>
                      <div className="input-wrapper">
                        <select
                          value={formData.total_experience}
                          onChange={(e) => setFormData({...formData, total_experience: e.target.value})}
                        >
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
                  </div>

                  <button 
                    type="button" 
                    className="toggle-fields-btn"
                    onClick={() => setShowRegistrationFields(!showRegistrationFields)}
                  >
                    {showRegistrationFields ? 'Hide Additional Fields' : 'Show Additional Fields'}
                  </button>

                  {showRegistrationFields && (
                    <>
                      {/* Professional Information */}
                      <div className="section-title">Professional Information</div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Current Company</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="Current employer"
                              value={formData.current_company}
                              onChange={(e) => setFormData({...formData, current_company: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Current Designation</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="Job title"
                              value={formData.current_designation}
                              onChange={(e) => setFormData({...formData, current_designation: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Current CTC (₹ LPA)</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="e.g. 5"
                              value={formData.current_ctc}
                              onChange={(e) => setFormData({...formData, current_ctc: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Expected CTC (₹ LPA)</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="e.g. 8"
                              value={formData.expected_ctc}
                              onChange={(e) => setFormData({...formData, expected_ctc: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Notice Period (days)</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="e.g. 30"
                              value={formData.notice_period}
                              onChange={(e) => setFormData({...formData, notice_period: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Highest Qualification</label>
                          <div className="input-wrapper">
                            <select
                              value={formData.highest_qualification}
                              onChange={(e) => setFormData({...formData, highest_qualification: e.target.value})}
                            >
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
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Specialization</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="e.g. Computer Science"
                              value={formData.specialization}
                              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>University</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="University name"
                              value={formData.university}
                              onChange={(e) => setFormData({...formData, university: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Graduation Year</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="e.g. 2020"
                              value={formData.graduation_year}
                              onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Skills</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="React, Python, SQL"
                              value={formData.skills}
                              onChange={(e) => setFormData({...formData, skills: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="section-title">Address Information</div>

                      <div className="form-group">
                        <label>Address</label>
                        <div className="input-wrapper">
                          <textarea
                            placeholder="Street address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            rows="2"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="City"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>State</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="State"
                              value={formData.state}
                              onChange={(e) => setFormData({...formData, state: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Country</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="Country"
                              value={formData.country}
                              onChange={(e) => setFormData({...formData, country: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Pincode</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={formData.pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="section-title">Social Links</div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>LinkedIn URL</label>
                          <div className="input-wrapper">
                            <input
                              type="url"
                              placeholder="https://linkedin.com/in/username"
                              value={formData.linkedin_url}
                              onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>GitHub URL</label>
                          <div className="input-wrapper">
                            <input
                              type="url"
                              placeholder="https://github.com/username"
                              value={formData.github_url}
                              onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Career Summary</label>
                        <div className="input-wrapper">
                          <textarea
                            placeholder="Brief summary of your career"
                            value={formData.career_summary}
                            onChange={(e) => setFormData({...formData, career_summary: e.target.value})}
                            rows="3"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Password Section */}
                  <div className="section-title">Security</div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Password <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      <div className="helper-text">Minimum 6 characters</div>
                    </div>

                    <div className="form-group">
                      <label>Confirm Password <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                          required
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              <div className="auth-footer">
                <p>
                  {currentMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  {' '}
                  <button className="auth-switch-btn" onClick={switchMode}>
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