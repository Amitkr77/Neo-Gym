import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { FaChartBar } from "react-icons/fa";
import { CURRENCY } from "../../../constant/const";

// Monthly earnings from recorded payments. The previous "Earnings vs Expenses" chart showed
// fixed sample numbers; expenses are not tracked by the system yet (see IMPLEMENTATION_ROADMAP Phase 4).
export default function Expense({ metrics }) {
  const config = {
    type: "bar",
    height: 260,
    series: [{ name: "Earnings", data: metrics.monthlyEarnings }],
    options: {
      chart: { toolbar: { show: true } },
      title: { text: "Earnings per month (last 6 months)", align: "center", style: { fontSize: "16px", fontWeight: "bold", color: "#000" } },
      dataLabels: { enabled: false },
      colors: ["#020617"],
      plotOptions: { bar: { columnWidth: "45%", borderRadius: 2 } },
      xaxis: { categories: metrics.monthLabels, axisTicks: { show: false }, axisBorder: { show: false } },
      yaxis: { labels: { formatter: (v) => `${CURRENCY}${Math.round(v).toLocaleString("en-IN")}` }, min: 0 },
      fill: { opacity: 0.8 },
      tooltip: { theme: "dark", y: { formatter: (v) => `${CURRENCY}${Number(v).toLocaleString("en-IN")}` } },
    },
  };

  return (
    <section className="border p-2">
      <div className="flex items-center gap-1 border py-1 px-1">
        <FaChartBar className="h-5 w-5" aria-hidden="true" />
        <h2 className="border-l p-1 font-medium">Earnings report</h2>
      </div>
      <Card className="rounded-b-xl rounded-t-none">
        <CardBody className="px-2 pb-0">
          <Chart {...config} />
          <p className="text-xs text-gray-500 px-2 pb-3">
            Based on payments recorded in the system. Expense tracking is not available yet.
          </p>
        </CardBody>
      </Card>
    </section>
  );
}
