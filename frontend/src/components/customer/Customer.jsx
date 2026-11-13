import { useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import Reminder from "./Reminder";
import Todo from "./Todo";
import Annoucements from "./Annoucements";
import Payments from "./Payments";
import Modal from "./Modal";
import Logo from "../ui/Logo";
import { StatusBadge } from "./ui";
import FRONTEND_URL from "../../constant/const";
import { clearSession } from "../../lib/session";

const NAV = [
  ["/Customer/dashboard", "Dashboard"],
  ["/Customer/payments", "My Membership"],
  ["/Customer/Todo", "To-Do"],
  ["/Customer/Reminder", "Reminder"],
  ["/Customer/Annoucements", "Announcements"],
];

export default function Customer() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // On phones the tabs scroll sideways: keep the active tab in view after navigation.
  useEffect(() => {
    navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [location.pathname, loading]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    clearSession();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    // Identity comes from the login token, not from a user id stored in the browser.
    axios
      .get(`${FRONTEND_URL}/api/member/me`)
      .then((response) => setUser(response.data))
      .catch(() => setError("We couldn't load your account. Please refresh, or log in again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bone text-stone-500" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/15 border-t-ink" aria-hidden="true" />
        <span className="ml-3">Loading your account…</span>
      </div>
    );
  }

  const initials = (user?.fullName || "M").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-bone lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center justify-between px-5 py-5 lg:px-7 lg:py-8">
          <Logo tone="light" />
          <span className="eyebrow text-stone-400 lg:hidden">Member</span>
        </div>
        <nav aria-label="Member portal" className="px-3 pb-3 lg:flex-1 lg:px-4">
          <p className="eyebrow mb-3 hidden px-3 text-stone-400 lg:block">Member portal</p>
          <ul
            ref={navRef}
            className="-mx-3 flex snap-x gap-1 overflow-x-auto px-3 [mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-32px),transparent)] [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0 lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV.map(([to, label]) => (
              <li key={to} className="snap-start">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center whitespace-nowrap rounded-xl px-4 text-sm font-medium transition-colors ${
                      isActive ? "bg-white text-ink" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <button onClick={handleLogout} className="min-h-[44px] w-full rounded-xl px-4 text-left text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
            Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-30 border-b border-ink/10 bg-bone/85 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8 lg:px-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-4 transition hover:bg-ink/5"
              disabled={!user}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-bone">{initials}</span>
              <span className="text-left text-sm">
                <span className="block max-w-[14rem] truncate font-semibold sm:max-w-none">Welcome, {user ? user.fullName : "Member"}</span>
                <span className="block text-xs text-stone-500 group-hover:text-ink"> · Edit profile</span>
              </span>
            </button>
            {user && <StatusBadge status={user.status} />}
            <button onClick={handleLogout} className="btn-outline-dark ml-auto px-4 text-sm lg:hidden">
              Logout
            </button>
          </div>
        </div>

        <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {error && <p className="alert-error mb-6" role="alert">{error}</p>}
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/payments" element={<Payments user={user} />} />
            <Route path="/Reminder" element={<Reminder />} />
            <Route path="/Todo" element={<Todo />} />
            <Route path="/Annoucements" element={<Annoucements />} />
            <Route path="/" element={<Dashboard user={user} />} />
          </Routes>
        </main>
      </div>

      {isModalOpen && user && <Modal user={user} onSaved={setUser} setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}
