import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { ArrowRight2 } from "iconsax-react";

const Column = dynamic(() => import("@ant-design/plots").then(({ Column }) => Column), { ssr: false });

const ColumnChart = React.memo(() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // asyncFetch();
        setData(db);
    }, []);

    const db = [
        {
            year: "1991",
            value: 339,
            type: "Kế hoạch",
        },
        {
            year: "1992",
            value: 402,
            type: "Kế hoạch",
        },
        {
            year: "1993",
            value: 400,
            type: "Kế hoạch",
        },
        {
            year: "1994",
            value: 200,
            type: "Kế hoạch",
        },
        {
            year: "1995",
            value: 290,
            type: "Kế hoạch",
        },
        {
            year: "1991",
            value: 200,
            type: "Thực hiện",
        },
        {
            year: "1992",
            value: 202,
            type: "Thực hiện",
        },
        {
            year: "1993",
            value: 100,
            type: "Thực hiện",
        },
        {
            year: "1994",
            value: 140,
            type: "Thực hiện",
        },
        {
            year: "1995",
            value: 350,
            type: "Thực hiện",
        },
    ];

    const config = {
        data,
        isStack: true,
        xField: "year",
        yField: "value",
        seriesField: "type",
        color: ["#C7DFFB", "#5599EC"],
        minColumnWidth: 16,
        maxColumnWidth: 16,
        barStyle: {
            radius: [2, 2, 0, 0],
        },
        legend: {
            position: "top",
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[24px] mx-2 ">
                <div className="flex items-center justify-between">
                    <h2>Kế hoạch sản xuất</h2>
                    <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                        <span>Xem chi tiết</span>
                        <ArrowRight2 size={18} />
                    </button>
                </div>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Column {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ColumnChart