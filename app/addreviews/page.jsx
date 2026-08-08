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
    company: "",
    address: "",
    review: "",
    rating: 5.0,
    status: "Active",
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
    const fieldsToValidate = ['name', 'review', 'rating'];
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
      formDataToSend.append("company", formData.company?.trim() || "");
      formDataToSend.append("address", formData.address?.trim() || "");
      formDataToSend.append("review", formData.review.trim());
      
      const ratingValue = Math.round(parseFloat(formData.rating) * 10) / 10;
      formDataToSend.append("rating", ratingValue.toFixed(1));
      
      formDataToSend.append("priority", "1");
      formDataToSend.append("status", formData.status);

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

      // Reset form
      setFormData({
        name: "",
        designation: "",
        company: "",
        address: "",
        review: "",
        rating: 5.0,
        status: "Active",
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
      <div className="add-review-paper">
        {/* Header */}
        <div className="review-header">
          <div className="review-header-left">
            <button
              className="back-btn"
              onClick={() => router.push("/")}
            >
              ← Back to Home
            </button>
            <div>
              <h1 className="review-title">Create New Review</h1>
              <p className="review-subtitle">
                Add a new client review or testimonial
              </p>
            </div>
          </div>
          <span className={`status-badge ${formData.status === "Active" ? 'active' : 'inactive'}`}>
            {formData.status}
          </span>
        </div>

        <hr className="divider" />

        {/* Form */}
        <div className="review-form">
          {/* Client Name */}
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
              placeholder="e.g., John Doe"
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
            <span className="helper-text">Name of the client giving the review</span>
          </div>

          <div className="form-row">
            {/* Designation */}
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                name="designation"
                className="form-input"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., CEO, Founder"
              />
              <span className="helper-text">Client's job title (optional)</span>
            </div>

            {/* Company */}
            <div className="form-group">
              <label className="form-label">Company</label>
              <input
                type="text"
                name="company"
                className="form-input"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., ABC Corporation"
              />
              <span className="helper-text">Company name (optional)</span>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., New York, USA"
            />
            <span className="helper-text">Client's location (optional)</span>
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
            <span className="helper-text">
              {formData.review.length}/{MAX_REVIEW_LENGTH} characters
            </span>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label className="form-label">
              Rating <span className="required">*</span>
            </label>
            <div className="rating-container">
              <div className="rating-stars">
                {renderStars()}
              </div>
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
                {formData.rating >= 4 ? "Excellent" : formData.rating >= 3 ? "Good" : "Average"}
              </span>
            </div>
            {errors.rating && <span className="error-text">{errors.rating}</span>}
            <span className="helper-text">
              Rate the client's experience from 1 to 5 stars (e.g., 4.3, 4.2, 4.1)
            </span>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Client Image</label>
            <span className="helper-text" style={{ display: 'block', marginBottom: '8px' }}>
              Upload a profile picture of the client (Optional)
              <br />
              <span style={{ fontSize: '0.75rem' }}>
                Allowed: JPG, PNG, WEBP, GIF | Max size: 5MB
              </span>
            </span>

            {imagePreview ? (
              <div className="image-preview-card">
                <div className="image-preview-content">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview-avatar"
                  />
                  <div className="image-preview-info">
                    <p className="image-preview-name">
                      {formData.image?.name || "Image uploaded"}
                    </p>
                    <p className="image-preview-size">
                      {formData.image &&
                        `${(formData.image.size / 1024).toFixed(1)} KB`}
                    </p>
                    {imageError && (
                      <p className="image-error">{imageError}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="image-upload-area">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <span className="upload-icon">📤</span>
                  <span>Click to upload client image</span>
                </label>
              </div>
            )}
          </div>

          {/* Status Select */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="helper-text">
              Set the review status to control visibility on the website
            </span>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={saveReview}
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <span>💾</span>
              )}
              {loading ? "Creating..." : "Create Review"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          <div className="snackbar-content">
            <span>{snackbar.message}</span>
            <button className="snackbar-close" onClick={handleCloseSnackbar}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}