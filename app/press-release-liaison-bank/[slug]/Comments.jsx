"use client";

import { useState } from "react";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const submitComment = (e) => {
    e.preventDefault();

    if (!name || !message) return;

    const newComment = {
      id: Date.now(),
      name,
      message,
    };

    setComments([newComment, ...comments]);

    setName("");
    setMessage("");
  };

  return (
    <div className="mt-5">
      <h3>
        Comments ({comments.length})
      </h3>

      <form
        onSubmit={submitComment}
        className="mb-4"
      >
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Comment"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          type="submit"
        >
          Post Comment
        </button>
      </form>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="card mb-3"
        >
          <div className="card-body">
            <strong>
              {comment.name}
            </strong>

            <p className="mb-0 mt-2">
              {comment.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}