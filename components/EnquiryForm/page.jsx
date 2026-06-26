"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Select from 'react-select';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function EnquiryForm() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [serviceFocused, setServiceFocused] = useState(false);
  const selectRef = useRef(null);

  
  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    phone_number: "",
    email_id: "",
    type_of_services: "",
    enquiry_details: "",
  });

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

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
  const serviceOptions = services.map((item) => ({
    value: item,
    label: item,
  }));
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

    if (form.type_of_services.length === 0) {
      errors.push("Please select Type of Service");
    }
    if (form.enquiry_details.length === 0) {
      errors.push("Please Leave us Message");
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
      const response = await fetch("https://liaisonbank.frappe.cloud/api/method/create_enquiry", {
        
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
          <span
            className={
              phoneFocused || form.phone_number
                ? "label-up"
                : ""
            }
          >
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
          <span className={form.email_id ? "label-up" : ""}>
            Email ID 
          </span>
        </div>

        <div className="md:col-span-2 form-group typeservices" id="typeservices">
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
              form.type_of_services.includes(option.value)
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
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? "#808080" : "#ced4da",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#808080",
                },
              }),
              

              multiValue: (base) => ({
                ...base,
                backgroundColor: "#808080",
              }),

              multiValueLabel: (base) => ({
                ...base,
                color: "#ffffff",
              }),

              multiValueRemove: (base) => ({
                ...base,
                color: "#ffffff",
                ":hover": {
                  backgroundColor: "#666666",
                  color: "#ffffff",
                },
              }),

              option: (base, state) => ({
                ...base,
                backgroundColor:
                  state.isFocused || state.isSelected
                    ? "#808080"
                    : "#ffffff",
                color:
                  state.isFocused || state.isSelected
                    ? "#ffffff"
                    : "#000000",
                cursor: "pointer",
              }),
            }}
          />
          <span
            onClick={() => {
              selectRef.current?.focus();
            }}
            className={serviceFocused || form.type_of_services.length ? "label-up" : ""}
          >
            Type of Services
          </span>
          
        </div>
      </div>

      <div className="mt-6 form-group">
        <textarea
          rows="3"
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
          className="px-10 py-3 rounded-xl bg-black text-white"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
}