"use client";
import { useEffect, useState } from "next";

export default function ApprovalQueue() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/sources?approval_status=PENDING", {credentials: "include"});
      const data = await res.json();
      if (data.success) {
        setSources(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/sources/${id}/approve`, {
        method: "PUT",
        credentials: "include"
      });
      if (res.ok) {
        setSources(sources.filter(s => s.source_id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/sources/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setSources(sources.filter(s => s.source_id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading queue...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "2rem" }}>Approval Queue</h1>
      
      {sources.length === 0 ? (
        <div style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "0.5rem", textAlign: "center", color: "#6b7280" }}>
          No pending uploads found. You are all caught up!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {sources.map(source => (
            <div key={source.source_id} style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontWeight: "600", fontSize: "1.125rem", color: "#111827" }}>{source.title}</h3>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {source.course_code || "Unknown Course"} • {source.exam_year} • {source.source_type}
                </div>
                {source.file_url && (
                  <a href={source.file_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.5rem", color: "#4f46e5", fontSize: "0.875rem" }}>
                    <i className="fas fa-external-link-alt"></i> View Paper PDF
                  </a>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => handleApprove(source.source_id)} style={{ padding: "0.5rem 1rem", backgroundColor: "#10b981", color: "#fff", borderRadius: "0.375rem", border: "none", cursor: "pointer", fontWeight: "500" }}>
                  Approve
                </button>
                <button onClick={() => handleReject(source.source_id)} style={{ padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "#fff", borderRadius: "0.375rem", border: "none", cursor: "pointer", fontWeight: "500" }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
