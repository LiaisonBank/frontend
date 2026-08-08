// Frontend - AddReview.jsx (Updated with requested changes)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./addreviews.scss";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_REVIEW_LENGTH = 2000;

const API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:8000';

export default function AddReview() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company_type: "company",
    company: "",
    brand_name: "",
    address: "",
    review: "",
    rating: 5.0,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          newErrors.name = 'Client name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          newErrors.name = 'Name must be less than 100 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'company':
        if (!value || !value.trim()) {
          newErrors.company = 'Company/Individual name is required';
        } else {
          delete newErrors.company;
        }
        break;

      case 'review':
        if (!value || !value.trim()) {
          newErrors.review = 'Review text is required';
        } else if (value.trim().length < 10) {
          newErrors.review = 'Review must be at least 10 characters';
        } else if (value.trim().length > MAX_REVIEW_LENGTH) {
          newErrors.review = `Review must be less than ${MAX_REVIEW_LENGTH} characters`;
        } else {
          delete newErrors.review;
        }
        break;

      case 'rating':
        const ratingValue = parseFloat(value);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
          newErrors.rating = 'Rating must be between 1 and 5';
        } else {
          const decimalPlaces = (value.toString().split('.')[1] || '').length;
          if (decimalPlaces > 1) {
            newErrors.rating = 'Rating can have at most 1 decimal place (e.g., 4.3)';
          } else {
            delete newErrors.rating;
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleCompanyTypeChange = (type) => {
    setFormData({
      ...formData,
      company_type: type,
      company: '',
    });
    if (errors.company) {
      const newErrors = { ...errors };
      delete newErrors.company;
      setErrors(newErrors);
    }
  };

  const handleRatingChange = (value) => {
    const roundedValue = Math.round(value * 10) / 10;
    setFormData({
      ...formData,
      rating: roundedValue,
    });
    validateField('rating', roundedValue);
  };

  const handleRatingInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      const roundedValue = Math.round(value * 10) / 10;
      setFormData({
        ...formData,
        rating: roundedValue,
      });
      validateField('rating', roundedValue);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(null);

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.');
      e.target.value = null;
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
      e.target.value = null;
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        setImageError('Image dimensions must be at least 100x100 pixels');
        e.target.value = null;
        return;
      }
      setFormData({
        ...formData,
        image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    img.onerror = () => {
      setImageError('Failed to load image. Please try another file.');
      e.target.value = null;
    };
    img.src = URL.createObjectURL(file);
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    setImageError(null);
  };

  const validateForm = () => {
    const fieldsToValidate = ['name', 'company', 'review', 'rating'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  const saveReview = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix all validation errors before submitting.",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("designation", formData.designation?.trim() || "");
      
      // Always send company name (whether it's company or individual)
      formDataToSend.append("company", formData.company?.trim() || "");
      
      formDataToSend.append("brand_name", formData.brand_name?.trim() || "");
      formDataToSend.append("address", formData.address?.trim() || "");
      formDataToSend.append("review", formData.review.trim());
      
      const ratingValue = Math.round(parseFloat(formData.rating) * 10) / 10;
      formDataToSend.append("rating", ratingValue.toFixed(1));
      
      formDataToSend.append("priority", "1");
      formDataToSend.append("status", "Inactive"); // Always set to Inactive

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Request failed');
      }

      setSnackbar({
        open: true,
        message: "Review created successfully! 🎉",
        severity: "success",
      });

      setFormData({
        name: "",
        designation: "",
        company_type: "company",
        company: "",
        brand_name: "",
        address: "",
        review: "",
        rating: 5.0,
        image: null,
      });
      setImagePreview(null);
      setErrors({});

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("Error details:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to create review",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderStars = () => {
    const stars = [];
    const rating = Math.round(formData.rating * 2) / 2;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn ${isFilled ? 'filled' : ''}`}
          onClick={() => handleRatingChange(i)}
          aria-label={`Rate ${i} stars`}
        >
          {isFilled ? '⭐' : '☆'}
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className="add-review-container">
      <div className="review-card">
        {/* Header */}
        <div className="review-card-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => router.push("/")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          </div>
          <div className="header-center">
            <h1 className="page-title">New Review</h1>
            <p className="page-subtitle">Share your client's experience</p>
          </div>
          <div className="header-right">
            <span className="status-pill inactive">● Inactive</span>
          </div>
        </div>

        <div className="divider"></div>

        {/* Form */}
        <div className="review-form">
          {/* Row 1: Company/Individual Name + Brand Name */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-with-select">
                  <span>Company/Individual Name</span>
                  <span className="type-selector-inline">

                 
                  </span>
                </span>
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="company"
                className={`form-input ${errors.company ? 'error' : ''}`}
                value={formData.company}
                onChange={handleChange}
                placeholder={formData.company_type === 'company' ? "Enter company name" : "Enter individual name"}
                required
              />
              {errors.company && <span className="error-text">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input
                type="text"
                name="brand_name"
                className="form-input"
                value={formData.brand_name}
                onChange={handleChange}
                placeholder="Brand or product name"
              />
            </div>
          </div>

          {/* Row 2: Client Name + Designation */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Client Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter client name"
                required
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                name="designation"
                className="form-input"
                value={formData.designation}
                onChange={handleChange}
                placeholder="CEO, Founder"
              />
            </div>
          </div>

          {/* Row 3: Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          {/* Review Text */}
          <div className="form-group">
            <label className="form-label">
              Review <span className="required">*</span>
            </label>
            <textarea
              name="review"
              className={`form-textarea ${errors.review ? 'error' : ''}`}
              value={formData.review}
              onChange={handleChange}
              placeholder="Write the client's review or testimonial..."
              rows={4}
              required
            />
            {errors.review && <span className="error-text">{errors.review}</span>}
            <div className="char-counter">
              <span className={`char-count ${formData.review.length > MAX_REVIEW_LENGTH * 0.9 ? 'warning' : ''}`}>
                {formData.review.length}
              </span>
              / {MAX_REVIEW_LENGTH}
            </div>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label className="form-label">
              Rating <span className="required">*</span>
            </label>
            <div className="rating-container">
              <div className="rating-stars">{renderStars()}</div>
              <div className="rating-divider"></div>
              <div className="rating-input-wrapper">
                <input
                  type="number"
                  className="rating-input"
                  value={formData.rating}
                  onChange={handleRatingInputChange}
                  min={1}
                  max={5}
                  step={0.1}
                />
                <span className="rating-max">/ 5.0</span>
              </div>
              <span className={`rating-label ${formData.rating >= 4 ? 'excellent' : formData.rating >= 3 ? 'good' : 'average'}`}>
                {formData.rating >= 4 ? "⭐ Excellent" : formData.rating >= 3 ? "Good" : "Average"}
              </span>
            </div>
            {errors.rating && <span className="error-text">{errors.rating}</span>}
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Client Image</label>
            <div className="image-upload-wrapper">
              {imagePreview ? (
                <div className="image-preview-card">
                  <div className="image-preview-content">
                    <img src={imagePreview} alt="Preview" className="image-preview-avatar" />
                    <div className="image-preview-info">
                      <p className="image-preview-name">{formData.image?.name || "Image uploaded"}</p>
                      <p className="image-preview-size">
                        {formData.image && `${(formData.image.size / 1024).toFixed(1)} KB`}
                      </p>
                      {imageError && <p className="image-error">{imageError}</p>}
                    </div>
                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="image-upload-area">
                  <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  <label htmlFor="image-upload" className="image-upload-label">
                    <div className="upload-icon">📤</div>
                    <span className="upload-text">Drop an image here, or click to browse</span>
                    <span className="upload-hint">PNG, JPG, WEBP, GIF • Max 5MB</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => router.push("/")}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={saveReview} disabled={loading || Object.keys(errors).length > 0}>
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
              )}
              {loading ? "Saving..." : "Save Review"}
            </button>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          <div className="snackbar-content">
            <span>{snackbar.message}</span>
            <button className="snackbar-close" onClick={handleCloseSnackbar}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}