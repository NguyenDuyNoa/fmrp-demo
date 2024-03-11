import React, { useEffect, useState } from "react";
import Head from "next/head";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { _ServerInstance as Axios } from "/services/axios";
import {
    Edit as IconEdit,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Grid6 as IconExcel,
    Grid6,
} from "iconsax-react";
import "react-phone-input-2/lib/style.css";

import Loading from "@/components/UI/loading";
import Popup_status from "./components/popup";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";

import useToast from "@/hooks/useToast";
import useActionRole from "@/hooks/useRole";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import NoData from "@/components/UI/noData/nodata";

const Index = (props) => {
    const isShow = useToast();

    const router = useRouter();

    const dataLang = props.dataLang;

    const trangthaiExprired = useStatusExprired();

    const initilaState = {
        data: [],
        listBr: [],
        data_ex: [],
        idBranch: [],
        keySearch: "",
        onFetching: false,
        onFetchingBranch: false,
    }

    const [isState, sIsState] = useState(initilaState)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }))

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkExport, checkEdit, checkAdd } = useActionRole(auth, 'client_status');

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems()


    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_client/status?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    updateTotalItems(output);
                    queryState({ data: rResult || [], data_ex: rResult || [], onFetching: false });
                }
            }
        );
    };

    const _ServerFetching_brand = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    queryState({ listBr: rResult?.map((e) => ({ label: e.name, value: e.id })) || [], onFetchingBranch: false });
                }
            }
        );
    };

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        (isState.onFetchingBranch && _ServerFetching_brand());
    }, [isState.onFetchingBranch]);

    useEffect(() => {
        queryState({ onFetching: true });
    }, [limit, router.query?.page, isState.idBranch]);

    useEffect(() => {
        queryState({ onFetchingBranch: true });
    }, [router.query?.page]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/clients/statusClient",
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace("/clients/statusClient");
        queryState({ onFetching: true });
    }, 500)

    const multiDataSet = [
        {
            columns: [
                {
                    title: "ID",
                    width: { wch: 4 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_group_statusclient}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_group_colorcode}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_brand}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.data_ex?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.color ? e.color : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_group_statusclient}</title>
            </Head>

            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.client_group_client || "client_group_client"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_group_statusclient || "client_group_statusclient"}</h6>
                    </div>

                )}
                <ContainerBody>
                    <div className="space-y-3 h-full overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.client_group_statusctitle}
                            </h2>
                            <div className="flex justify-end items-center">
                                {role == true || checkAdd ?
                                    <Popup_status
                                        listBr={isState.listBr}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    /> :
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >{dataLang?.branch_popup_create_new}
                                    </button>
                                }
                            </div>
                        </div>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-9">
                                            <SearchComponent
                                                dataLang={dataLang}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                colSpan={2}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.price_quote_branch || "price_quote_branch",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listBr,
                                                ]}
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {(role == true || checkExport) ?
                                                <div className={``}>
                                                    {isState.data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Trạng thái khách hàng"
                                                            title="Ttkh"
                                                            dataLang={dataLang}
                                                        />
                                                    )}
                                                </div>
                                                :
                                                <button onClick={() => isShow('warning', WARNING_STATUS_ROLE)} className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            }
                                            <div>
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="min:h-[200px] 3xl:h-[82%] 2xl:h-[85%] xl:h-[82%] lg:h-[88%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <div className="w-[100%] lg:w-[100%] ">
                                    <div className="grid grid-cols-12 items-center sticky top-0  rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-4 text-center">
                                            {dataLang?.client_group_statusclient}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.client_group_colorcode}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.client_group_color}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.client_list_brand}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.branch_popup_properties}
                                        </h4>
                                    </div>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                {isState.data?.map((e) => (
                                                    <div
                                                        className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40"
                                                        key={e.id.toString()}
                                                    >
                                                        <h6 className="col-span-4 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            {e.name}
                                                        </h6>
                                                        <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-center">
                                                            {e.color}
                                                        </h6>
                                                        <h6
                                                            style={{
                                                                backgroundColor: e.color,
                                                            }}
                                                            className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 h-full rounded-md text-center"
                                                        ></h6>
                                                        <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            <span className="flex flex-wrap justify-start gap-2">
                                                                {e?.branch?.map((e) => (
                                                                    <span className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                        {e.name}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        </h6>
                                                        <div className="col-span-2 space-x-2 text-center flex items-center justify-center">
                                                            {role == true || checkEdit ?
                                                                <Popup_status
                                                                    listBr={isState.listBr}
                                                                    sValueBr={e.branch}
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    color={e.color}
                                                                    id={e.id}
                                                                /> :
                                                                <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                                                            }
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={() => { }}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="client_status"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </div>
                            </div>
                        </ContainerTable>
                    </div>
                    {isState.data?.length != 0 && (
                        <div className="flex space-x-5 items-center my-2 3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] lg:text-[14px]">
                            <h6>
                                {dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.ingredient}
                                {/* {dataLang?.among}{" "}
                                    {totalItem?.iTotalRecords} {dataLang?.ingredient} */}
                            </h6>
                            <Pagination
                                postsPerPage={limit}
                                totalPosts={Number(totalItem?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                            />
                        </div>
                    )}
                </ContainerBody>
            </Container>
        </React.Fragment>
    );
};

export default Index;
