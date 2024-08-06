// lich su nhap kho tp
import OnResetData from '@/components/UI/btnResetData/btnReset';
import ContainerPagination from '@/components/UI/common/ContainerPagination/ContainerPagination';
import TitlePagination from '@/components/UI/common/ContainerPagination/TitlePagination';
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/Table';
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit';
import SearchComponent from '@/components/UI/filterComponents/searchComponent';
import Loading from '@/components/UI/loading/loading';
import NoData from '@/components/UI/noData/nodata';
import Pagination from "@/components/UI/pagination";
import { FORMAT_MOMENT } from '@/constants/formatDate/formatDate';
import useSetingServer from '@/hooks/useConfigNumber';
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems';
import { formatMoment } from '@/utils/helpers/formatMoment';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { Grid6 } from 'iconsax-react';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uddid } from 'uuid';
const TabWarehouseHistory = memo(({ isStateModal, width, dataLang, listTab }) => {
    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()

    const initialState = {
        onFetching: false,
        dataTable: [
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
            {
                id: uddid(),
                warehouse: 'Kho bán thành phẩm',
                locationWarehouse: 'LSXCT-12122306',
                quantity: 1000,
                date: new Date(),
                codeResent: 'PR-00000'
            },
        ]
    }

    const router = useRouter()

    const [isExportHistory, setIsExportHistory] = useState(initialState)

    const queryStateExportHistory = (key) => setIsExportHistory(x => ({ ...x, ...key }))

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    // const { checkAdd, checkExport } = useActionRole(auth, "")

    const dataSeting = useSetingServer();

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
        queryStateExportHistory({ onFetching: true })
        setTimeout(() => {
            queryStateExportHistory({ onFetching: false })
        }, 2000)
    }, [])

    return (
        <div className='h-full'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-1'>
                    <h1 className="3xl:text-basse text-sm my-1">{listTab[isStateModal.isTab - 1]?.name}</h1>
                </div>
                <div className="flex justify-end items-center gap-1">
                    <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={() => { }} classInput={'border'} />
                    <OnResetData sOnFetching={(e) => queryStateExportHistory({ onFetching: e })} />
                    <button onClick={() => { }} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                        <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
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
                    <HeaderTable gridCols={12} display={'grid'}>
                        <ColumnTable colSpan={1} textAlign={'center'}>
                            STT
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Ngày chứng từ
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Mã chứng từ
                        </ColumnTable>
                        <ColumnTable colSpan={3} textAlign={'center'}>
                            Kho hàng
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Vị trí kho
                        </ColumnTable>
                        <ColumnTable colSpan={2} textAlign={'center'}>
                            Số lượng
                        </ColumnTable>
                    </HeaderTable>
                    {isExportHistory.onFetching ? (
                        <Loading className="h-80" color="#0f4f9e" />
                    ) : isExportHistory.dataTable?.length > 0 ? (
                        <>
                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                {isExportHistory.dataTable?.map((e, index) => (
                                    <RowTable gridCols={12} key={e.id.toString()} >
                                        <RowItemTable colSpan={1} textAlign={'center'}>
                                            {index + 1}
                                        </RowItemTable>
                                        <RowItemTable colSpan={2} textAlign={'center'}>
                                            {formatMoment(e.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG)}
                                        </RowItemTable>
                                        <RowItemTable colSpan={2} textAlign={'center'}>
                                            {e.codeResent}
                                        </RowItemTable>
                                        <RowItemTable colSpan={3} textAlign={'center'}>
                                            {e.warehouse}
                                        </RowItemTable>
                                        <RowItemTable colSpan={2} textAlign={'center'}>
                                            {e.locationWarehouse}
                                        </RowItemTable>
                                        <RowItemTable colSpan={2} textAlign={'right'}>
                                            {e.quantity > 0 ? formatNumber(e.quantity) : '-'}
                                        </RowItemTable>
                                    </RowTable>
                                ))}
                            </div>
                        </>
                    ) : <NoData />}

                </div>
            </div>
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
        </div>
    )
})

export default TabWarehouseHistory