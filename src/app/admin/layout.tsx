"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

/* ═══ Auth Context ═══ */
const AuthContext = createContext<{
  password: string;
  setPassword: (p: string) => void;
  authed: boolean;
  setAuthed: (a: boolean) => void;
}>({ password: "", setPassword: () => {}, authed: false, setAuthed: () => {} });

export function useAdmin() {
  return useContext(AuthContext);
}

const navItems = [
  { href: "/admin", label: "Overview", icon: "◆" },
  { href: "/admin/inbox", label: "Messages", icon: "⊠" },
  { href: "/admin/projects", label: "Projects", icon: "▦" },
  { href: "/admin/blog", label: "Blog", icon: "✎" },
  { href: "/admin/contact", label: "Contact Info", icon: "✉" },
  { href: "/admin/gallery", label: "Gallery", icon: "◫" },
  { href: "/admin/team", label: "Team", icon: "◉" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "❝" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const saved = sessionStorage.getItem("admin-pw");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "x-admin-password": input },
      });
      if (res.ok) {
        setPassword(input);
        setAuthed(true);
        sessionStorage.setItem("admin-pw", input);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    }
  };

  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <Image src="/logo.png" alt="ADS" width={40} height={40} style={{ borderRadius: '50%' }} />
          </div>
          <h1 className={styles.loginTitle}>Admin Panel</h1>
          <p className={styles.loginSub}>ArchiDesignSolutions</p>
          <div className={styles.loginForm}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={styles.loginInput}
            />
            <button onClick={handleLogin} className={styles.loginBtn}>
              Sign In
            </button>
            {error && <p className={styles.loginError}>{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ password, setPassword, authed, setAuthed }}>
      <div className={styles.adminLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarLogo}>
              <Image src="/logo.png" alt="ADS" width={28} height={28} style={{ borderRadius: 6 }} />
            </span>
            <span className={styles.sidebarTitle}>Admin</span>
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <Link href="/" className={styles.viewSiteLink}>
              ← View Site
            </Link>
            <button
              className={styles.logoutBtn}
              onClick={() => {
                setAuthed(false);
                setPassword("");
                sessionStorage.removeItem("admin-pw");
              }}
            >
              Log Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.adminMain}>{children}</main>
      </div>
    </AuthContext.Provider>
  );
}
