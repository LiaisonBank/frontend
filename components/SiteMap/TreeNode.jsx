"use client";

import { useState } from "react";
import Link from "next/link";

function getChildren(node) {
  return (
    node?.children ||
    node?.submenu ||
    node?.items ||
    node?.projects ||
    []
  );
}

export default function TreeNode({ node, level = 0, isLast = false }) {
  const [open, setOpen] = useState(true);
  const children = getChildren(node);
  const hasChildren = children.length > 0;

  return (
    <div className="position-relative">

      {/* LINE CONNECTOR */}
      {level > 0 && (
        <div
          className="position-absolute"
          style={{
            left: `${level * 18 - 12}px`,
            top: 0,
            bottom: 0,
            borderLeft: "1px solid #ccc",
          }}
        />
      )}

      {/* NODE */}
      <div
        className="d-flex align-items-center gap-2 py-1"
        style={{ marginLeft: level * 18 }}
      >
        {/* TREE ICON */}
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-sm btn-light border"
            style={{ width: 26, height: 26, padding: 0 }}
          >
            {open ? "−" : "+"}
          </button>
        )}

        {!hasChildren && (
          <span style={{ width: 26 }} />
        )}

        {/* LABEL */}
        {node.href ? (
          <Link
            href={node.href}
            className="text-dark text-decoration-none"
          >
            {node.name}
          </Link>
        ) : (
          <span className="fw-semibold">{node.name}</span>
        )}
      </div>

      {/* CHILDREN */}
      {hasChildren && open && (
        <div>
          {children.map((child, i) => (
            <TreeNode
              key={i}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}