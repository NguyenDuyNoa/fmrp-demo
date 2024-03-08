import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { _ServerInstance as Axios } from "/services/axios";
import ReactExport from "react-data-export";

import Swal from "sweetalert2";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    LocationTick,
    User,
    Refresh2,
} from "iconsax-react";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import moment from "moment/moment";
import Select, { components } from "react-select";
import { useSelector } from "react-redux";
import SearchComponent from "components/UI/filterComponents/searchComponent";
import SelectComponent from "components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "components/UI/filterComponents/excelFilecomponet";
import DropdowLimit from "components/UI/dropdowLimit/dropdowLimit";
import useStatusExprired from "@/hooks/useStatusExprired";
import { debounce } from "lodash";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems()

    const initilalState = {
        keySearch: "",
        onFetching: false,
        onFetchingBranch: false,
        onFetchingUser: false,
        data: {},
        data_ex: [],
        idBranch: null,
        idClient: null,
        listClient: [],
        listBr: []
    }

    const [isState, sIsState] = useState(initilalState)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }))

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_client/contact/?csrf_protection=true",
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
                    "filter[client_id]": isState.idClient?.length > 0 ? isState.idClient.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    queryState({ data_ex: rResult, data: rResult, onFetching: false });
                    updateTotalItems(output);
                }
                queryState({ onFetching: false });
            }
        );
    };

    const _ServerFetching_brand = () => {
        Axios(
            "GET",
            `/api_web/Api_Branch/branch/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    queryState({ listBr: rResult?.map((e) => ({ label: e.name, value: e.id })) })
                }
                queryState({ onFetchingBranch: false });
            }
        );
    };

    const _ServerFetching_client = () => {
        Axios(
            "GET",
            `/api_web/api_client/client_option/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    queryState({ listClient: rResult?.map((e) => ({ label: e.name, value: e.id })) });
                }
                queryState({ onFetchingUser: false });
            }
        );
    };


    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                // tab: router.query?.page,
            },
        });
        queryState({ onFetching: true })
    }, 500);

    useEffect(() => {
        (isState.onFetching && _ServerFetching()) ||
            (isState.onFetching && _ServerFetching_brand()) ||
            (isState.onFetching && _ServerFetching_client());
    }, [isState.onFetching]);
    useEffect(() => {

        queryState({ onFetching: true })
    }, [limit, router.query?.page, isState.idBranch, isState.idClient]);
    //excel
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
                    title: `${dataLang?.client_contact_table_fulname}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_contact_table_name}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_contact_table_phone}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_contact_table_mail}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_contact_table_pos}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_contact_table_hapy}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_contact_table_address}`,
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
                { value: `${e.client_contact_id}`, style: { numFmt: "0" } },
                { value: `${e.client_name ? e.client_name : ""}` },
                { value: `${e.contact_name ? e.contact_name : ""}` },
                { value: `${e.phone_number ? e.phone_number : ""}` },
                { value: `${e.position ? e.position : ""}` },
                { value: `${e.email ? e.email : ""}` },
                {
                    value: `${e.birthday ? (e.birthday != "0000-00-00" ? moment(e.birthday).format("DD-MM-YYYY") : "") : ""
                        }`,
                },
                { value: `${e.address ? e.address : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];
    const _HandleFresh = () => {
        queryState({ onFetching: true });
    };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_contact_title}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.client_contact_title}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_contact_title}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.client_contact_title}</h2>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-lg grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                                        <div className="col-span-4">
                                            <div className="grid grid-cols-5 gap-2">
                                                <SearchComponent
                                                    dataLang={dataLang}
                                                    onChange={_HandleOnChangeKeySearch.bind(this)}
                                                    colSpan={1}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Chọn chi nhánh",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listBr,
                                                    ]}
                                                    onChange={(e) => queryState({ idBranch: e })}
                                                    value={isState.idBranch}
                                                    placeholder={dataLang?.client_list_filterbrand}
                                                    colSpan={isState.idBranch?.length > 1 ? 2 : 1}
                                                    components={{ MultiValue }}
                                                    closeMenuOnSelect={false}
                                                    isMulti={true}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Chọn khách hàng",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listClient,
                                                    ]}
                                                    onChange={(e) => queryState({ idClient: e })}
                                                    value={isState.idClient}
                                                    placeholder="Chọn Khách hàng"
                                                    colSpan={isState.idClient?.length > 1 ? 2 : 1}
                                                    components={{ MultiValue }}
                                                    closeMenuOnSelect={false}
                                                    isMulti={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex space-x-2 items-center justify-end">
                                                <button
                                                    onClick={_HandleFresh.bind(this)}
                                                    type="button"
                                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out"
                                                >
                                                    <Refresh2
                                                        className="group-hover:-rotate-45 transition-all ease-in-out"
                                                        size="22"
                                                        color="green"
                                                    />
                                                </button>
                                                {isState.data_ex?.length > 0 && (
                                                    <ExcelFileComponent
                                                        multiDataSet={multiDataSet}
                                                        filename="Danh sách liên hệ"
                                                        title="Dslh"
                                                        dataLang={dataLang}
                                                    />
                                                )}
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[500px] 2xl:h-[90%] xl:h-[69%] h-[100%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[110%] ">
                                        <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_fulname}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[20%]  text-center">
                                                {dataLang?.client_contact_table_name}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_phone}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_mail}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_pos}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_hapy}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_address}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] w-[15%]  text-center">
                                                {dataLang?.client_contact_table_brand}
                                            </h4>
                                        </div>
                                        {isState.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : isState.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                    {isState.data?.map((e) => (
                                                        <div
                                                            className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.client_contact_id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-left">
                                                                {e.client_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[20%]  rounded-md text-left">
                                                                {e.contact_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-center">
                                                                {e.phone_number}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-left ">
                                                                {e.email}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-left">
                                                                {e.position}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-center">
                                                                {e.birthday != "0000-00-00"
                                                                    ? moment(e.birthday).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-left">
                                                                {e.address}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5 w-[15%]  rounded-md text-left">
                                                                <span className="flex flex-wrap justify-start ">
                                                                    {e?.branch?.map((e) => (
                                                                        <span className="mr-2 mb-1 w-fit xl:text-base text-xs px-2 text-[#0F4F9E] font-[300] py-0.5 border border-[#0F4F9E] rounded-lg">
                                                                            {e.name}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </h6>
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
const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;

    return (
        <div style={style} title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 3;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default Index;
