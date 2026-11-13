import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { PiUsersThree } from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import { CgGym } from "react-icons/cg";
import { MdCurrencyRupee } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";
import { formatMoney } from "../../../lib/useGymData";

// Service mix + headline totals, computed from live data (previously hardcoded).
export default function ChartConfig({ metrics }) {
  const chartConfig = {
    type: "bar",
    height: 250,
    width: "100%",
    series: [{ name: "Members", data: metrics.membersByService }],
    options: {
      chart: { toolbar: { show: false } },
      title: { text: "Members by chosen service", align: "center", style: { fontSize: "16px", fontWeight: "bold", color: "#000" } },
      dataLabels: { enabled: false },
      colors: ["#020617"],
      plotOptions: { bar: { columnWidth: "50%", borderRadius: 2 } },
      xaxis: {
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: { style: { colors: "#616161", fontSize: "12px", fontFamily: "inherit", fontWeight: 600 } },
        categories: ["Cardio", "Fitness", "Sauna"],
      },
      yaxis: { labels: { style: { colors: "#616161", fontSize: "12px", fontFamily: "inherit", fontWeight: 400 } }, forceNiceScale: true, min: 0 },
      grid: { show: true, borderColor: "#dddddd", strokeDashArray: 5, padding: { top: 5, right: 20 } },
      fill: { opacity: 0.8 },
      tooltip: { theme: "dark" },
      noData: { text: "No members yet" },
    },
  };

  const tiles = [
    { label: "Total Members", value: metrics.totalMembers, Icon: PiUsersThree, tone: "bg-[#673ab7]" },
    { label: "Staff", value: metrics.totalStaff, Icon: LiaUserClockSolid, tone: "bg-[rgb(41,49,79)]" },
    { label: "Total Equipment", value: metrics.totalEquipment, Icon: CgGym, tone: "bg-[rgb(41,49,79)]" },
    { label: "Total Earnings (recorded payments)", value: formatMoney(metrics.totalEarnings), Icon: MdCurrencyRupee, tone: "bg-[#673ab7]" },
    { label: "Trainers on staff", value: metrics.trainers, Icon: SlUserFollowing, tone: "bg-[#673ab7]" },
  ];

  return (
    <section className="border p-2">
      <div className="flex items-center gap-1 border py-1">
        <h2 className="border-l p-1 font-medium">Service Reports</h2>
      </div>
      <div className="flex flex-col xl:flex-row p-4 gap-4">
        <div className="xl:w-1/2">
          <Card>
            <CardBody className="px-2 pb-0">
              <Chart {...chartConfig} />
            </CardBody>
          </Card>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xl:w-1/2">
          {tiles.map(({ label, value, Icon, tone }) => (
            <div key={label} className={`group w-full rounded-lg ${tone} p-5 flex items-center justify-between`}>
              <div>
                <p className="text-white text-2xl">{value}</p>
                <p className="text-white text-sm">{label}</p>
              </div>
              <Icon className="h-10 w-10 text-white opacity-30" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
