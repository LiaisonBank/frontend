"use client";

import TreeNode from "./TreeNode";

export default function SitemapDiagram({ navLinks = [] }) {
  return (
    <div className="bg-white p-3">
      {navLinks.map((node, i) => (
        <TreeNode key={i} node={node} />
      ))}
    </div>
  );
}