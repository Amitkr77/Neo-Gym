import { useEffect, useState } from "react";
import axios from "axios";
import FRONTEND_URL, { CURRENCY } from "../constant/const";

export const formatMoney = (value) =>
  `${CURRENCY}${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString("en-GB") : "—");

const countBy = (items, key, keys) =>
  keys.map((k) => items.filter((item) => (item[key] || "").toLowerCase() === k.toLowerCase()).length);

// Loads everything the dashboard and reports need, once, and derives real metrics.
// Each source fails independently so one broken endpoint doesn't blank the whole page.
export default function useGymData() {
  const [state, setState] = useState({ loading: true, errors: [] });

  useEffect(() => {
    let cancelled = false;
    const get = (path, pickData) =>
      axios.get(`${FRONTEND_URL}${path}`).then((r) => pickData(r.data)).catch(() => {
        throw new Error(path);
      });

    Promise.allSettled([
      get("/api/member/users", (d) => d),
      get("/api/staff", (d) => d),
      get("/api/equipment", (d) => d.data),
      get("/api/payment", (d) => d.payments),
      get("/api/announcement", (d) => d.data),
      get("/api/contact", (d) => d.data),
    ]).then((results) => {
      if (cancelled) return;
      const [members, staff, equipment, payments, announcements, enquiries] = results.map((r) =>
        r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []
      );
      const errors = results.filter((r) => r.status === "rejected").map((r) => r.reason.message);

      // Earnings for the last 6 calendar months (including the current one).
      const now = new Date();
      const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1));
      const monthlyEarnings = months.map((m) =>
        payments
          .filter((p) => {
            const d = new Date(p.paymentDate);
            return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth();
          })
          .reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0)
      );

      setState({
        loading: false,
        errors,
        members,
        staff,
        equipment,
        payments,
        announcements,
        enquiries,
        metrics: {
          totalMembers: members.length,
          activeMembers: members.filter((m) => m.status === "Active").length,
          pendingMembers: members.filter((m) => m.status === "Pending").length,
          totalStaff: staff.length,
          trainers: staff.filter((s) => s.designation === "trainer").length,
          totalEquipment: equipment.length,
          totalEarnings: payments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0),
          membersByService: countBy(members, "chosenService", ["Cardio", "Fitness", "Sauna"]),
          membersByGender: countBy(members, "gender", ["male", "female", "other"]),
          staffByDesignation: countBy(staff, "designation", ["manager", "cashier", "trainer"]),
          monthLabels: months.map((m) => m.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })),
          monthlyEarnings,
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
