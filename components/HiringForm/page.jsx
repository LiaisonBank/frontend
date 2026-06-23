"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function HiringForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    contact_person: "",
    email_id: "",
    phone_number: "",
    enquiry_details: "",
  });

  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 1024 * 1024; // 1 MB

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only PDF, DOC and DOCX files are allowed.",
        confirmButtonColor: "#f97316",
      });

      e.target.value = "";
      setResume(null);
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Maximum file size allowed is 1 MB.",
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

    if (!form.contact_person.trim()) {
      errors.push("Your Name is required");
    }

    if (!form.email_id.trim()) {
      errors.push("Email ID is required");
    } else if (!/^\S+@\S+\.\S+$/.test(form.email_id)) {
      errors.push("Please enter a valid Email ID");
    }

    const mobile = form.phone_number.replace(/\D/g, "");

    if (!mobile) {
      errors.push("Mobile Number is required");
    } else if (mobile.length !== 10) {
      errors.push("Mobile Number must be 10 digits");
    }

    if (!resume) {
      errors.push("Please upload your CV");
    }

    return errors;
  };

  const resetForm = () => {
    setForm({
      contact_person: "",
      email_id: "",
      phone_number: "",
      enquiry_details: "",
    });

    setResume(null);

    const fileInput = document.getElementById("resume");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `
          <ul style="text-align:left;padding-left:20px;">
            ${errors.map((err) => `<li>${err}</li>`).join("")}
          </ul>
        `,
        confirmButtonColor: "#f97316",
      });

      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.contact_person.trim(),
        email: form.email_id.trim(),
        mobile: form.phone_number.trim(),
        message: form.enquiry_details.trim(),
        resume_name: resume?.name,
        resume_size: resume?.size,
        resume_type: resume?.type,
      };

      console.group("Hiring Form Submission");
      console.log(payload);
      console.log("Resume File:", resume);
      console.groupEnd();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been submitted successfully.",
        confirmButtonColor: "#f97316",
      });

      resetForm();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };
   const handleDiscard = () => {
      Swal.fire({
        title: "Reset Form?",
        text: "All entered details will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Reset",
      }).then((result) => {
        if (result.isConfirmed) {
          resetForm();
  
          Swal.fire({
            icon: "success",
            title: "Reset",
            text: "Form has been cleared.",
            confirmButtonColor: "#000",
          }).then(() => {
            window.location.reload();
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
              name="contact_person"
              value={form.contact_person}
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
            country={"in"}
            onlyCountries={["in"]}
            disableDropdown={true}
            countryCodeEditable={false}
            enableSearch={false}
            value={form.phone_number}
            onChange={(phone) =>
              setForm({
                ...form,
                phone_number: phone,
              })
            }
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
          Max File Limit Size 1MB
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

