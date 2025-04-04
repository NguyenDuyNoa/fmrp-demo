import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Column } from "@ant-design/plots";
// import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";

const Bar = dynamic(() => import("@ant-design/plots").then(({ Bar }) => Bar), { ssr: false });

const StackedBarChart = memo(({ rawData }) => {
    const dataSeting = useSetingServer();

    const formatNumber = useCallback((num) => formatNumberConfig(+num, dataSeting), [dataSeting]);

    const data = useMemo(() => {
        const chartData = [];

        rawData?.forEach((item) => {
            const name = item?.item_name;
            const item_code = item?.item_code;

            chartData.push(
                // { item_code, name, type: 'Đã xuất', value: formatNumber(item.quantity_exported) },
                // { item_code, name, type: 'Còn lại', value: formatNumber(item.quantity_rest) },
                // { item_code, name, type: 'Thu hồi', value: formatNumber(item.quantity_recovery) },
                // { item_code, name, type: 'Kế hoạch', value: formatNumber(item.quantity_total_quota) },
                { item_code, name, type: 'Đã xuất', value: +item.quantity_exported },
                { item_code, name, type: 'Còn lại', value: +item.quantity_rest },
                { item_code, name, type: 'Thu hồi', value: +item.quantity_recovery },
                { item_code, name, type: 'Kế hoạch', value: +item.quantity_total_quota }
            );
        });

        return chartData;
    }, [rawData, formatNumber]);

    const config = {
        data,
        // autoFit: true,
        isRange: true,
        isStack: true,
        xField: 'value', // value phải là [start, end]
        yField: 'item_code',
        seriesField: 'type',
        color: ({ type }) => {
            const colors = {
                'Kế hoạch': '#0375F3',
                'Đã xuất': '#1FC583',
                'Còn lại': '#8571F4',
                'Thu hồi': '#FF8F0D'
            };
            return colors[type];
        },
        // barStyle: ({ type }) => {

        //     const radiusMap = {
        //         'Đã xuất': [8, 8, 8, 8],       // đầu trái
        //         'Còn lại': [8, 8, 8, 8],
        //         'Thu hồi': [8, 8, 8, 8],
        //         'Kế hoạch': [8, 8, 8, 8],     // cuối phải
        //     };

        //     return {
        //         lineWidth: 1,
        //         radius: radiusMap[type] || [0, 0, 0, 0],
        //     };
        // },
        barWidthRatio: 0.5,
        minBarWidth: 16,
        maxBarWidth: 20,
        marginRatio: 0.05, // 🔥 giảm khoảng cách giữa bar
        appendPadding: [10, 10, 10, 10], // giảm padding tổng thể
        // tooltip: {
        //     shared: true,
        //     showMarkers: false,
        //     customContent: (title, items) => {
        //         return `
        //             <div class="p-2">
        //                 <div class="font-bold text-blue-500">${title}</div>
        //                     ${items.map((item) => `
        //                     <div class="flex justify-between text-sm text-gray-700">
        //                         <span>${item.name}</span>
        //                         <span>${formatNumber(item.value)}</span>
        //                     </div>`
        //         ).join('')}
        //             </div>`;
        //     },
        // },
        legend: {
            position: 'bottom',       // đưa xuống dưới
            layout: 'horizontal',     // các item nằm ngang
            align: 'start',            // căn trái
            itemSpacing: 16,          // khoảng cách giữa các item
            itemName: {
                style: {
                    fontSize: 13,
                    fill: '#3A3E4C',
                    fontWeight: 500,
                },
            },
            marker: {
                symbol: 'circle',       // hình tròn
                style: {
                    r: 6,                 // bán kính marker
                    d: 10
                },
            },
        },

        // label: {
        //     position: 'middle',
        //     content: ({ value }) => `${formatNumber(value)}`,
        //     style: {
        //         fill: '#fff',
        //         fontWeight: 500,
        //     },
        // },

        interactions: [
            { type: 'tooltip' }, // vẫn giữ tooltip
        ],
        state: {
            active: {
                style: {
                    opacity: 1,
                    stroke: '#00000000', // không có viền
                },
            },
            inactive: {
                style: {
                    opacity: 1, // 👈 ngăn không cho bị làm mờ khi không active
                },
            },
        },
    };

    return (
        <div className="bg-white w-full min-h-[330px] px-4 pt-4 pb-2 ">
            <Bar {...config} />
            <div className="flex justify-end gap-2 mt-4">
                <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100">📤 Xuất PNG</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100">📊 Xuất Excel</button>
            </div>
        </div>
    )
})

export default StackedBarChart;