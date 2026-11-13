import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";
import { AnnouncementList, EmptyState, PageHeader, Panel, formatDate } from "./ui";

export default function Dashboard({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    axios.get(`${FRONTEND_URL}/api/announcement`).then((res) => setAnnouncements(res.data.data || [])).catch(() => {});
    axios.get(`${FRONTEND_URL}/api/task`).then((res) => setTasks(res.data)).catch(() => setStatusMessage("Failed to load tasks."));
  }, []);

  const handleRemoveTask = async (taskId) => {
    try {
      await axios.delete(`${FRONTEND_URL}/api/task/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setStatusMessage("Task completed and removed.");
    } catch {
      setStatusMessage("Failed to remove task.");
    }
  };

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const stats = [
    { label: "Status", value: user?.status || "—" },
    { label: "Plan", value: user?.plan || "Not assigned" },
    { label: "Last payment", value: formatDate(user?.paidDate) },
  ];

  return (
    <>
      <PageHeader eyebrow="Dashboard" title={`Hello, ${firstName}.`} accent="Let's train." />

      <dl className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 last:col-span-2 sm:p-6 sm:last:col-span-1">
            <dt className="eyebrow text-stone-500">{s.label}</dt>
            <dd className="display-sm mt-3 text-lg normal-case first-letter:uppercase sm:text-2xl">{s.value}</dd>
          </div>
        ))}
      </dl>
      {user?.status === "Pending" && (
        <p className="alert-info mb-8">
          Your membership isn&apos;t active yet. Visit the front desk to choose a plan.{" "}
          <Link to="/Customer/payments" className="font-semibold underline">What happens next?</Link>
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="My to-do list"
          action={<Link to="/Customer/Todo" className="link-underline tap text-sm font-semibold">Add task</Link>}
        >
          {tasks.length === 0 ? (
            <EmptyState>
              No tasks yet. <Link to="/Customer/Todo" className="font-semibold text-ink underline">Add one</Link>.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-ink/10">
              {tasks.map((task) => (
                <li key={task._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{task.taskDesc}</p>
                    <span className={`mt-1 inline-block text-xs font-semibold ${task.taskStatus === "In Progress" ? "text-ember-700" : "text-stone-500"}`}>
                      {task.taskStatus}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="min-h-[44px] shrink-0 rounded-full border border-ink/15 px-5 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-bone"
                    onClick={() => handleRemoveTask(task._id)}
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          )}
          {statusMessage && <p className="mt-4 text-sm text-stone-600" role="status">{statusMessage}</p>}
        </Panel>

        <Panel
          title="Gym announcements"
          action={<Link to="/Customer/Annoucements" className="link-underline tap text-sm font-semibold">View All</Link>}
        >
          <AnnouncementList items={announcements} limit={4} />
        </Panel>
      </div>
    </>
  );
}
