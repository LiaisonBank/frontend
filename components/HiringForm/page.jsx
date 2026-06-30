"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function HiringForm() {
 const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const MOBILE_REGEX = /^[6-9]\d{9}$/;

const [loading, setLoading] = useState(false);

const [form, setForm] = useState({
  name: "",
  email_id: "",
  phone_number: "91",
  enquiry_details: "",
});

const [resume, setResume] = useState(null);

const handleChange = (eOrValue, fieldName = null) => {
  // Handle react-phone-input-2
  if (fieldName === "phone_number") {
    // Store the value exactly as received (e.g. 919892021702)
    setForm((prev) => ({
      ...prev,
      phone_number: eOrValue.replace(/\D/g, ""),
    }));

    return;
  }

  // Handle normal HTML inputs
  const { name, value } = eOrValue.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleFileChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) {
    setResume(null);
    return;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Resume",
      text: "Only PDF, DOC and DOCX files are allowed.",
      confirmButtonColor: "#f97316",
    });

    e.target.value = "";
    setResume(null);
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    Swal.fire({
      icon: "error",
      title: "File Too Large",
      text: "Resume size must not exceed 5 MB.",
      confirmButtonColor: "#f97316",
    });

    e.target.value = "";
    setResume(null);
    return;
  }

  setResume(file);
};

const validateForm = () => {
  const errors = [];

  // Name
  if (!form.name.trim()) {
    errors.push("Name is required.");
  }

  // Email
  const email = form.email_id.trim();

  if (!email) {
    errors.push("Email ID is required.");
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push("Please enter a valid Email ID.");
  }

  // Mobile
  let mobile = form.phone_number.replace(/\D/g, "");

  if (mobile.startsWith("91") && mobile.length === 12) {
    mobile = mobile.substring(2);
  }

  if (!mobile) {
    errors.push("Mobile Number is required.");
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.push(
      "Mobile Number must be exactly 10 digits and start with 6, 7, 8 or 9."
    );
  }

  // Resume
  if (!resume) {
    errors.push("Please upload your Resume.");
  }

  return {
    errors,
    mobile,
  };
};

const resetForm = () => {
  setForm({
    name: "",
    email_id: "",
    phone_number: "91",
    enquiry_details: "",
  });

  setResume(null);

  const fileInput = document.getElementById("resume");

  if (fileInput) {
    fileInput.value = "";
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const { errors, mobile } = validateForm();

  if (errors.length) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      html: `
        <ul style="text-align:left;padding-left:20px;line-height:1.8;">
          ${errors.map((err) => `<li>${err}</li>`).join("")}
        </ul>
      `,
      confirmButtonColor: "#f97316",
    });

    return;
  }

  const formData = new FormData();

  formData.append("name", form.name.trim());
  formData.append("email_id ", form.email_id.trim());
  formData.append("phone_number", mobile);
  formData.append("enquiry_details", form.enquiry_details.trim());
  formData.append("resume", resume);
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  // return;
  try {
    setLoading(true);

    Swal.fire({
      title: "Submitting Application",
      text: "Please wait...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // const response = await fetch("/api/v1/hiring", {
    const response = await fetch("https://backend.liaisonbank.com/api/v1/hiring", {
      method: "POST",
      body: formData,
    });
    

    // const result = await response.json();
    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);
    var result;

    try {
      result = JSON.parse(text);
    } catch (e) {
      throw new Error(text);
    }

    Swal.close();

    if (!response.ok) {
      throw new Error(
        result.message || "Unable to submit your application."
      );
    }

    Swal.fire({
      icon: "success",
      title: "Application Submitted",
      text:
        result.message ||
        "Thank you! Your application has been submitted successfully.",
      confirmButtonColor: "#f97316",
    });

    resetForm();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text:
        error.message ||
        "Something went wrong. Please try again later.",
      confirmButtonColor: "#f97316",
    });
  } finally {
    setLoading(false);
  }
};

const handleDiscard = () => {
  Swal.fire({
    title: "Discard Changes?",
    text: "All entered details will be lost.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Reset",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#f97316",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed) {
      resetForm();

      Swal.fire({
        icon: "success",
        title: "Form Reset",
        text: "The form has been cleared successfully.",
        confirmButtonColor: "#f97316",
      });
    }
  });
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 hiring-form">
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="block mb-2">Your Name <span className="text-red-500">*</span></label>
           <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
            />
        </div>
        <div>
          <label className="block mb-2">Email ID <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email_id"
            value={form.email_id}
            onChange={handleChange}
            placeholder="Email Id"
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2">Mobile No. <span className="text-red-500">*</span></label>
          <PhoneInput
            country="in"
            onlyCountries={["in"]}
            disableDropdown
            countryCodeEditable={false}
            enableSearch={false}
            value={form.phone_number}
            onChange={(value) => handleChange(value, "phone_number")}
            inputClass="!w-full !pl-14"
            containerClass="!w-full"
          />
          {/* <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Mobile No. (required)"
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          /> */}
        </div>
        <div>
          <label className="block mb-2">Message</label>
          <textarea
            rows={3}
            name="enquiry_details"
            value={form.enquiry_details}
            onChange={handleChange}
            placeholder="Leave Us a Message"
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
        </div>
      </div>
      <div className="border-2 border-dashed border-gray-300 p-4">
        <h4 className="text-[#46648a] text-xl mb-3">
          Upload CV <span className="text-red-500">*</span>
        </h4>

        <input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <p className="mt-3 text-sm text-gray-500">
          Max File Limit Size 2-5 MB
        </p>

        {resume && (
          <p className="mt-2 text-green-600 text-sm">
            Selected: {resume.name}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-8">
          <button type="button" className="px-6 py-3 rounded-xl bg-gray-100" onClick={handleDiscard}>Reset</button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-2 font-medium transition"
            style={{ width: "200px" }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
      </div>
      

    </form>
  );
}

