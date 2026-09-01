import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { useToast } from "../../components/ui";

const POLL_MS = 15000; // refresh enquiries every 15s

const NotificationsContext = createContext(null);

export function AdminNotificationsProvider({ children }) {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const seenIds = useRef(null); // null until first load, then a Set of known ids

  const load = useCallback(
    async ({ announce = true } = {}) => {
      try {
        const res = await api.adminList("enquiries");
        const rows = res.data || [];
        setEnquiries(rows);

        // Detect brand-new enquiries that arrived since the last poll.
        if (seenIds.current === null) {
          seenIds.current = new Set(rows.map((r) => r.id));
        } else if (announce) {
          const fresh = rows.filter((r) => !seenIds.current.has(r.id));
          fresh.forEach((r) => seenIds.current.add(r.id));
          if (fresh.length === 1) {
            toast.info(`New enquiry from ${fresh[0].name}`);
          } else if (fresh.length > 1) {
            toast.info(`${fresh.length} new enquiries received`);
          }
        }
      } catch {
        /* silent — keep last known state on transient errors */
      }
    },
    [toast]
  );

  useEffect(() => {
    load({ announce: false });
    const id = setInterval(() => load({ announce: true }), POLL_MS);
    const onFocus = () => load({ announce: true });
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const newEnquiries = enquiries.filter((e) => e.status === "new");

  const value = {
    enquiries,
    newEnquiries,
    newCount: newEnquiries.length,
    refresh: () => load({ announce: false }),
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error("useAdminNotifications must be used within AdminNotificationsProvider");
  return ctx;
}

function timeAgo(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const { newEnquiries, newCount } = useAdminNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const recent = newEnquiries.slice(0, 6);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${newCount ? ` (${newCount} new)` : ""}`}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      >
        <i className={`ti ti-bell text-xl ${newCount ? "animate-[wiggle_1.2s_ease-in-out_infinite]" : ""}`} />
        {newCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {newCount > 99 ? "99+" : newCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 animate-[fadeIn_.15s_ease-out]">
          <div className="flex items-center justify-between border-b border-white/10 bg-brand-950 px-4 py-3 text-white">
            <span className="flex items-center gap-2 text-sm font-bold">
              <i className="ti ti-bell text-accent-300" /> Notifications
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-brand-100">
              {newCount} new
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-400">
                <i className="ti ti-inbox-off mb-2 block text-2xl" />
                You're all caught up.
              </div>
            ) : (
              recent.map((e) => (
                <Link
                  key={e.id}
                  to="/admin/enquiries"
                  onClick={() => setOpen(false)}
                  className="flex gap-3 border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white shadow-sm">
                    {e.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">{e.name}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(e.created_at)}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">
                      <i className="ti ti-phone text-[11px]" /> {e.phone}
                      {e.course_title ? ` · ${e.course_title}` : ""}
                    </p>
                    {e.message && (
                      <p className="mt-0.5 truncate text-xs text-slate-400">{e.message}</p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            to="/admin/enquiries"
            onClick={() => setOpen(false)}
            className="block bg-brand-50 px-4 py-3 text-center text-sm font-bold text-brand-700 transition hover:bg-brand-100"
          >
            View all enquiries
          </Link>
        </div>
      )}
    </div>
  );
}
