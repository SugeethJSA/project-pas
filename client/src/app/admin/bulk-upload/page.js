"use client";
import { useState } from "react";

import { API_URL } from "@/config";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/bulk/questions`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Network error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827", marginBottom: "1rem" }}>Bulk Upload Questions</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Upload a CSV file to bulk insert questions and map them to existing papers.
      </p>

      <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", maxWidth: "600px" }}>
        <div style={{ border: "2px dashed #d1d5db", padding: "3rem", borderRadius: "0.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <i className="fas fa-file-csv" style={{ fontSize: "3rem", color: "#9ca3af", marginBottom: "1rem" }}></i>
          <div style={{ marginBottom: "1rem" }}>
            <input type="file" accept=".csv" onChange={handleFileChange} id="csv-upload" style={{ display: "none" }} />
            <label htmlFor="csv-upload" style={{ padding: "0.5rem 1rem", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "0.375rem", cursor: "pointer", fontWeight: "500" }}>
              {file ? file.name : "Select CSV File"}
            </label>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Required columns: Source_ID, Question_Text</p>
        </div>

        {error && <div style={{ color: "#b91c1c", backgroundColor: "#fee2e2", padding: "1rem", borderRadius: "0.375rem", marginBottom: "1rem" }}>{error}</div>}
        
        {result && (
          <div style={{ backgroundColor: "#ecfdf5", color: "#065f46", padding: "1rem", borderRadius: "0.375rem", marginBottom: "1rem" }}>
            <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Upload Complete!</h4>
            <p>Total Processed: {result.total}</p>
            <p>Successfully Inserted: {result.successCount}</p>
            <p>Failed: {result.errorCount}</p>
            {result.errors.length > 0 && (
              <ul style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#991b1b", paddingLeft: "1.5rem" }}>
                {result.errors.map((e, idx) => <li key={idx}>{e}</li>)}
              </ul>
            )}
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          style={{ width: "100%", padding: "0.75rem", backgroundColor: "#4f46e5", color: "#fff", fontWeight: "600", borderRadius: "0.375rem", border: "none", cursor: (!file || loading) ? "not-allowed" : "pointer", opacity: (!file || loading) ? 0.7 : 1 }}
        >
          {loading ? "Uploading..." : "Upload and Process"}
        </button>
      </div>
    </div>
  );
}
