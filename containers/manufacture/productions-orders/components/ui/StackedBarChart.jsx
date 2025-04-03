import React, { memo, useEffect, useRef, useState } from "react";
// import { Column } from "@ant-design/plots";
// import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
import { transformChartData } from "@/utils/charts/transformChartData";

const Bar = dynamic(() => import("@ant-design/plots").then(({ Column }) => Column), { ssr: false });

const StackedBarChart = memo(({ rawData }) => {
    const data = transformChartData(rawData);
    console.log('data');


    const config = {
        data,
        isStack: true,
        xField: 'value',
        yField: 'name',
        seriesField: 'type',
        color: {
            type: 'category',
            range: ['#73d13d', '#9254de', '#fa8c16', '#177ddc'], // Đổ xuất, Còn lại, Thu hồi, Kế hoạch
        },
        tooltip: {
            shared: true,
            showMarkers: false,
        },
        legend: {
            position: 'top',
        },
        label: {
            position: 'middle',
            layout: [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' },
            ],
        },
    };

    return <Bar {...config} />;
})

export default StackedBarChart;