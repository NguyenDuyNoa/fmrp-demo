import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ListBtn_Setting } from "./information";
import { _ServerInstance as Axios } from "/services/axios";

import "react-phone-input-2/lib/style.css";

import useStatusExprired from "@/hooks/useStatusExprired";

import BtnAction from "@/components/UI/btnAction";
import ContainerPagination from "@/components/UI/common/containerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/containerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/customscrollbar";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/table";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import PopupBranch from "./components/popupBranch";
import apiBranch from "@/Api/apiSettings/apiBranch";
const Index = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const [data, sData] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems: sTotalItem } = useLimitAndTotalItems();

    const _ServerFetching = async () => {
        try {
            const { rResult, output } = await apiBranch.apiListBranch({
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                },
            })
            sData(rResult);
            sTotalItem(output);
            sOnFetching(false);
        } catch (error) {

        }
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true));
    }, [limit, router.query?.page]);

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace("/settings/branch");
        sOnFetching(true);
    }, 500);

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.branch_title}</title>
            </Head>
            <Container className="">
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.branch_seting || "branch_seting"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.branch_title || "branch_title"}</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <ContainerBody>
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.branch_title}
                                </h2>
                                <div className="flex justify-end items-center gap-2">
                                    <PopupBranch
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                        <SearchComponent
                                            dataLang={dataLang}
                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                        />
                                        <div>
                                            <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                        </div>
                                    </div>
                                </div>
                                <Customscrollbar className="min:h-[200px] h-[83%] max:h-[500px] overflow-auto pb-2">
                                    <div className="w-full">
                                        <HeaderTable gridCols={12}>
                                            <ColumnTable colSpan={4} textAlign={"left"}>
                                                {dataLang?.branch_popup_name}
                                            </ColumnTable>
                                            <ColumnTable colSpan={3} textAlign={"left"}>
                                                {dataLang?.branch_popup_address}
                                            </ColumnTable>
                                            <ColumnTable colSpan={3} textAlign={"left"}>
                                                {dataLang?.branch_popup_phone}
                                            </ColumnTable>
                                            <ColumnTable colSpan={2} textAlign={"center"}>
                                                {dataLang?.branch_popup_properties}
                                            </ColumnTable>
                                        </HeaderTable>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">
                                                    {data.map((e) => (
                                                        <RowTable gridCols={12} key={e.id.toString()}>
                                                            <RowItemTable colSpan={4} textAlign={"left"}>
                                                                {e.name}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={3} textAlign={"left"}>
                                                                {e.address}
                                                            </RowItemTable>
                                                            <RowItemTable colSpan={3} textAlign={"left"}>
                                                                {e.number_phone}
                                                            </RowItemTable>
                                                            <RowItemTable
                                                                colSpan={2}
                                                                className="flex justify-center items-center gap-2"
                                                            >
                                                                <PopupBranch
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs"
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    phone={e.number_phone}
                                                                    address={e.address}
                                                                    id={e.id}
                                                                />
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={() => { }}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type="settings_branch"
                                                                />
                                                            </RowItemTable>
                                                        </RowTable>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <NoData />
                                        )}
                                    </div>
                                </Customscrollbar>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <ContainerPagination>
                                <TitlePagination dataLang={dataLang} totalItems={totalItem?.iTotalDisplayRecords} />
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItem?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </ContainerPagination>
                        )}
                    </ContainerBody>
                </div>
            </Container>
        </React.Fragment>
    );
};



export default Index;
