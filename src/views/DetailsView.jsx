import { useParams } from "react-router";
import useLoad from "../hook/useLoad";

export default function DetailsView() {
  const { id } = useParams();

  const { data: coinInfo, loading: infoLoading } = useLoad(`/coins/${id}`);

  const { data: coinChart, loading: chartLoading } = useLoad(
    `/coins/${id}/market_chart?days=365&vs_currency=eur`
  );

  const height = 100;
  const width = 600;

  if (infoLoading || chartLoading) {
    return <p>Loading data...</p>;
  }

  function getPolyline() {
    const points = [];

    const data = coinChart["prices"];

    const max = Math.max(...data.map((v) => v[1]));
    const xOffset = width / data.length;
    let index = 0;

    for (const cap of data) {
      points.push(`${xOffset * index},${(cap[1] / max) * height}`);
      index++;
    }

    return <polyline points={points.join(" ")} fill="none" stroke="black" />;
  }

  return (
    <div className="text-white p-8">
      <div className="flex items-center gap-5">
        <img src={coinInfo.image.small} alt={coinInfo.name + " logo"} />
        <h1 className="text-5xl fotn-bold">{coinInfo.name}</h1>
      </div>
      <h2>Evolution du market cap</h2>
      <div>
        <svg
          className="bg-white p-4"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {getPolyline()}
        </svg>
      </div>
    </div>
  );
}
