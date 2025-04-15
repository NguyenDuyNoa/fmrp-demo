import CalendarDropdown from "@/components/common/dropdown/CalendarDropdown";
import { handleTicksBarChart } from "@/utils/helpers/deviceTicksChart";
import React, { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const top5CustomersData = [
    {
        name: "Công ty Dệt may Happy Polla",
        volume: 3100,
    },
    {
        name: "Công ty May mặc Saigon trendy",
        volume: 2900,
    },
    {
        name: "Outlet Lemon squeeze",
        volume: 3300,
    },
    {
        name: "Shop quần áo streetwear New Era",
        volume: 2700,
    },
    {
        name: "Shop thời trang công sở Basic Office",
        volume: 2600,
    },
];

const BarChartHorizontal = () => {
    const [top5Customers, setTop5Customers] = useState();
    const [ticks, setTicks] = useState([]);

    useEffect(() => {
        const processedData = top5CustomersData.map((customer) => ({
            ...customer,
            name: customer.name || "-",
        }));
        setTop5Customers(processedData);

        const allValues = processedData.flatMap((item) => {
            return [item.volume];
        });
        const dynamicTicks = handleTicksBarChart(allValues);
        setTicks(dynamicTicks);
    }, []);

    return (
        <div className="xlg:p-6 p-3  rounded-2xl bg-neutral-00 w-full shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.20)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
                <h2 className="flex-1 capitalize text-lg font-medium  text-typo-black-1">
                    Top 5 Khách Hàng Có Sản Lượng Nhiều Nhất
                </h2>
                <CalendarDropdown />
            </div>

            <ResponsiveContainer width="100%" height={316}>
                <BarChart
                    data={top5Customers}
                    layout="vertical"
                    margin={{ top: 30, right: 40, left: 0, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        vertical={true}
                    />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        // domain={[0, 3200]}
                        domain={[0, ticks[ticks.length - 1]]}
                        ticks={ticks}
                        tick={{ fontSize: 12, fill: "#9295A4" }}
                        dy={3}
                        label={{
                            value: "Sản lượng",
                            position: "insideLeft",
                            offset: -40,
                            style: { textAnchor: "middle", fill: "#667085", fontSize: 12 },
                        }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        width={120}
                        tick={{
                            fontSize: 12,
                            fill: "#9295A4",
                        }}
                        tickFormatter={(value) => value}
                        label={{
                            value: "Khách hàng",
                            position: "top",
                            offset: 10,
                            dx: 20,
                            style: { textAnchor: "", fill: "#667085", fontSize: 12 },
                        }}
                    />
                    <Tooltip
                        cursor={false}
                        content={({ active, payload, coordinate }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="relative">
                                        <div
                                            className="bg-neutral-900 text-white py-1 px-3 rounded-md shadow-md"
                                            style={{
                                                position: "absolute",
                                                left: coordinate?.x != null ? coordinate.x + 20 : 0,
                                                top: coordinate?.y != null ? coordinate.y - 15 : 0,
                                            }}
                                        >
                                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-neutral-900 border-b-[6px] border-b-transparent" />

                                            <p className="text-sm font-medium">{payload[0].value}</p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar
                        dataKey="volume"
                        fill="#1E88E5"
                        barSize={8}
                        radius={[0, 4, 4, 0]}
                        name="Sản lượng"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartHorizontal;
