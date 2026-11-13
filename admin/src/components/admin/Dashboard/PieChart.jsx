import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { FaChartPie } from "react-icons/fa";

const pie = (series, labels, colors) => ({
  type: "pie",
  width: 300,
  height: 280,
  series,
  options: {
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    colors,
    labels,
    legend: { show: true, position: "right", labels: { colors: "#616161" } },
    tooltip: { y: { formatter: (value) => `${value} ${value === 1 ? "person" : "people"}` } },
  },
});

const Panel = ({ title, series, labels, colors }) => {
  const hasData = series.some((v) => v > 0);
  return (
    <div className="w-full">
      <div className="flex items-center gap-1 border py-1 px-1">
        <FaChartPie className="h-5 w-5" aria-hidden="true" />
        <h2 className="border-l p-1 font-medium">{title}</h2>
      </div>
      <Card className="rounded-b-xl rounded-t-none">
        <CardBody className="mt-4 grid place-items-center px-2 min-h-[200px]">
          {hasData ? <Chart {...pie(series, labels, colors)} /> : <p className="text-gray-500">No data yet</p>}
        </CardBody>
      </Card>
    </div>
  );
};

// Gender and staff-role breakdowns from live data (previously fixed 60/40 and 50/25/25).
export default function PieChart({ metrics }) {
  return (
    <section className="flex flex-col lg:flex-row justify-around gap-6 p-2">
      <Panel
        title="Registered members by gender"
        series={metrics.membersByGender}
        labels={["Male", "Female", "Other"]}
        colors={["#1e88e5", "#ff8f00", "#8e24aa"]}
      />
      <Panel
        title="Staff by designation"
        series={metrics.staffByDesignation}
        labels={["Manager", "Cashier", "Trainer"]}
        colors={["#1e88e5", "#ff8f00", "#43a047"]}
      />
    </section>
  );
}
