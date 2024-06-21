// Tổng hợp công nợ phải thu
import OnResetData from '@/components/UI/btnResetData/btnReset';
import ContainerPagination from '@/components/UI/common/containerPagination/containerPagination';
import TitlePagination from '@/components/UI/common/containerPagination/titlePagination';
import { EmptyExprired } from '@/components/UI/common/emptyExprired';
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from '@/components/UI/common/table';
import { Container } from '@/components/UI/common/layout';
import DropdowLimit from '@/components/UI/dropdowLimit/dropdowLimit';
import SearchComponent from '@/components/UI/filterComponents/searchComponent';
import SelectComponent from '@/components/UI/filterComponents/selectComponent';
import Loading from '@/components/UI/loading';
import NoData from '@/components/UI/noData/nodata';
import Pagination from "@/components/UI/pagination";
import useSetingServer from '@/hooks/useConfigNumber';
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems';
import useStatusExprired from '@/hooks/useStatusExprired';
import formatNumberConfig from '@/utils/helpers/formatnumber';
import { Grid6 } from 'iconsax-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import TitleHeader from '../components/titleHeader';
import usePagination from '@/hooks/usePagination';

const Index = (props) => {
    const dataLang = props.dataLang

    const dataSeting = useSetingServer()

    const router = useRouter()

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    }

    const initialState = {
        total: {},
        data: [],
        onFetching: false
    }

    const [isState, setState] = useState(initialState)

    const queryState = (key) => setState((prev) => ({ ...prev, ...key }));
    return (
        <React.Fragment>
            <Head>
                <title>Tổng hợp công nợ phải thu</title>
            </Head>
            <Container className={'!pb-0'}>
                {statusExprired ? (
                    <EmptyExprired />
                ) : null}

                <div className='h-full'>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <TitleHeader title={'Công nợ phải thu'} />
                        <div className='grid grid-cols-10'>
                            <Navbar />
                            <div className='col-span-8'>
                                <div className="3xl:space-y-3 space-y-2 col-span-8">
                                    <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                        <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                            <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                                <div className="grid grid-cols-5 gap-2">
                                                    <SearchComponent colSpan={1} dataLang={dataLang} placeholder={dataLang?.branch_search} onChange={() => { }} />
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: 'Công đoạn',
                                                                isDisabled: true,
                                                            },
                                                        ]}
                                                        placeholder={'Công đoạn'}
                                                        isSearchable={true}
                                                        colSpan={1}
                                                    />
                                                    <SelectComponent
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: 'Khách hàng',
                                                                isDisabled: true,
                                                            },
                                                        ]}
                                                        placeholder={'Khách hàng'}
                                                        isSearchable={true}
                                                        colSpan={1}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                            <div className="flex justify-end gap-2 space-x-2 items-center">
                                                <OnResetData sOnFetching={() => { }} />
                                                <button onClick={() => { }} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                                <div>
                                                    <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="3xl:h-[620px] 2xl:max-h-[550px] 2xl:h-[550px] max-h-[550px] h-[550px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className={`2xl:w-[100%] pr-2`}>
                                        {/* header table */}
                                        <HeaderTable gridCols={10}>
                                            <ColumnTable colSpan={2} textAlign={'center'}>
                                                Mã khách hàng
                                            </ColumnTable>
                                            <ColumnTable colSpan={2} textAlign={'center'}>
                                                Tên khách hàng
                                            </ColumnTable>
                                            <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
                                                <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
                                                    Số dư đầu kỳ
                                                </ColumnTable>
                                                <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
                                                    Nợ
                                                </ColumnTable>
                                                <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
                                                    Có
                                                </ColumnTable>
                                            </ColumnTable>
                                            <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
                                                <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
                                                    Phát sinh
                                                </ColumnTable>
                                                <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
                                                    Nợ
                                                </ColumnTable>
                                                <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
                                                    Có
                                                </ColumnTable>
                                            </ColumnTable>
                                            <ColumnTable colSpan={2} className="grid grid-cols-4  items-center justify-center !px-0">
                                                <ColumnTable colSpan={4} textAlign={'center'} className="border-b py-0.5">
                                                    Số dư cuối kỳ
                                                </ColumnTable>
                                                <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 border-r">
                                                    Nợ
                                                </ColumnTable>
                                                <ColumnTable colSpan={2} textAlign={'center'} className="pt-1 py-0.5">
                                                    Có
                                                </ColumnTable>
                                            </ColumnTable>
                                        </HeaderTable>
                                        {/* data table */}
                                        {
                                            isState.isLoading ? (
                                                <Loading className="3xl:h-[620px] 2xl:max-h-[550px] 2xl:h-[550px] max-h-[550px] h-[550px]" color="#0f4f9e" />
                                            ) : isState?.data && isState?.data?.length > 0 ? (
                                                <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">
                                                    {isState.data?.map((e) => (
                                                        <RowTable gridCols={10} key={e.id.toString()} >
                                                            <RowItemTable colSpan={2} textAlign={'center'}>
                                                                {/* {e?.date != null ? moment(e?.date).format("DD/MM/YYYY") : ""} */}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={2} textAlign={'right'}>

                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>

                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>

                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>

                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>

                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>

                                                            </RowItemTable>
                                                            <RowItemTable colSpan={1} textAlign={'right'}>

                                                            </RowItemTable>
                                                        </RowTable>
                                                    ))}
                                                </div>
                                            ) : <NoData />
                                        }
                                    </div>
                                </div>
                                {isState?.data?.length != 0 &&
                                    <ContainerTotal className="!grid-cols-10">
                                        <ColumnTable colSpan={4} textAlign={'center'} className="p-2">
                                            {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
                                            {formatNumber(isState.total?.total_quantity)}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
                                            {formatNumber(isState.total?.total_quantity)}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
                                            {formatNumber(isState.total?.total_quantity)}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
                                            {formatNumber(isState.total?.total_quantity)}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
                                            {formatNumber(isState.total?.total_quantity)}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={'right'} className="p-2 mr-1">
                                            {formatNumber(isState.total?.total_quantity)}
                                        </ColumnTable>
                                    </ContainerTotal>
                                }
                            </div>
                        </div>
                    </div>
                    {isState?.data?.length != 0 && (
                        <ContainerPagination className={'justify-end'}>
                            <TitlePagination
                                dataLang={dataLang}
                                totalItems={isState?.total?.iTotalDisplayRecords}
                            />
                            <Pagination
                                postsPerPage={isState.limitItemWarehouseDetail}
                                totalPosts={Number(isState?.total?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                                className='3xl:text-base text-sm'
                            />
                        </ContainerPagination>
                    )}
                </div>
            </Container>
        </React.Fragment >
    )


}

export default Index