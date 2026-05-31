"use client";
import { useEffect, useState } from "next";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/stats", {credentials: "include"});
        const data = await res.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        setError("Failed to fetch stats. Is the backend running?");
      }
    };
    fetchStats();
  }, [router]);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "2rem" }}>Dashboard Overview</h1>
      
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
        {/* Stat Card 1 */}
        <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>Total Papers</div>
          <div style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827" }}>{stats ? stats.totalPapers : "..."}</div>
        </div>

        {/* Stat Card 2 */}
        <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>Total Questions</div>
          <div style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827" }}>{stats ? stats.totalQuestions : "..."}</div>
        </div>

        {/* Stat Card 3 */}
        <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", borderLeft: stats?.pendingReviews > 0 ? "4px solid #ef4444" : "4px solid #10b981" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>Pending Reviews</div>
          <div style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827" }}>{stats ? stats.pendingReviews : "..."}</div>
        </div>
      </div>
    </div>
  );
}
