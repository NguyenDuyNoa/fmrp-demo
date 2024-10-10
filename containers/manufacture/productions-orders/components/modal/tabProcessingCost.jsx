// tình hình xuất NVL
import OnResetData from '@/components/UI/btnResetData/btnReset';
import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination';
import TitlePagination from '@/components/UI/common/ContainerPagination/TitlePagination';
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/Table';
import { ContainerTotal } from '@/components/UI/common/layout';
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit';
import SearchComponent from '@/components/UI/filterComponents/searchComponent';
import Loading from '@/components/UI/loading/loading';
import NoData from '@/components/UI/noData/nodata';
import Pagination from "@/components/UI/pagination";
import useSetingServer from '@/hooks/useConfigNumber';
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { Grid6 } from 'iconsax-react';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import ModalImage from 'react-modal-image';
import { useSelector } from 'react-redux';
import { v4 as uddid } from 'uuid';


const initialState = {
    onFetching: false,
    dataTable: [
        {
            id: uddid(),
            image: '/no_img.png',
            name: 'ÁO SƠ MI - S - TRẮNG',
            itemVariation: 'Biến thể 1',
            code: 'SMM',
            unit: 'Cái',
            type: 'materials',
            quantityExport: 500,
            quantityRecall: 500,
            exportCosts: 1000000,
            recoveryCosts: 1000000,
            moneyTone: 2000000,
            //sl gia công
            machiningQuantity: 1000,
            // chi phí gia công
            processingCost: 10000
        },
    ]
}

