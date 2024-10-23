import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { ArrowRight2 } from "iconsax-react";

const Area = dynamic(() => import("@ant-design/plots").then(({ Area }) => Area), { ssr: false });

const AreaChart = React.memo(() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(db);
    }, []);
    const db = [
        {
            timePeriod: "T5 ",
            "Chi phí": 60,
        },
        {
            timePeriod: "T6",
            "Chi phí": 55,
        },
        {
            timePeriod: "T7",
            "Chi phí": 65,
        },
        {
            timePeriod: "T8",
            "Chi phí": 70,
        },
        {
            timePeriod: "T9",
            "Chi phí": 84,
        },
        {
            timePeriod: "T10",
            "Chi phí": 95,
        },
    ];
    const config = {
        data,
        xField: "timePeriod",
        yField: "Chi phí",
        xAxis: {
            range: [0, 1],
        },
        color: "#0BAA2E",

        // color: "#0BAA2E",
        appendPadding: [10],
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[24px] mx-2 ">
                <div className="flex  items-center justify-between">
                    <h2>Biến động chi phí</h2>
                    <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                        <span>Xem chi tiết</span>
                        <ArrowRight2 size={18} />
                    </button>
                </div>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Area {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AreaChart