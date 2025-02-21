import { Customscrollbar } from '@/components/UI/common/Customscrollbar';
import LoadingButton from '@/components/UI/loading/loadingButton';
import NoData from '@/components/UI/noData/nodata';
import { useGetMaterialsToPurchase } from '@/hooks/dashboard/useGetMaterialsToPurchase';
import useSetingServer from '@/hooks/useConfigNumber';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';


const TableChart = React.memo((props) => {
    const { dataLang } = props

    const { ref, inView } = useInView()

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const { data: dataMaterial, isLoading, hasNextPage, fetchNextPage } = useGetMaterialsToPurchase()

    const convertData = dataMaterial ? dataMaterial?.pages?.map((item) => item?.items).flat() : []

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage])


    return (
        <div className="p-3 space-y-4 border rounded-lg bg-slate-50/60 border-slate-50 ">
            <h2>{dataLang?.table_chart_materials_needed ?? "table_chart_materials_needed"}</h2>
            <div>
                {
                    isLoading
                        ?
                        <div className='flex flex-col gap-2'>
                            {
                                Array.from({ length: 10 }).map((_, index) => (
                                    <div key={index} className='h-[40px] w-full bg-slate-100 animate-pulse'></div>
                                ))


                            }
                        </div>
                        :
                        convertData?.length > 0
                            ?
                            <>
                                <div className="grid grid-cols-8 gap-3 py-5 pl-3 pr-4 bg-slate-50">
                                    <h5 className="text-[#667085] text-[13px]">{"STT"}</h5>
                                    <h5 className="text-[#667085] text-[13px] col-span-2 text-center">{dataLang?.table_chart_material_code ?? "table_chart_material_code"}</h5>
                                    <h5 className="text-[#667085] text-[13px] col-span-3">{dataLang?.table_chart_material_name ?? "table_chart_material_name"}</h5>
                                    <h5 className="text-[#667085] text-[13px] col-span-2 text-right">{dataLang?.table_chart_quantity ?? "table_chart_quantity"}</h5>
                                </div>
                                <Customscrollbar className="h-[350px]">
                                    <div className="divide-y divide-slate-100">
                                        {
                                            convertData.map((e, index) => (
                                                <div
                                                    className="grid grid-cols-8 gap-3 py-4 pl-3 pr-4 hover:bg-white"
                                                    key={e?.item_id}
                                                >
                                                    <h6 className='col-span-1 text-sm'>{index + 1}</h6>
                                                    <h6 className="col-span-2 text-sm text-center">{e?.item_code}</h6>
                                                    <h6 className="col-span-3 text-sm line-clamp-1">{e?.item_name}</h6>
                                                    <h6 className="col-span-2 text-sm text-right">{formatNumber(e?.quantity)}</h6>
                                                </div>
                                            ))

                                        }
                                        {hasNextPage && <LoadingButton ref={ref} />}
                                    </div>

                                </Customscrollbar>
                            </>
                            :
                            <NoData type='dashboard' />
                }
            </div>
        </div>
    );
});

export default TableChart