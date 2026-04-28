export default function JobsPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="https://liaisonbank.frappe.cloud/jobs"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        loading="lazy"
      />
    </div>
  );
}