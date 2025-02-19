import NoData from '@/components/UI/noData/nodata';
import { useGetDefectiveProductRate } from '@/hooks/dashboard/useGetDefectiveProductRate';
import useSetingServer from '@/hooks/useConfigNumber';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import dynamic from "next/dynamic";
import React from 'react';
const Line = dynamic(() => import("@ant-design/plots").then(({ Line }) => Line), { ssr: false });
const DualAxes = dynamic(() => import("@ant-design/plots").then(({ DualAxes }) => DualAxes), { ssr: false });

const LineChart = React.memo((props) => {
    const { dataLang } = props

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const { data: dataDefective, isLoading } = useGetDefectiveProductRate()

    // const config = {
    //     data: [dataDefective?.data?.items],
    //     xField: "item_name",
    //     yField: ["quantity_error", "quantity"],
    //     geometryOptions: [
    //         {
    //             geometry: "line",
    //             color: "#EE1E1E",
    //             smooth: true, // Làm cong đường line
    //             lineStyle: { lineWidth: 2 },
    //             point: { shape: "circle", size: 5, style: { fill: "#EE1E1E", stroke: "#fff", lineWidth: 2 } },
    //         },
    //         {
    //             geometry: "line",
    //             color: "#5599EC",
    //             smooth: true, // Làm cong đường line
    //             lineStyle: { lineWidth: 2 },
    //             point: { shape: "circle", size: 5, style: { fill: "#5599EC", stroke: "#fff", lineWidth: 2 } },
    //         },
    //     ],
    //     meta: {
    //         quantity_error: {
    //             alias: "Sản phẩm lỗi",
    //             formatter: (val) => `${formatNumber(val)}`

    //         }, // Đổi tên
    //         quantity: {
    //             alias: "Sản phẩm đạt",
    //             formatter: (val) => `${formatNumber(val)}`
    //         },
    //     },
    //     tooltip: {
    //         shared: true,
    //         showMarkers: true,
    //         // formatter: (datum) => {
    //         //     console.log("datum", datum);

    //         //     return {
    //         //         name: datum.quantity_error ? "Sản phẩm lỗi" : "Sản phẩm đạt",
    //         //         value: formatNumber(datum?.value),
    //         //     };
    //         // },
    //     },


    //     legend: {
    //         position: "top",
    //     },
    //     yAxis: {
    //         label: {
    //             formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
    //         },
    //     },
    //     animation: {
    //         appear: {
    //             animation: "path-in",
    //             duration: 5000,
    //         },
    //     },
    // };

    const config = {
        data: dataDefective?.data?.items ? dataDefective?.data?.items : [],
        padding: 'auto',
        xField: 'item_name',
        yField: 'quantity_error',
        // xAxis: {
        //     // type: 'timeCat',
        //     // tickCount: 5,
        // },
        smooth: true, // Làm cong đường line
        lineStyle: {
            lineWidth: 2, // Độ dày đường
        },
        meta: {
            quantity_error: {
                alias: dataLang?.line_chart_defective_products ?? "line_chart_defective_products",
                formatter: (val) => `${formatNumber(val)}`

            },
        }, // Đổi tên
        point: {
            shape: 'circle',
            size: 5,
            style: {
                fill: '#5B8FF9',
                stroke: '#fff',
                lineWidth: 2,
            },
        },
    };

    return (
        <div className="p-3 border rounded-lg bg-slate-50/60 border-slate-50" >
            <div className="mt-[12px] mb-[32px] mx-2 ">
                <h2>{dataLang?.line_chart_defective_product_rate ?? "line_chart_defective_product_rate"}</h2>
                {
                    isLoading
                        ?
                        <div className='h-[420px] w-full bg-slate-100 animate-pulse rounded-md'></div>
                        :
                        dataDefective?.data?.items?.length > 0
                            ?
                            <div className="rounded-md bg-[#F9FAFB] w-full ">
                                <div className="mt-[28px]">
                                    <Line {...config} />
                                </div>
                            </div>
                            :
                            <NoData type='dashboard' />
                }

            </div>
        </div >
    );
});


export default LineChart