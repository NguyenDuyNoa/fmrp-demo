// lich su xuất NVL/btp
import apiProductionsOrders from '@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders';
import OnResetData from '@/components/UI/btnResetData/btnReset';
import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination';
import TitlePagination from '@/components/UI/common/ContainerPagination/TitlePagination';
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/Table';
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit';
import SearchComponent from '@/components/UI/filterComponents/searchComponent';
import Loading from '@/components/UI/loading/loading';
import NoData from '@/components/UI/noData/nodata';
import Pagination from "@/components/UI/pagination";
import { optionsQuery } from '@/configs/optionsQuery';
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate';
import useFeature from '@/hooks/useConfigFeature';
import useSetingServer from '@/hooks/useConfigNumber';
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems';
import usePagination from '@/hooks/usePagination';
import { formatMoment } from '@/utils/helpers/formatMoment';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useQuery } from '@tanstack/react-query';
import { Grid6 } from 'iconsax-react';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import ModalImage from 'react-modal-image';
import { useSelector } from 'react-redux';
const TabExportHistory = memo(({ isStateModal, width, dataLang, listTab }) => {

    const router = useRouter()

    const dataSeting = useSetingServer()

    const { paginate } = usePagination()
    //search mã ct
    const [isSearch, setIsSearch] = useState("");

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems()

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    // const { checkAdd, checkExport } = useActionRole(auth, "")

    const onChangeSearch = debounce((e) => { setIsSearch(e.target.value) }, 500)

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['api_get_suggest_exporting', isSearch],
        queryFn: async () => {
            let formData = new FormData();

            formData.append("search", isSearch);

            formData.append("pod_id", isStateModal?.dataDetail?.poi?.poi_id);

            const res = await apiProductionsOrders.apiGetSuggestExporting(formData)

            const flattenedItemsArray = res?.data?.rResult.flatMap(entry =>
                entry.items.map(item => ({
                    branch_name: entry.branch_name,
                    code: entry.code,
                    created_by: entry.created_by,
                    date: entry.date,
                    grand_total: entry.grand_total,
                    id: entry.id,
                    note: entry.note,
                    poi_data: entry.poi_data,
                    poi_id: entry.poi_id,
                    staff_create: entry.staff_create,
                    total_quantity: entry.total_quantity,
                    item
                }))
            );
            return { ...res.data, rResult: flattenedItemsArray } || {}
        },
        ...optionsQuery
    })




    return (
        <div className='h-full overflow-x-hidden'>
            <div className='flex items-center justify-between'>
                {/* <div className='flex items-center gap-1'>
                    <h1 className="my-1 text-sm 3xl:text-basse">{listTab[isStateModal.isTab - 1]?.name}</h1>
                </div> */}
                <SearchComponent
                    colSpan={2}
                    dataLang={dataLang}
                    placeholder={dataLang?.branch_search}
                    onChange={(e) => onChangeSearch(e)}
                    classInput={'border'}
                    classNameBox={'w-[25%]'}
                />
                <div className="flex items-center justify-end gap-1">
                    <OnResetData sOnFetching={(e) => { }} onClick={refetch.bind(this)} />
                    <button onClick={() => { }} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                        <Grid6 className="scale-75 2xl:scale-100 xl:scale-100" size={18} />
                        <span>{dataLang?.client_list_exportexcel}</span>
                    </button>
                    {/* <div>
                        <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                    </div> */}
                </div>
            </div>
            <div
                className={`h-[65vh] w-full overflow-x-auto  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}>
                {/* className={`${(width > 1100 ? "3xl:h-[calc(100vh_-_410px)] 2xl:h-[calc(100vh_-_390px)] xl:h-[calc(100vh_-_395px)] h-[calc(100vh_-_390px)]" : '3xl:h-[calc(100vh_-_520px)] 2xl:h-[calc(100vh_-_500px)] xl:h-[calc(100vh_-_490px)] h-[calc(100vh_-_490px)]')
                }  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}> */}
                <div>
                    <HeaderTable gridCols={12} display={'grid'}>
                        <ColumnTable colSpan={1} textAlign={'center'} className={'normal-case !text-[13px]'}>
                            STT
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'} className={'normal-case !text-[13px]'}>
                            {dataLang?.productions_orders_modal_exporting_materials_document_date || 'productions_orders_modal_exporting_materials_document_date'}
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'} className={'normal-case !text-[13px]'}>
                            {dataLang?.productions_orders_modal_exporting_materials_document_code || 'productions_orders_modal_exporting_materials_document_code'}
                        </ColumnTable>
                        <ColumnTable colSpan={3} textAlign={'center'} className={'normal-case !text-[13px]'}>
                            {dataLang?.productions_orders_modal_exporting_materials_item || 'productions_orders_modal_exporting_materials_item'}
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'} className={'normal-case !text-[13px]'}>
                            {dataLang?.productions_orders_modal_exporting_materials_unit || 'productions_orders_modal_exporting_materials_unit'}
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'} className={'normal-case !text-[13px]'}>
                            {dataLang?.productions_orders_modal_exporting_materials_quantity || 'productions_orders_modal_exporting_materials_quantity'}
                        </ColumnTable>
                    </HeaderTable>
                    {
                        (isLoading || isFetching)
                            ?
                            <Loading className="h-80" color="#0f4f9e" />
                            : data?.rResult?.length > 0
                                ?
                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                    {
                                        data?.rResult?.map((e, index) => (
                                            <RowTable gridCols={12} key={e.id.toString()} >
                                                <RowItemTable colSpan={1} textAlign={'center'} textSize={'!text-xs'}>
                                                    {index + 1}
                                                </RowItemTable>
                                                <RowItemTable colSpan={2} textAlign={'center'} textSize={'!text-xs'}>
                                                    {formatMoment(e.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG)}
                                                </RowItemTable>
                                                <RowItemTable colSpan={2} textAlign={'center'} textSize={'!text-xs'}>
                                                    {e.code}
                                                </RowItemTable>
                                                <RowItemTable colSpan={3} textAlign={'left'} className={'flex items-center gap-1'}>
                                                    <ModalImage
                                                        small={e?.item?.images ?? '/nodata.png'}
                                                        large={e?.item?.images ?? '/nodata.png'}
                                                        width={36}
                                                        height={36}
                                                        alt={e?.item?.name}
                                                        className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className='flex flex-col'>
                                                                <span className='!text-xs'>{e?.item?.item_name}</span>
                                                                <div className='flex items-center gap-1 text-xs italic text-gray-500'>
                                                                    <span>{e?.item?.product_variation}</span>
                                                                    {/* <span>{e?.item?.item_code}</span>-<span>{e?.item?.product_variation}</span> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center font-oblique">
                                                            {
                                                                dataProductSerial.is_enable === "1" && (
                                                                    <div className="flex gap-0.5">
                                                                        <h6 className="text-[12px]">
                                                                            Serial:
                                                                        </h6>
                                                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                            {e?.item?.serial == null || e?.item?.serial == "" ? "-" : e?.item?.serial}
                                                                        </h6>
                                                                    </div>
                                                                )
                                                            }
                                                            {
                                                                dataProductExpiry.is_enable === "1" && (
                                                                    <>
                                                                        <div className="flex gap-0.5">
                                                                            <h6 className="text-[12px]">
                                                                                Lot:
                                                                            </h6>{" "}
                                                                            <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                {e?.item?.lot == null || e?.item?.lot == "" ? "-" : e?.item?.lot}
                                                                            </h6>
                                                                        </div>
                                                                        <div className="flex gap-0.5">
                                                                            <h6 className="text-[12px]">
                                                                                Date:
                                                                            </h6>{" "}
                                                                            <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                {e?.item?.expiration_date ? formatMoment(e?.item?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                            </h6>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </RowItemTable>
                                                <RowItemTable colSpan={2} textAlign={'center'} textSize={'!text-xs'}>
                                                    {e?.item?.unit_name}
                                                </RowItemTable>
                                                <RowItemTable colSpan={2} textAlign={'right'} textSize={'!text-xs'}>
                                                    {e?.item?.quantity_export > 0 ? formatNumber(e?.item?.quantity_export) : '-'}
                                                </RowItemTable>
                                            </RowTable>
                                        ))
                                    }
                                </div>
                                :
                                <NoData />
                    }
                </div>
            </div>
            <ContainerPagination>
                {/* <TitlePagination
                    dataLang={dataLang}
                    totalItems={data?.output?.iTotalDisplayRecords}
                /> */}
                <Pagination
                    postsPerPage={limit}
                    totalPosts={data?.output?.iTotalDisplayRecords}
                    paginate={paginate}
                    currentPage={router.query?.page || 1}
                />
            </ContainerPagination>
        </div>
    )
})

export default TabExportHistory