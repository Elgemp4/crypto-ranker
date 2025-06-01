import { useEffect, useMemo, useState } from "react";
import useLoad from "../hook/useLoad";
import { Link, NavLink } from "react-router";

export default function DashboardView() {
  const { data: market, loading: isMarketLoading } = useLoad(
    "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
  );

  const [highlighted, setHighlighted] = useState("");

  const diameter = 500;

  const [palette, setPalette] = useState([]);

  useEffect(() => {
    let colors = [];
    for (let i = 0; i < 10; i++) {
      colors.push(
        "#" +
          Math.floor(Math.random() * 16777216)
            .toString(16)
            .padStart(6, "0")
      );
    }
    setPalette(colors);
  }, []);

  const totalMarketCap = useMemo(() => {
    let total = 0;

    if (isMarketLoading) {
      return 0;
    }

    for (const coin of market) {
      total += coin.market_cap;
    }

    return total;
  }, [market, isMarketLoading]);

  if (isMarketLoading) {
    return <p>Market data loading !</p>;
  }

  function getPointOnCircle(angle) {
    // const radiantAngle = ((angle - 90) * Math.PI) / 180;

    const x = diameter / 2 + (diameter / 2) * Math.cos(angle);
    const y = diameter / 2 + (diameter / 2) * Math.sin(angle);

    return [x, y];
  }

  //angle for calculation uses radians as javascript Math implementation uses radians
  function getCircularPaths() {
    const paths = [];
    let previousAngle = -0.5 * Math.PI; //Start at the top of the circle
    let index = 0;
    for (const coin of market) {
      const percentage = (coin.market_cap * 1.0) / totalMarketCap;
      const currentAngle = previousAngle + percentage * (2 * Math.PI); // 2PI radians = 360°

      const [startX, startY] = getPointOnCircle(previousAngle);
      const [endX, endY] = getPointOnCircle(currentAngle);
      const color = palette[index];
      paths.push(
        <path
          data-name={coin.name}
          fill={highlighted != coin.name ? color : "#EEEEEE"}
          d={`M${diameter / 2},${diameter / 2} L${startX},${startY} A${
            diameter / 2
          },${diameter / 2} 0,${
            Math.abs(currentAngle - previousAngle) > Math.PI ? 1 : 0
          },1 ${endX},${endY}`}
          onMouseEnter={() => setHighlighted(coin.name)}
          onMouseLeave={() => setHighlighted("")}
        ></path>
      );
      previousAngle = currentAngle;
      index++;
    }

    return paths;
  }

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-center text-white text-4xl font-bold py-10">
        Répartition du marché crypto
      </h1>
      <div className="grid grid-cols-2 grid-rows-1 flex-1 gap-20 overflow-hidden p-8">
        <div className="flex justify-center items-center">
          <svg
            className="aspect-square max-h-[500px]"
            viewBox={`0 0 ${diameter} ${diameter}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {getCircularPaths()}
          </svg>
        </div>
        <ul className="flex gap-5 rounded-md border-gray-700 border-2 flex-col overflow-scroll p-6 my-10 ">
          {market.map((coin) => {
            return (
              <li
                onMouseEnter={() => setHighlighted(coin.name)}
                onMouseLeave={() => setHighlighted("")}
                data-name={coin.name}
                className={
                  " text-white transition-all p-4 rounded-md hover:cursor-pointer  font-sans " +
                  (highlighted == coin.name
                    ? "font-bold scale-105 bg-gray-900"
                    : "")
                }
              >
                <NavLink
                  className="flex items-center gap-4"
                  to={`/details/${coin.id}`}
                >
                  <img
                    className="max-w-20 aspect-square"
                    src={coin.image}
                    alt={`Logo of ${coin.name}`}
                  />{" "}
                  {coin.name} (${coin.market_cap.toLocaleString("de-DE")}€)
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
