import { useContext, useEffect, useMemo, useState } from "react"
import useLoad from "../hook/useLoad"

export default function DashboardView() {
    const {data: market, loading: isMarketLoading} = useLoad("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1");

    const [highlighted, setHighlighted] = useState("");

    const diameter = 500;

    const [palette, setPalette] = useState([]);

    useEffect(() => {
        let colors = [];
        for(let i = 0; i < 10;i ++){
            colors.push("#"+Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"));
        }
        setPalette(colors);
    }, []);

    const totalMarketCap = useMemo(() => {
        let total = 0;

        if(isMarketLoading){
            return 0;
        }

        for(const coin of market){
            total += coin.market_cap
        }

        return total;
    }, [market]);


    if(isMarketLoading){
        return <p>Market data loading !</p>
    }

    function getPointOnCircle(angle) {
        const radiantAngle = (angle - 90) * Math.PI / 180 ;

        const x = diameter/2 + diameter/2 * Math.cos(radiantAngle);
        const y = diameter/2 + diameter/2 * Math.sin(radiantAngle);

        return [x, y];
    }


    function getCircularPaths() {
        const paths = [];
        let previousAngle = 0;
        let index = 0;
        for(const coin of market) {
            const currentAngle = previousAngle + (coin.market_cap * 1.0 / totalMarketCap) * 360;
            const [startX, startY] = getPointOnCircle(previousAngle);
            const [endX, endY] = getPointOnCircle(currentAngle);
            const color = palette[index];
            paths.push(<path
                data-name={coin.name}
                fill={highlighted != coin.name ? color : "#FFFFFF"}
                d={`M${diameter/2},${diameter/2} L${startX},${startY} A${diameter/2},${diameter/2} 0,${Math.abs(currentAngle - previousAngle) > 180 ? 1 : 0},1 ${endX},${endY}`}
                onMouseEnter={() => setHighlighted(coin.name)}
                onMouseLeave={() => setHighlighted("")}
                ></path>);
            previousAngle = currentAngle
            index++;
        }

        return paths;
    }

    return (
        // Added min-h-screen to ensure the outer container has a minimum height,
        // allowing '1fr' in grid-rows to work correctly.
        // You might use h-screen if this component is meant to take the full viewport height.
        // 'h-full' alone might not be enough if its parent doesn't have a defined height.
        <div className="grid grid-rows-[10rem_1fr] min-h-screen">
            <h1 className="text-center text-white text-4xl font-bold py-10">Répartition du marché crypto</h1>
            {/* Added h-full to the grid-cols-2 div to ensure it takes the full available height from the '1fr' row. */}
            <div className="grid grid-cols-2 gap-20 h-full">
                <div className="flex justify-center items-center">
                    <svg className="aspect-square max-h-[500px]" viewBox={`0 0 ${diameter} ${diameter}`} xmlns="http://www.w3.org/2000/svg">
                        {
                            getCircularPaths()
                        }
                    </svg>
                </div>
                {/*
                    - Added h-full to the ul: This makes the ul take up 100% of the height of its parent grid cell.
                    - Changed overflow-scroll to overflow-y-scroll for explicit vertical scrolling.
                      (overflow-scroll handles both x and y, but y is what's needed here).
                */}
                <ul className="flex gap-5 flex-col overflow-y-scroll p-8 h-full">
                    {market.map((coin) => {
                        return (
                            <li
                                onMouseEnter={() => setHighlighted(coin.name)}
                                onMouseLeave={() => setHighlighted("")}
                                data-name={coin.name}
                                className={"flex items-center gap-4 text-white transition-all hover:cursor-pointer font-sans " + (highlighted == coin.name ? "font-bold scale-105" : "") }>
                                <img className="max-w-20 aspect-square" src={coin.image} alt={`Logo of ${coin.name}`} /> {coin.name}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}