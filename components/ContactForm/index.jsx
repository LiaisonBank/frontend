"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ======================================================
  // Handle Input Change
  // ======================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // Email Validation
  // ======================================================
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ======================================================
  // Form Validation
  // ======================================================
  const validate = () => {
    const newErrors = {};
    const errorList = [];

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      errorList.push("Name is required");
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      errorList.push("Email is required");
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      errorList.push("Invalid email format");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      errorList.push("Subject is required");
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      errorList.push("Message is required");
    }

    return { newErrors, errorList };
  };

  // ======================================================
  // Submit Form
  // ======================================================
  const handleSubmit = async (e) => {
  e.preventDefault();

  const { newErrors, errorList } = validate();

  if (errorList.length > 0) {
    setErrors(newErrors);

    Swal.fire({
      icon: "error",
      title: "Validation Errors",
      html: `
        <ul style="text-align:left;padding-left:20px;">
          ${errorList.map((err) => `<li>${err}</li>`).join("")}
        </ul>
      `,
      confirmButtonColor: "#d33",
    });

    return;
  }

  try {
    setLoading(true);

    // ======================================================
    // CLEAN PAYLOAD (Fix 422 Error)
    // ======================================================
    const payload = {
      name: formData.name?.trim(),
      email: formData.email?.trim(),
      subject: formData.subject?.trim(),
      message: formData.message?.trim(),
    };

    const res = await fetch(
      "https://liaisonbank-backend.onrender.com/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("Backend Error:", data);

      const errorMsg =
        data?.detail?.[0]?.msg ||
        data?.detail ||
        "Failed to send email";

      throw new Error(errorMsg);
    }

    await Swal.fire({
      icon: "success",
      title: "Successfully Sent!",
      text: "Your message has been submitted.",
      confirmButtonColor: "#3085d6",
    });

    setFormData(initialState);
    setErrors({});
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: error.message || "Please try again later.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <form id="contact" onSubmit={handleSubmit} noValidate>
      {/* NAME */}
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
        />
        <span className={formData.name ? "label-up" : ""}>
          Your name
        </span>
      </div>

      {/* EMAIL */}
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Your e-mail"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "error" : ""}
        />
        <span className={formData.email ? "label-up" : ""}>
          Your e-mail
        </span>
      </div>

      {/* SUBJECT */}
      <div className="form-group">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className={errors.subject ? "error" : ""}
        />
        <span className={formData.subject ? "label-up" : ""}>
          Subject
        </span>
      </div>

      {/* MESSAGE */}
      <div className="form-group">
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          className={errors.message ? "error" : ""}
        />
        <span className={formData.message ? "label-up" : ""}>
          Your message
        </span>
      </div>

      {/* BUTTON */}
      <div className="form-group">
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;