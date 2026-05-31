"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "next";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "#1e1e2d", color: "#fff", padding: "2rem 1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center", color: "#fff" }}>
          Admin Panel
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/admin" style={{ color: pathname === "/admin" ? "#4f46e5" : "#a1a1aa", textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: pathname === "/admin" ? "rgba(79, 70, 229, 0.1)" : "transparent" }}>
            <i className="fas fa-chart-line" style={{ marginRight: "0.5rem" }}></i> Dashboard
          </Link>
          <Link href="/admin/queue" style={{ color: pathname.includes("/admin/queue") ? "#4f46e5" : "#a1a1aa", textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: pathname.includes("/admin/queue") ? "rgba(79, 70, 229, 0.1)" : "transparent" }}>
            <i className="fas fa-list-check" style={{ marginRight: "0.5rem" }}></i> Approval Queue
          </Link>
          <Link href="/admin/bulk-upload" style={{ color: pathname.includes("/admin/bulk-upload") ? "#4f46e5" : "#a1a1aa", textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: pathname.includes("/admin/bulk-upload") ? "rgba(79, 70, 229, 0.1)" : "transparent" }}>
            <i className="fas fa-file-csv" style={{ marginRight: "0.5rem" }}></i> Bulk Upload
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
