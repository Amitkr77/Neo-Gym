import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";
import { PageHeader, Panel } from "./ui";

export default function Todo() {
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskDesc.trim().length < 5) {
      setIsError(true);
      setStatusMessage("Please describe the task in at least 5 characters.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${FRONTEND_URL}/api/task`, { taskDesc, taskStatus });
      setIsError(false);
      setStatusMessage("Task added! You can see it on your dashboard.");
      setTaskDesc("");
      setTaskStatus("In Progress");
    } catch (error) {
      setIsError(true);
      setStatusMessage(error.response?.data?.message || "Error adding task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Planning" title="To-do" accent="list" />
      <Panel className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="task_desc" className="field-label">What&apos;s the plan?</label>
            <input
              id="task_desc"
              type="text"
              name="task_desc"
              className="field"
              placeholder="e.g. 4 × 10 squats, 20 min incline walk"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              maxLength={300}
            />
          </div>
          <div>
            <label htmlFor="task_status" className="field-label">Status</label>
            <select id="task_status" name="task_status" value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="field">
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button type="submit" className="btn-dark" disabled={saving}>
            {saving ? "Adding…" : "Add To List"}
          </button>
          {statusMessage && (
            <p className={isError ? "alert-error" : "alert-success"} role="status">
              {statusMessage}{" "}
              {!isError && <Link to="/Customer/dashboard" className="font-semibold underline">View tasks</Link>}
            </p>
          )}
        </form>
      </Panel>
    </>
  );
}
