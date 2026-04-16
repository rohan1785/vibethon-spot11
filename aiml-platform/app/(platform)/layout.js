import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";

export default function PlatformLayout({ children }) {
  return (
    <RequireAuth>
      <Navbar />
      <main className="container" style={{ padding: "1rem 0 2rem" }}>
        {children}
      </main>
    </RequireAuth>
  );
}
