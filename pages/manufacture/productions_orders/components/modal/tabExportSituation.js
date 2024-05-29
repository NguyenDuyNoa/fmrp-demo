// tình hình xuất NVL
import React, { memo, useState } from 'react'
// import { Column } from '@ant-design/plots';
const Column = dynamic(() => import("@ant-design/plots").then(({ Column }) => Column), { ssr: false });

import ReactDOM from 'react-dom';
import dynamic from 'next/dynamic';
const data = [
    { type: 'Vải', value: 0.16, column: 'plan' },
    { type: 'Quần', value: 1.5, column: 'plan' },
    { type: 'Áo', value: 4.5, column: 'plan' },
    { type: 'Cúc', value: 3, column: 'plan' },
    { type: 'Chỉ may', value: 2, column: 'plan' },
    { type: 'Kim', value: 1, column: 'plan' },
];

const DemoColumn = memo(() => {
    const config = {
        data,
        xField: 'type',
        yField: 'value',
        yAxis: {
            max: 5, // Thiết lập giá trị tối đa cho trục y
        },
        style: {
            fill: ({ type }) => {
                if (type === '10-30分' || type === '30+分') {
                    return '#22CBCC';
                }
                return '#2989FF';
            },
        },
        tooltip: {
            customContent: (title, items) => {
                // Trả về văn bản tùy chỉnh bạn muốn hiển thị
                return `<div><p style="margin: 0;">${title}</p><p style="margin: 0;">${items[0]?.data?.column == 'plan' ? "Kế hoạch" : ""}: ${items[0]?.data?.value}</p></div>`;
            },
        },
        label: {
            text: (originData) => {
                const val = parseFloat(originData.value);
                return (val * 100).toFixed(1) + '%';
            },
            offset: 10,
        },
        legend: false,
    };
    return <Column {...config} />;
})
const TabExportSituation = memo(({ handleShowProcess, isStateModal, width, dataLang, listTab }) => {
    const [isTab, setIsTab] = useState('chart')
    return (
        <div className='h-full'>
            <div className='flex items-center gap-3'>
                <h1 className="3xl:text-xl text-base my-1">{listTab[isStateModal.isTab - 1]?.name}</h1>
                <div className="flex  items-center gap-4">
                    <button type="button" onClick={() => setIsTab('chart')} className={`${isTab === 'chart' && 'border-green-500 border'} bg-[#EBFEF2] text-[#0BAA2E] py-[2px] px-[10px] font-normal text-xs w-fit rounded-md  flex gap-1 items-center`}>
                        Biểu đồ thống kê
                    </button>
                    <button type="button" onClick={() => setIsTab('table')} className={`${isTab === 'table' && 'border-[#EE1E1E] border'} bg-[#FFEEF0] text-[#EE1E1E] py-[2px] px-[10px] font-normal text-xs w-fit rounded-md  flex gap-1 items-center`}>
                        Danh sách dữ liệu
                    </button>
                </div>
            </div>
            <div className={`${width > 1100 ? "h-[calc(100vh_-_343px)]" : 'h-[calc(100vh_-_473px)]'}  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}>
                <div>

                </div>
                {isTab === 'chart' &&
                    <div className='h-full'>
                        <DemoColumn />
                    </div>
                }
            </div>
        </div>
    )
})

export default TabExportSituation