const TabProcessingCost = memo(({ isStateModal, width, dataLang, listTab }) => {
    const router = useRouter()

    const dataSeting = useSetingServer();

    const [isTab, setIsTab] = useState(1)

    const [isExportSituation, setIsExportSituation] = useState(initialState)

    const queryStatesetExportSituation = (key) => setIsExportSituation(x => ({ ...x, ...key }))

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()
    // const { checkAdd, checkExport } = useActionRole(auth, "")

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };


    useEffect(() => {
        sTotalItems(10)
        queryStatesetExportSituation({ onFetching: true })
        setTimeout(() => {
            queryStatesetExportSituation({ onFetching: false })
        }, 2000)
    }, [isTab])


    return (
        <div className='h-full'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <h1 className="3xl:text-basse text-sm my-1">{listTab[isStateModal.isTab - 1]?.name}</h1>
                    <div className="relative">
                        <select
                            id="select-2"
                            value={isTab}
                            onChange={(value) => {
                                paginate(1)
                                setIsTab(value.target.value)
                            }}
                            className="px-2 py-1 block w-full border-teal-500 border outline-none rounded-lg text-xs focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none  text-neutral-500">
                            <option value={1} className='text-sm'>Chi phí NVL xuất sản xuất tại xưởng</option>
                            <option value={2} className='text-sm'>Chi phí NVL xuất gia công ngoài</option>
                            <option value={3} className='text-sm'>Chi phí gia công</option>
                        </select>
                    </div>
                </div>
                {
                    <div className="flex justify-end items-center gap-1">
                        <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={() => { }} classInput={'border'} />
                        <OnResetData sOnFetching={(e) => queryStatesetExportSituation({ onFetching: e })} />
                        <button onClick={() => { }} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                            <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                            <span>{dataLang?.client_list_exportexcel}</span>
                        </button>
                        <div>
                            <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                        </div>
                    </div>
                }
            </div>
            <div className={`${(width > 1100 ? "3xl:h-[calc(100vh_-_450px)] 2xl:h-[calc(100vh_-_430px)] xl:h-[calc(100vh_-_440px)] h-[calc(100vh_-_455px)]" : '3xl:h-[calc(100vh_-_575px)] 2xl:h-[calc(100vh_-_550px)] xl:h-[calc(100vh_-_530px)] h-[calc(100vh_-_525px)]')
                }  scrollbar-thin scrollbar-thumb-slate-300 bg-white scrollbar-track-slate-100`}>
                <div>
                    <HeaderTable gridCols={isTab == 1 ? 10 : 9} display={'grid'}>
                        <ColumnTable colSpan={1} textAlign={'center'}>
                            STT
                        </ColumnTable>
                        <ColumnTable colSpan={3} textAlign={'center'}>
                            {isTab == 1 || isTab == 2 ? "Tên nguyên vật liệu" : "Tên thành phẩm"}
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'center'}>
                            Đơn vị tính
                        </ColumnTable>
                        <ColumnTable colSpan={isTab == 1 ? 1 : 2} textAlign={'center'}>
                            {isTab == 1 && "Số lượng xuất" || (isTab == 2 || isTab == 3) && "Số lượng gia công"}
                        </ColumnTable>
                        <ColumnTable colSpan={isTab == 1 ? 1 : 2} textAlign={'center'}>
                            {isTab == 1 && "Số thu hồi" || isTab == 2 && "CP NVL xuất gia công" || isTab == 3 && "CP gia công"}
                        </ColumnTable>
                        {
                            isTab == 1 &&
                            <>
                                <ColumnTable colSpan={1} textAlign={'center'}>
                                    CP xuất NVL
                                </ColumnTable>
                                <ColumnTable colSpan={1} textAlign={'center'}>
                                    CP thu hồi
                                </ColumnTable>
                                <ColumnTable colSpan={1} textAlign={'center'}>
                                    Tổng tiền
                                </ColumnTable>
                            </>
                        }
                    </HeaderTable>
                    {isExportSituation.onFetching ? (
                        <Loading className="h-80" color="#0f4f9e" />
                    ) : isExportSituation.dataTable?.length > 0 ? (
                        <>
                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                {isExportSituation.dataTable?.map((e, index) => (
                                    <RowTable gridCols={isTab == 1 ? 10 : 9} key={e.id.toString()} >
                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                            {index + 1}
                                        </RowItemTable>
                                        <RowItemTable colSpan={3} textAlign={'left'} className={'flex items-center gap-2'}>
                                            <ModalImage
                                                small={e.image}
                                                large={e.image}
                                                width={36}
                                                height={36}
                                                alt={e.name}
                                                className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                            />
                                            <div className='flex flex-col'>
                                                <span>{e.name}</span>
                                                <div className='flex items-center gap-1 text-gray-500'>
                                                    <span>{e.code}</span>-<span>{e.itemVariation}</span>
                                                </div>
                                            </div>
                                        </RowItemTable>
                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                            {e.unit}
                                        </RowItemTable>
                                        <RowItemTable colSpan={isTab == 1 ? 1 : 2} textAlign={'right'}>
                                            {isTab == 1 ? e.quantityExport > 0 ? formatNumber(e.quantityExport) : '-' : e.machiningQuantity > 0 ? formatNumber(e.machiningQuantity) : '-'}
                                        </RowItemTable>
                                        <RowItemTable colSpan={isTab == 1 ? 1 : 2} textAlign={'right'}>
                                            {isTab == 1 ? e.quantityRecall > 0 ? formatNumber(e.quantityRecall) : '-' : e.processingCost > 0 ? formatNumber(e.processingCost) : '-'}
                                        </RowItemTable>
                                        {
                                            isTab == 1 &&
                                            <>
                                                <RowItemTable colSpan={1} textAlign={'right'}>
                                                    {e.exportCosts > 0 ? formatNumber(e.exportCosts) : '-'}
                                                </RowItemTable>
                                                <RowItemTable colSpan={1} textAlign={'right'}>
                                                    {e.recoveryCosts > 0 ? formatNumber(e.recoveryCosts) : '-'}
                                                </RowItemTable>
                                                <RowItemTable colSpan={1} textAlign={'right'}>
                                                    {e.moneyTone > 0 ? formatNumber(e.moneyTone) : '-'}
                                                </RowItemTable>
                                            </>
                                        }
                                    </RowTable>
                                ))}
                            </div>
                        </>
                    ) : <NoData />}

                </div>
            </div>
            <ContainerTotal className={`${isTab == 1 ? "!grid-cols-10" : "!grid-cols-9"}`}>
                <ColumnTable colSpan={5} textAlign={'center'} className="p-2">
                    {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                </ColumnTable>
                {
                    isTab == 1 &&
                    <>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                            0
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                            0
                        </ColumnTable>
                        <ColumnTable colSpan={1} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                            0
                        </ColumnTable>
                    </>
                }
                <ColumnTable colSpan={isTab == 1 ? 1 : 2} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                    0
                </ColumnTable>
                <ColumnTable colSpan={isTab == 1 ? 1 : 2} textAlign={'right'} className="justify-end p-2 flex gap-2 flex-wrap  mr-1">
                    0
                </ColumnTable>
            </ContainerTotal>
            {isExportSituation.dataTable?.length != 0 && (
                <ContainerPagination>
                    <TitlePagination
                        dataLang={dataLang}
                        totalItems={10}
                    // totalItems={totalItems?.iTotalDisplayRecords}
                    />
                    <Pagination
                        postsPerPage={limit}
                        totalPosts={100}
                        // totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                        paginate={paginate}
                        currentPage={router.query?.page || 1}
                    />
                </ContainerPagination>
            )}
        </div>
    )
})


export default TabProcessingCost