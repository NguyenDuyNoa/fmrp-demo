import React, { memo } from 'react'
import dynamic from "next/dynamic";
import { useGetTopProducedProducts } from '@/hooks/dashboard/useGetTopProducedProducts';
import useSetingServer from '@/hooks/useConfigNumber';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import NoData from '@/components/UI/noData/nodata';

const Pie = dynamic(() => import("@ant-design/plots").then(({ Pie }) => Pie), { ssr: false, });

const PieChart = (props) => {
    const { dataLang } = props

    const { data: dataTopProducedProducts, isLoading } = useGetTopProducedProducts()

    return (
        <div className="p-3 border rounded-lg bg-slate-50/60 border-slate-50">
            <div className="mt-[12px] mb-[32px] mx-2 ">
                <h2>{dataLang?.pie_chart_top_produced_products ?? "pie_chart_top_produced_products"}</h2>
                {
                    isLoading
                        ?
                        <div className='h-[420px] w-full bg-slate-100 animate-pulse rounded-md'></div>
                        :
                        dataTopProducedProducts?.data?.items?.length > 0
                            ?
                            <div className="rounded-md bg-[#F9FAFB] w-full ">
                                <div className="mt-[28px]">
                                    <Chart data={dataTopProducedProducts?.data?.items} dataLang={dataLang} />
                                </div>
                            </div>
                            :
                            <NoData type='dashboard' />
                }
            </div>
        </div>
    );
}

const Chart = memo((props) => {
    const { data, dataLang } = props

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const config = {
        appendPadding: 10,
        data: data ? data : [],
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: "inner",
            offset: "-50%",
            style: {
                textAlign: "center",
                fontSize: 14,
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
                content: `${dataLang?.pie_chart_total ?? "pie_chart_total"}\n${data ? formatNumber(data?.reduce((a, b) => a + b.value, 0)) : 0}`,
            },
        },
        legend: {
            // position: "right",
            offsetX: -40,
            itemName: {
                style: {
                    fontSize: 14,
                    color: "#1A202C",
                    fontStyle: "normal",
                    fontWeight: 600,
                    maxWidth: 150,
                },
            },
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,

            },
        },
    };
    return (
        <Pie className="" {...config} />
    )
})

export default PieChart