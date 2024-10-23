import React from 'react'
import dynamic from "next/dynamic";

const DualAxes = dynamic(() => import("@ant-design/plots").then(({ DualAxes }) => DualAxes), { ssr: false });

const LineChart = React.memo(() => {
    const data = [
        {
            year: "",
            "Sản phẩm lỗi": 0,
            "Sản phẩm đạt": 100,
        },
        {
            year: "Áo hoa nhí",
            "Sản phẩm lỗi": 120,
            "Sản phẩm đạt": 200,
        },
        {
            year: "Áo bảo hộ",
            "Sản phẩm lỗi": 220,
            "Sản phẩm đạt": 400,
        },
        {
            year: "Quần âu nam",
            "Sản phẩm lỗi": 450,
            "Sản phẩm đạt": 200,
        },
        {
            year: "Quần bảo hộ",
            "Sản phẩm lỗi": 800,
            "Sản phẩm đạt": 800,
        },
    ];
    const config = {
        data: [data, data],
        xField: "year",
        yField: ["Sản phẩm lỗi", "Sản phẩm đạt"],

        geometryOptions: [
            {
                geometry: "line",
                color: "#EE1E1E",
            },
            {
                geometry: "line",
                color: "#5599EC",
            },
        ],
        legend: {
            position: "top",
        },
        yAxis: {
            label: {
                formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
            },
        },
        animation: {
            appear: {
                animation: "path-in",
                duration: 5000,
            },
        },
    };
    return (
        <div className="bg-slate-50/60 p-3 border border-slate-50 rounded-lg">
            <div className="mt-[12px] mb-[32px] mx-2 ">
                <h2>Tỉ lệ sản phẩm lỗi hàng</h2>
                <div className="rounded-md bg-[#F9FAFB] w-full ">
                    <div className="mt-[28px]">
                        <DualAxes {...config} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default LineChart