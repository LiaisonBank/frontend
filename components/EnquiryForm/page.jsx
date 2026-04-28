"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function EnquiryForm() {
  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    phone_number: "",
    email_id: "",
    type_of_services: "",
    enquiry_details: "",
  });

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const services = [
    "Fire Safety",
    "PNG",
    "Electrical",
    "Plumbing",
    "Liaisoning",
    "Licensing",
    "AMC",
    "Pest Control",
  ];

  useEffect(() => {
    if (countryDropdownOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [countryDropdownOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      company_name: "",
      contact_person: "",
      phone_number: "",
      email_id: "",
      type_of_services: "",
      enquiry_details: "",
    });
  };

  const validateForm = () => {
    const errors = [];

    if (!form.company_name.trim()) errors.push("Company Name is required");
    if (!form.contact_person.trim()) errors.push("Contact Person is required");
    if (!form.phone_number.trim()) errors.push("Phone Number is required");

    if (!form.email_id.trim()) {
      errors.push("Email ID is required");
    } else if (!/\S+@\S+\.\S+/.test(form.email_id)) {
      errors.push("Enter valid Email ID");
    }

    if (!form.type_of_services) {
      errors.push("Please select Type of Service");
    }

    return errors;
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
        confirmButtonColor: "#000",
      });
      return;
    }

    try {
      setLoading(true);

      /* Format phone to +91 9892021702 */
      const rawNumber = form.phone_number.replace(/\D/g, "");

      const localNumber = rawNumber.startsWith("91")
        ? rawNumber.slice(2)
        : rawNumber;

      const payload = {
        ...form,
        phone_number: `+91-${localNumber}`,
      };

      // console.log("Sending Payload:", payload);
      // return;
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status !== "error") {
        Swal.fire({
          icon: "success",
          title: "Enquiry Submitted",
          text: "Your enquiry has been submitted successfully.",
          confirmButtonColor: "#000",
        }).then(() => {
          window.location.reload();
        });
        // resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || data.message || "Something went wrong.",
          confirmButtonColor: "#000",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to submit enquiry.",
        confirmButtonColor: "#000",
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
    <form onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="block mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-2">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contact_person"
            value={form.contact_person}
            onChange={handleChange}
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>

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
        </div>

        <div>
          <label className="block mb-2">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email_id"
            value={form.email_id}
            onChange={handleChange}
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2">
            Type of Services <span className="text-red-500">*</span>
          </label>

          <select
            name="type_of_services"
            value={form.type_of_services}
            onChange={handleChange}
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          >
            <option value="">Select Service</option>

            {services.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <textarea
          rows="3"
          name="enquiry_details"
          value={form.enquiry_details}
          onChange={handleChange}
          placeholder="Message..."
          className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
        />
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={handleDiscard}
          className="px-6 py-3 rounded-xl bg-gray-100"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-10 py-3 rounded-xl bg-black text-white"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}