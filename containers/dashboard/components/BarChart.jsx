import React from 'react'
import dynamic from "next/dynamic";
import { ArrowRight2 } from "iconsax-react";

const Bar = dynamic(() => import("@ant-design/plots").then(({ Bar }) => Bar), { ssr: false, });

const BarChart = () => {
    const data = [
        {
            label: "ADINA",
            "Sản lượng": 4500,
        },
        {
            label: "SHAHOV",
            "Sản lượng": 4000,
        },
        {
            label: "POHUB",
            "Sản lượng": 3000,
        },
        {
            label: "RPAC",
            "Sản lượng": 2000,
        },
        {
            label: "PIA21029",
            "Sản lượng": 1000,
        },
    ];

    const config = {
        data,
        isGroup: true,
        xField: "Sản lượng",
        yField: "label",
        marginRatio: 0,
        label: {
            position: "right",
            offset: 4,
        },
        appendPadding: [10],
        barStyle: {
            radius: [2, 2, 0, 0],
        },
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
        minBarWidth: 16,
        maxBarWidth: 16,
    };
    
    return (
        <div className="bg-slate-50/60 p-3 space-y-4 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[24px] mx-2 ">
                <div className="flex justify-between items-center">
                    <h2>Top 5 khách hàng có sản lượng nhiều nhất</h2>
                    <button className="text-[#667085] bg-[#F3F4F6] px-4 py-2 rounded flex space-x-2 items-center hover:scale-105 transition">
                        <span>Xem chi tiết</span>
                        <ArrowRight2 size={18} />
                    </button>
                </div>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Bar {...config} />{" "}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart