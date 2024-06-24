import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ListBtn_Setting } from "./information";



import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import useStatusExprired from "@/hooks/useStatusExprired";

import apiVariant from "@/Api/apiSettings/apiVariant";
import BtnAction from "@/components/UI/btnAction";
import ContainerPagination from "@/components/UI/common/ContainerPagination/containerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/titlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import usePagination from "@/hooks/usePagination";
import PopupVariant from "./components/popupVariant";

const Index = (props) => {
    const router = useRouter();

    const dataLang = props.dataLang;

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const [data, sData] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [keySearch, sKeySearch] = useState("");

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();

    const _ServerFetching = async () => {
        try {
            const { rResult, output } = await apiVariant.apiListVariant({
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                },
            })
            sData(rResult);
            sTotalItems(output);
        } catch (error) {

        }
        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) || (keySearch && sOnFetching(true));
    }, [limit, router.query?.page]);

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace("/settings/variant");
        sOnFetching(true);
    }, 500);
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.list_btn_seting_variant}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.branch_seting || "branch_seting"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.list_btn_seting_variant || "list_btn_seting_variant"}</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%]">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <ContainerBody>
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex items-center justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.variant_title ? dataLang?.variant_title : "variant_title"}
                                </h2>
                                <div className="flex justify-end items-center gap-2">
                                    <PopupVariant
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded flex items-center justify-between xl:p-3 p-2">
                                    <SearchComponent
                                        dataLang={dataLang}
                                        onChange={_HandleOnChangeKeySearch.bind(this)}
                                    />
                                    <div className="">
                                        <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar className="min:h-[200px] h-[72%] max:h-[500px]">
                                <div className="w-full">
                                    <HeaderTable gridCols={10}>
                                        <ColumnTable colSpan={3} textAlign={"left"}>
                                            {dataLang?.variant_name}
                                        </ColumnTable>
                                        <ColumnTable colSpan={5} textAlign={"left"}>
                                            {dataLang?.branch_popup_variant_option}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : (
                                        <React.Fragment>
                                            {data.length == 0 && <NoData />}
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                {data.map((e) => (
                                                    <RowTable key={e.id.toString()} gridCols={10}>
                                                        <RowItemTable colSpan={3}>{e?.name}</RowItemTable>
                                                        <RowItemTable colSpan={5} className="gap-1 flex flex-wrap">
                                                            {e?.option?.map((e) => (
                                                                <TagBranch
                                                                    key={e.id.toString()}
                                                                    className="w-fit"
                                                                // className="mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg"
                                                                >
                                                                    {e.name}
                                                                </TagBranch>
                                                            ))}
                                                        </RowItemTable>
                                                        <RowItemTable
                                                            colSpan={2}
                                                            className="space-x-2 flex justify-center items-start"
                                                        >
                                                            <PopupVariant
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                name={e.name}
                                                                option={e.option}
                                                                id={e.id}
                                                                className="xl:text-base text-xs"
                                                                dataLang={dataLang}
                                                            />
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={() => { }}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type={"settings_variant"}
                                                            />
                                                        </RowItemTable>
                                                    </RowTable>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </Customscrollbar>
                        </div>
                        {data?.length != 0 && (
                            <ContainerPagination>
                                <TitlePagination dataLang={dataLang} totalItems={totalItems?.iTotalDisplayRecords} />
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
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
