import { useEffect, useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";
import { AnnouncementList, PageHeader, Panel } from "./ui";

export default function Annoucements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${FRONTEND_URL}/api/announcement`)
      .then((res) => setAnnouncements(res.data.data || []))
      .catch(() => setError("Could not load announcements."));
  }, []);

  return (
    <>
      <PageHeader eyebrow="News" title="Gym" accent="announcements" />
      <Panel>
        {error ? <p className="alert-error">{error}</p> : <AnnouncementList items={announcements} />}
      </Panel>
    </>
  );
}
