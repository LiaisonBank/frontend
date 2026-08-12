"use client";

import { useState } from "react";

export default function LeaveReply({
  postId,
  postSlug,
  postTitle,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          postSlug,
          postTitle,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("Comment submitted successfully.");

      setFormData({
        name: "",
        email: "",
        comment: "",
      });
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-5 leavereply">
        <div className="col-lg-8 col-12">
          <h3 className="mb-3">Leave a Reply</h3>
          <p className="text-muted mb-4">
            Your email address will not be published.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <textarea
                rows={6}
                name="comment"
                className="form-control"
                placeholder="Write your comment..."
                value={formData.comment}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-end">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-25 p-0 btn-theme text-white"
              >
                {loading ? "Submitting..." : "Post Comment"}
              </button>
            </div>
           
          </form>
        </div>
    </section>
  );
}