import React from 'react'
import dynamic from "next/dynamic";

const Pie = dynamic(() => import("@ant-design/plots").then(({ Pie }) => Pie), { ssr: false, });

const PieChart = React.memo(() => {
    const data = [
        {
            type: "Áo hoa nhí  ",
            value: 56,
        },
        {
            type: "Áo bảo hộ lao động",
            value: 26,
        },
        {
            type: "Quần âu nam",
            value: 46,
        },
        {
            type: "Quần bảo hộ",
            value: 10,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: "inner",
            offset: "-50%",
            style: {
                textAlign: "center",
            },
            autoRotate: false,
            content: "{value}",
        },
        interactions: [
            {
                type: "element-selected",
            },
            {
                type: "element-active",
            },
        ],
        color: ["#5599EC", "#1760B9", "#C7DFFB", "#92BFF7"],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: "pre-wrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.2",
                },
                content: `Tổng\n ${132}`,
            },
        },
        legend: {
            position: "right",
            itemName: {
                style: {
                    fontSize: 16,
                    color: "#1A202C",
                    fontStyle: "normal",
                    fontWeight: 600,
                },
            },
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[32px] mx-2 ">
                <h2>Top sản phẩm sản xuất nhiều nhất</h2>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <Pie className="" {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PieChart