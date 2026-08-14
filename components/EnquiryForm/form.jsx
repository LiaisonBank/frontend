"use client";

import { useState, useRef } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const INITIAL_FORM = {
  company_name: "",
  contact_person: "",
  phone_number: "",
  email_id: "",
  type_of_services: [],
  enquiry_details: "",
  form_source: "Contact Form", // default
};

export default function Form({ onSuccess, formSource = "Unknown" }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [serviceFocused, setServiceFocused] = useState(false);

  const selectRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const services = [
    "Liaisoning",
    "Licensing",
    "Fire",
    "Electrical",    
    "PNG",
    "AMC",
  ];

  const serviceOptions = services.map((item) => ({
    value: item,
    label: item,
  }));

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
  };

  const validateForm = () => {
    const errors = [];

    const company = form.company_name.trim();
    const person = form.contact_person.trim();
    const email = form.email_id.trim();
    const message = form.enquiry_details.trim();

    const phone = form.phone_number.replace(/\D/g, "");
    const localPhone = phone.startsWith("91") ? phone.slice(2) : phone;

    if (!person) errors.push("Contact Person is required.");

    if (!company) errors.push("Company Name is required.");

    if (!localPhone) errors.push("Phone Number is required.");
    else if (!/^[6-9]\d{9}$/.test(localPhone))
      errors.push("Please enter a valid 10-digit mobile number.");

    if (!email) errors.push("Email ID is required.");
    else if (!EMAIL_REGEX.test(email))
      errors.push("Please enter a valid Email ID.");

    if (form.type_of_services.length === 0)
      errors.push("Please select at least one Type of Service.");

    if (!message) errors.push("Please leave us a message.");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const validationErrors = validateForm();

    if (validationErrors.length) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `<ul style="text-align:left;padding-left:20px;">
          ${validationErrors.map((item) => `<li>${item}</li>`).join("")}
        </ul>`,
        confirmButtonColor: "#000",
      });
    }

    try {
      setLoading(true);

      const phone = form.phone_number.replace(/\D/g, "");
      const localPhone = phone.startsWith("91") ? phone.slice(2) : phone;

      const payload = {
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        phone_number: `+91-${localPhone}`,
        email_id: form.email_id.trim(),
        type_of_services: form.type_of_services,
        enquiry_details: form.enquiry_details.trim(),
      };

      const response = await fetch("/api/v1/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(
          data.message || data.error || "Unable to submit enquiry.",
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Enquiry Submitted",
        text: "Your enquiry has been submitted successfully.",
        confirmButtonColor: "#000",
      });

      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Something went wrong. Please try again.",
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
      if (!result.isConfirmed) return;

      resetForm();

      Swal.fire({
        icon: "success",
        title: "Reset",
        text: "Form has been cleared.",
        confirmButtonColor: "#000",
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} id="enquiryform">
      <div className="grid md:grid-cols-2 gap-2">
        <div className="form-group">
          {/* <label className="block mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label> */}
          <input
            type="text"
            name="contact_person"
            value={form.contact_person}
            placeholder="Your Name"
            onChange={handleChange}
            className={errors.contact_person ? "error" : ""}
            // className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
          <span className={form.contact_person ? "label-up" : ""}>
            Contact Person Name
          </span>
        </div>

        <div className="form-group">
          {/* <label className="block mb-2">
                Company Name <span className="text-red-500">*</span>
              </label> */}
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            placeholder="Your Company Name"
            onChange={handleChange}
            className={errors.company_name ? "error" : ""}
            // className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
          <span className={form.company_name ? "label-up" : ""}>
            Company Name
          </span>
        </div>

        <div className="form-group phone-input">
          {/* <label className="block mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label> */}
          {/* <PhoneInput
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
              /> */}
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
            inputProps={{
              onFocus: () => setPhoneFocused(true),
              onBlur: () => setPhoneFocused(false),
            }}
            inputClass="!w-full !pl-14"
            containerClass="!w-full"
          />
          <span className={phoneFocused || form.phone_number ? "label-up" : ""}>
            Phone Number
          </span>
        </div>

        <div className="form-group">
          {/* <label className="block mb-2">
                Email ID <span className="text-red-500">*</span>
              </label> */}
          <input
            type="email"
            name="email_id"
            placeholder="Your Email Id"
            value={form.email_id}
            onChange={handleChange}
            className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
          />
          <span className={form.email_id ? "label-up" : ""}>Email ID</span>
        </div>

        <div
          className="md:col-span-2 form-group typeservices"
          id="typeservices"
        >
          {/* <label className="block mb-2">
                Type of Services <span className="text-red-500">*</span>
              </label> */}
          <Select
            isMulti
            instanceId="type-of-services"
            ref={selectRef}
            name="type_of_services"
            options={serviceOptions}
            openMenuOnClick={true}
            openMenuOnFocus={true}
            blurInputOnSelect={false}
            closeMenuOnSelect={false}
            placeholder=""
            value={serviceOptions.filter((option) =>
              form.type_of_services.includes(option.value),
            )}
            onChange={(selected) => {
              setForm((prev) => ({
                ...prev,
                type_of_services: selected
                  ? selected.map((item) => item.value)
                  : [],
              }));
            }}
            onFocus={() => setServiceFocused(true)}
            onBlur={() => setServiceFocused(false)}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={{
              ccontrol: (base) => ({
                ...base,
                borderColor: state.isFocused ? "#808080" : "#ced4da",
                boxShadow: "none",
                "&:hover": {
                    borderColor: "#808080",
                },
              }),

              input: (base) => ({
                ...base,
                outline: "none",
                boxShadow: "none",
              }),

              valueContainer: (base) => ({
                ...base,
                outline: "none",
              }),

              menu: (base) => ({
                ...base,
                boxShadow: "none",
              }),

              menuList: (base) => ({
                ...base,
                boxShadow: "none",
              }),

              multiValue: (base) => ({
                ...base,
                backgroundColor: "#be2a2a",
              }),

              multiValueLabel: (base) => ({
                ...base,
                color: "#ffffff",
              }),

              multiValueRemove: (base) => ({
                ...base,
                color: "#ffffff",
                ":hover": {
                  backgroundColor: "#be2a2a",
                  color: "#ffffff",
                },
              }),

              option: (base, state) => ({
                ...base,
                backgroundColor:
                  state.isFocused || state.isSelected ? "#808080" : "#ffffff",
                color:
                  state.isFocused || state.isSelected ? "#ffffff" : "#000000",
                cursor: "pointer",
              }),
            }}
          />
          <span
            onClick={() => {
              selectRef.current?.focus();
            }}
            className={
              serviceFocused || form.type_of_services.length ? "label-up" : ""
            }
          >
            Type of Services
          </span>
        </div>
      </div>

      <div className="mt-6 form-group">
        <textarea
          rows="2"
          name="enquiry_details"
          value={form.enquiry_details}
          placeholder="Leave Us a Message"
          onChange={handleChange}
          className="w-full form-control px-2 py-1 rounded-xl bg-gray-100"
        />
        <span className={form.enquiry_details ? "label-up" : ""}>
          Leave Us a Message
        </span>
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
          className="px-10 py-3 rounded-xl bg-black text-white enq-btn"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
