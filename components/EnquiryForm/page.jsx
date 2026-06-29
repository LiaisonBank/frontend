"use client";

import { useState, useRef, useEffect  } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { X } from "react-bootstrap-icons";
import Form from "./form";

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const INITIAL_FORM = {
  company_name: "",
  contact_person: "",
  phone_number: "",
  email_id: "",
  type_of_services: [],
  enquiry_details: "",
};

export default function EnquiryForm({isOpen,
  onClose,
  title,
  width = "600px",}) {
 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-container"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>ENQUIRY FORM</h3>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

          <div className="modal-body">
            <Form onSuccess={onClose} />
         
          </div>
      </div>
    </div>
    </>
  );
}