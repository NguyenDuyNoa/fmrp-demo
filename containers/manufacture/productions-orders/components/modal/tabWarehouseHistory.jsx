// lich su nhap kho tp
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


const TabWarehouseHistory = memo(({ isStateModal, width, dataLang, listTab }) => {
    const router = useRouter()

    const { paginate } = usePagination()

    const dataSeting = useSetingServer();

    const [isSearch, setIsSearch] = useState("");

    const { limit, updateLimit: sLimit } = useLimitAndTotalItems()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    // const { checkAdd, checkExport } = useActionRole(auth, "")

    const { dataProductExpiry, dataProductSerial } = useFeature()

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const onChangeSearch = debounce((e) => { setIsSearch(e.target.value) }, 500)


    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['api_get_purchase_products', isSearch],
        queryFn: async () => {
            let formData = new FormData();

            formData.append("search", isSearch);

            formData.append("pod_id", isStateModal?.dataDetail?.poi?.poi_id);

            const res = await apiProductionsOrders.apiGetPurchaseProducts(formData)

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
        <div className='h-full'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <h1 className="my-1 text-sm 3xl:text-basse">{listTab[isStateModal.isTab - 1]?.name}</h1>
                </div>
                <div className="flex items-center justify-end gap-1">
                    <SearchComponent
                        colSpan={1}
                        dataLang={dataLang}
                        placeholder={dataLang?.branch_search}
                        onChange={(e) => { onChangeSearch(e) }}
                        classInput={'border'}
                    />
                    <OnResetData sOnFetching={(e) => { }} onClick={refetch.bind(this)} />
                    <button onClick={() => { }} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                        <Grid6 className="scale-75 2xl:scale-100 xl:scale-100" size={18} />
                        <span>{dataLang?.client_list_exportexcel}</span>
                    </button>
                    <div>
                        <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                    </div>
                </div>
            </div>
            <div className={`${(width > 1100 ? "3xl:h-[calc(100vh_-_410px)] 2xl:h-[calc(100vh_-_390px)] xl:h-[calc(100vh_-_395px)] h-[calc(100vh_-_390px)]" : '3xl:h-[calc(100vh_-_520px)] 2xl:h-[calc(100vh_-_500px)] xl:h-[calc(100vh_-_490px)] h-[calc(100vh_-_490px)]')
                }  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}>
                <div>
                    <HeaderTable gridCols={13} display={'grid'}>
                        <ColumnTable colSpan={1} textAlign={'center'}>
                            STT
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Ngày chứng từ
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'center'}>
                            Mã chứng từ
                        </ColumnTable>
                        <ColumnTable colSpan={3} textAlign={'center'}>
                            {dataLang?.productions_orders_modal_exporting_materials_item || 'productions_orders_modal_exporting_materials_item'}
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Kho hàng
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Vị trí kho
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Số lượng
                        </ColumnTable>
                    </HeaderTable>
                    {(isFetching || isLoading)
                        ?
                        <Loading className="h-80" color="#0f4f9e" />
                        : data?.rResult?.length > 0
                            ?
                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                {
                                    data?.rResult?.map((e, index) => (
                                        <RowTable gridCols={13} key={e.id.toString()} >
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {index + 1}
                                            </RowItemTable>
                                            <RowItemTable colSpan={2} textAlign={'center'}>
                                                {formatMoment(e.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG)}
                                            </RowItemTable>
                                            <RowItemTable colSpan={1} textAlign={'center'}>
                                                {e.code}
                                            </RowItemTable>
                                            <RowItemTable colSpan={3} textAlign={'left'} className={'flex items-center gap-1'}>
                                                <ModalImage
                                                    small={e?.item?.images ?? '/no_img.png'}
                                                    large={e?.item?.images ?? '/no_img.png'}
                                                    width={36}
                                                    height={36}
                                                    alt={e?.item?.name}
                                                    className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className='flex flex-col'>
                                                            <span>{e?.item?.item_name}</span>
                                                            <div className='flex items-center gap-1 text-xs italic text-gray-500'>
                                                                <span>{e?.item?.item_code}</span>-<span>{e?.item?.product_variation}</span>
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
                                            <RowItemTable colSpan={2} textAlign={'center'}>
                                                {e?.item?.warehouse_name}
                                            </RowItemTable>
                                            <RowItemTable colSpan={2} textAlign={'center'}>
                                                {e?.item?.location_name}
                                            </RowItemTable>
                                            <RowItemTable colSpan={2} textAlign={'right'}>
                                                {e?.item?.quantity > 0 ? formatNumber(e?.item?.quantity) : '-'}
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
                <TitlePagination
                    dataLang={dataLang}
                    totalItems={data?.output?.iTotalDisplayRecords}
                />
                <Pagination
                    postsPerPage={limit}
                    totalPosts={Number(data?.output?.iTotalDisplayRecords)}
                    paginate={paginate}
                    currentPage={router.query?.page || 1}
                />
            </ContainerPagination>
        </div>
    )
})

export default TabWarehouseHistory