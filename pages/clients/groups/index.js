import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";

import {
    Edit as IconEdit,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Grid6 as IconExcel,
    Grid6,
} from "iconsax-react";
import "react-phone-input-2/lib/style.css";
import { components } from "react-select";
import Popup_groupKh from "./components/popup";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import BtnAction from "@/components/UI/BtnAction";

const Index = (props) => {
    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const dataLang = props.dataLang;

    const isShow = useToast();

    const initilaState = {
        data: [],
        data_ex: [],
        keySearch: "",
        onFetching: false,
        onFetchingBranch: false,
        idBranch: [],
        listBr: [],
    }
    const [isState, sIsState] = useState(initilaState)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }))

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkExport, checkEdit, checkAdd } = useActionRole(auth, 'client_group');

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems()

    const _ServerFetching = () => {
        Axios("GET", `/api_web/Api_client/group?csrf_protection=true`,
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
                    queryState({ data: rResult, data_ex: rResult, onFetching: false });
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
    }

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        isState.onFetchingBranch && _ServerFetching_brand()
    }, [isState.onFetchingBranch]);

    useEffect(() => {
        queryState({ onFetching: true })
    }, [limit, router.query?.page, isState.idBranch]);

    useEffect(() => {
        queryState({ onFetchingBranch: true })
    }, [limit, router.query?.page]);

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/clients/groups",
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace("/clients/groups");
        queryState({ onFetching: true });
    }, 500
    )
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
                    title: `${dataLang?.client_group_name}`,
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
                {
                    value: `${e.branch ? e.branch?.map((i) => i.name).join(", ") : ""}`,
                },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_groupuser_title}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.client_group_client}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_groupuser_title}</h6>
                    </div>
                )}
                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E]">{dataLang?.client_groupuser}</h2>
                                <div className="flex justify-end items-center">

                                    {role == true || checkAdd ?
                                        <Popup_groupKh
                                            listBr={isState.listBr}
                                            onRefresh={_ServerFetching.bind(this)}
                                            dataLang={dataLang}
                                            className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                        /> :
                                        <button
                                            type="button"
                                            onClick={() => {
                                                isShow("warning", WARNING_STATUS_ROLE);
                                            }}
                                            className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                        >{dataLang?.branch_popup_create_new}
                                        </button>
                                    }
                                </div>
                            </div>

                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full r rounded-lg grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                                        <div className="col-span-4">
                                            <div className="grid grid-cols-5">
                                                <SearchComponent
                                                    dataLang={dataLang}
                                                    onChange={_HandleOnChangeKeySearch.bind(this)}
                                                    colSpan={1}
                                                />
                                                <SelectComponent
                                                    options={isState.listBr}
                                                    onChange={(e) => queryState({ idBranch: e })}
                                                    value={isState.idBranch}
                                                    placeholder={dataLang?.client_list_filterbrand}
                                                    colSpan={2}
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
                                                                filename="Nhóm khách hàng"
                                                                title="Nkh"
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
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[500px] 2xl:h-[90%] xl:h-[69%] h-[100%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="xl:w-[100%] w-[110%] pr-2 ">
                                        <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  w-[50%] text-left">
                                                {dataLang?.client_group_name}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  w-[15%] text-center">
                                                {dataLang?.client_group_colorcode}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  w-[15%] text-center">
                                                {dataLang?.client_group_color}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  w-[15%] text-center">
                                                {dataLang?.client_list_brand}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  w-[20%] text-center">
                                                {dataLang?.branch_popup_properties}
                                            </h4>
                                        </div>
                                        {isState.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : isState.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                                    {isState.data?.map((e) => (
                                                        <div
                                                            className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3 w-[50%] text-left">
                                                                {e.name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3 w-[15%] text-center rounded-md ">
                                                                {e.color}
                                                            </h6>
                                                            <h6
                                                                style={{
                                                                    backgroundColor: e.color,
                                                                }}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3 w-[15%]  rounded-md "
                                                            ></h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 py-3 w-[15%]  rounded-md  ">
                                                                <span className="flex flex-wrap justify-start gap-2 ">
                                                                    {e?.branch?.map((e) => (
                                                                        <span className="mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg">
                                                                            {e.name}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </h6>

                                                            <div className="space-x-2 w-[20%] text-center flex items-center justify-center">
                                                                <Popup_groupKh
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    listBr={isState.listBr}
                                                                    sValueBr={e.branch}
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    color={e.color}
                                                                    id={e.id}
                                                                />
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={() => { }}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type="client_group"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className=" max-w-[352px] mt-24 mx-auto">
                                                <div className="text-center">
                                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                        <IconSearch />
                                                    </div>
                                                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                        Không tìm thấy các mục
                                                    </h1>
                                                    <div className="flex items-center justify-around mt-6 ">
                                                        <Popup_groupKh
                                                            onRefresh={_ServerFetching.bind(this)}
                                                            dataLang={dataLang}
                                                            className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isState.data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
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
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
};

export default Index;
