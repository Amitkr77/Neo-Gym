import PieChart from "../Dashboard/PieChart";
import Expense from "../Dashboard/Expense";
import ChartConfig from "../Dashboard/ChartConfig";
import useGymData from "../../../lib/useGymData";

export default function Charts() {
  const { loading, errors, metrics } = useGymData();

  if (loading) return <p className="p-6 text-gray-600" role="status">Loading reports…</p>;

  return (
    <>
      {errors.length > 0 && (
        <p className="m-2 p-3 rounded bg-amber-50 text-amber-800 text-sm">
          Some data could not be loaded ({errors.join(", ")}). Figures may be incomplete.
        </p>
      )}
      <ChartConfig metrics={metrics} />
      <Expense metrics={metrics} />
      <PieChart metrics={metrics} />
    </>
  );
}
