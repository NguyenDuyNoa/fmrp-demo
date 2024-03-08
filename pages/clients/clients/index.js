import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { _ServerInstance as Axios } from "/services/axios";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Grid6,
} from "iconsax-react";
import { Tooltip } from "react-tippy";

import Popup_dskh from "./components/popup/popupAdd";
import Popup_chitiet from "./components/popup/popupDetail";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import Pagination from "@/components/UI/pagination";
import ImageErrors from "@/components/UI/imageErrors";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";

import useToast from "@/hooks/useToast";
import useStatusExprired from "@/hooks/useStatusExprired";

import { debounce } from "lodash";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import useActionRole from "@/hooks/useRole";
import { useSelector } from "react-redux";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";

const Index = (props) => {
    const isShow = useToast();

    const dataLang = props.dataLang;

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'client_customers');

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems } = useLimitAndTotalItems()

    const initalState = {
        tabPage: router.query?.tab,
        keySearch: "",
        onFetching: false,
        onFetchingBranch: false,
        data: {},
        data_ex: [],
        listDs: [],
        listSelectCt: [],
        listBr: [],
        idBranch: null,
        onFetchingGroup: false,
        onFetchingSelectCt: false
    }
    const [isState, setIsState] = useState(initalState)

    const queryState = (key) => setIsState((prev) => ({ ...prev, ...key }))

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : 0 },
        });
        queryState({ onFetchingBranch: true, onFetchingSelectCt: true });
    }, []);

    const _ServerFetching = () => {
        const id = Number(router.query?.tab);
        Axios("GET", `/api_web/${router.query?.tab === "0" || router.query?.tab === "-1" ? "api_client/client?csrf_protection=true" : "api_client/client/?csrf_protection=true"}`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[client_group_id]": router.query?.tab !== "0" ? (router.query?.tab !== "-1" ? id : -1) : null,
                    "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    updateTotalItems(output);
                    queryState({ data: rResult, data_ex: rResult })
                }
                queryState({ onFetching: false })
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
                    const { rResult, output } = response.data;
                    queryState({ listBr: rResult?.map((e) => ({ label: e.name, value: e.id })) })
                }
                queryState({ onFetchingBranch: false })
            }
        );
    };


    const _ServerFetching_group = () => {
        Axios("GET", `/api_web/api_client/group_count/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: isState.keySearch,
                    "filter[branch_id]": isState.idBranch?.length > 0 ? isState.idBranch.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    queryState({ listDs: rResult })
                }
                queryState({ onFetchingGroup: false })
            }
        );
    };

    const _ServerFetching_selectct = () => {
        Axios("GET", `/api_web/Api_address/province?limit=0`,
            {
                limit: 0,
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    queryState({ listSelectCt: rResult })
                }
                queryState({ onFetchingSelectCt: false })
            }
        );
    };

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value })
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true })
    }, 500)

    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        (isState.onFetchingBranch && _ServerFetching_brand());
    }, [isState.onFetchingBranch]);

    useEffect(() => {
        (isState.onFetchingGroup && _ServerFetching_group())
    }, [isState.onFetchingGroup]);

    useEffect(() => {
        (isState.onFetchingSelectCt && _ServerFetching_selectct())
    }, [isState.onFetchingSelectCt]);

    useEffect(() => {
        queryState({ onFetching: true, onFetchingGroup: true })
    }, [limit, router.query?.page, router.query?.tab, isState.idBranch]);

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
                    title: `${dataLang?.client_list_namecode}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_name}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_repre}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_taxtcode}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },

                {
                    title: `${dataLang?.client_list_phone}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_adress}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_charge}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_group}`,
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
                {
                    title: `${dataLang?.client_list_datecre}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.data_ex?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.name ? e.name : ""}` },
                { value: `${e.representative ? e.representative : ""}` },
                { value: `${e.tax_code ? e.tax_code : ""}` },
                { value: `${e.phone_number ? e.phone_number : ""}` },
                { value: `${e.address ? e.address : ""}` },
                {
                    value: `${e.staff_charge ? e.staff_charge?.map((i) => i.full_name) : ""}`,
                },
                {
                    value: `${e.client_group ? e.client_group?.map((i) => i.name) : ""}`,
                },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
                { value: `${e.date_create ? e.date_create : ""}` },
            ]),
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_list_title}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.client_list_title}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_list_title}</h6>
                    </div>
                )}
                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.client_list_title}</h2>
                                <div className="flex justify-end items-center gap-2">
                                    {role == true || checkAdd ?
                                        <Popup_dskh
                                            listBr={isState.listBr}
                                            listSelectCt={isState.listSelectCt}
                                            onRefresh={_ServerFetching.bind(this)}
                                            dataLang={dataLang}
                                            nameModel={"client_contact"}
                                            className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                        /> :
                                        <button
                                            type="button"
                                            onClick={() => {
                                                isShow("warning", WARNING_STATUS_ROLE);
                                            }}
                                            className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                        >{dataLang?.branch_popup_create_new}
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="flex space-x-3 items-center  3xl:h-[8vh] 2xl:h-[9vh] xl:h-[9vh] lg:h-[9vh] md:h-[10vh] h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {isState.listDs &&
                                    isState.listDs.map((e) => {
                                        return (
                                            <div>
                                                <TabFilter
                                                    style={{
                                                        backgroundColor: e.color,
                                                    }}
                                                    key={e.id}
                                                    onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                    total={e.count}
                                                    active={e.id}
                                                    className={`${e.color ? "text-white" : "text-[#0F4F9E] bg-[#e2f0fe] "
                                                        }`}
                                                >
                                                    {e.name}
                                                </TabFilter>
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-lg grid grid-cols-6 justify-between xl:p-3 p-2">
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
                                                                filename="Danh sách khách hàng"
                                                                title="Dskh"
                                                                dataLang={dataLang}
                                                            />)}
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
                                <div className="min:h-[500px] 2xl:h-[80%] xl:h-[69%] h-[72%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2">
                                        <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[12%] font-[600] text-center">
                                                {dataLang?.client_list_namecode}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[15%] font-[600] text-center">
                                                {dataLang?.client_list_name}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[10%] font-[600] text-center">
                                                {dataLang?.client_list_taxtcode}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[10%] font-[600] text-center">
                                                {dataLang?.client_list_phone}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[15%] font-[600] text-center">
                                                {dataLang?.client_list_adress}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[18%] font-[600] text-center">
                                                {dataLang?.client_list_charge}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[15%] font-[600] text-center">
                                                {dataLang?.client_list_group}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[10%] font-[600] text-center">
                                                {dataLang?.client_list_brand}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase w-[10%] font-[600] text-center">
                                                {dataLang?.branch_popup_properties}
                                            </h4>
                                        </div>
                                        {isState.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : isState.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {isState.data?.map((e) => (
                                                        <div
                                                            className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[12%]  rounded-md text-center">
                                                                {e.code}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 py-0.5 w-[15%]  rounded-md text-left text-[#0F4F9E] hover:text-blue-600 transition-all ease-linear">
                                                                <Popup_chitiet
                                                                    dataLang={dataLang}
                                                                    className="text-left"
                                                                    name={e.name}
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[10%]  rounded-md text-left">
                                                                {e.tax_code}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[10%]  rounded-md text-center">
                                                                {e.phone_number}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[15%]  rounded-md text-left">
                                                                {e.address}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[18%]   rounded-md text-left flex object-cover  justify-start items-center flex-wrap gap-2">
                                                                {e?.staff_charge
                                                                    ? e.staff_charge?.map((d) => {
                                                                        return (
                                                                            <>
                                                                                <Tooltip
                                                                                    title={d.full_name}
                                                                                    arrow
                                                                                    theme="dark"
                                                                                >
                                                                                    <ImageErrors
                                                                                        src={d.profile_image}
                                                                                        width={40}
                                                                                        height={40}
                                                                                        defaultSrc="/user-placeholder.jpg"
                                                                                        alt="Image"
                                                                                        className="object-cover rounded-[100%] text-left cursor-pointer"
                                                                                    />
                                                                                </Tooltip>
                                                                            </>
                                                                        );
                                                                    })
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-0.5 w-[15%]  rounded-md text-left flex justify-start flex-wrap ">
                                                                {e.client_group?.map((h) => {
                                                                    return (
                                                                        <span
                                                                            key={h.id}
                                                                            style={{
                                                                                backgroundColor: `${h.color == "" || h.color == null
                                                                                    ? "#e2f0fe"
                                                                                    : h.color
                                                                                    }`,
                                                                                color: `${h.color == "" || h.color == null
                                                                                    ? "#0F4F9E"
                                                                                    : "white"
                                                                                    }`,
                                                                            }}
                                                                            className={`  mr-2 mb-1 w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] px-2 rounded-md font-[300] py-0.5`}
                                                                        >
                                                                            {h.name}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </h6>
                                                            <h6 className="w-[10%] flex  gap-1 flex-wrap">
                                                                {e.branch?.map((i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="cursor-default w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2"
                                                                    >
                                                                        {i.name}
                                                                    </span>
                                                                ))}
                                                            </h6>
                                                            <div className="space-x-2 w-[10%] text-center flex items-center justify-center">
                                                                {role == true || checkEdit ?
                                                                    <Popup_dskh
                                                                        listBr={isState.listBr}
                                                                        listSelectCt={isState.listSelectCt}
                                                                        onRefresh={_ServerFetching.bind(this)}
                                                                        className="xl:text-base text-xs "
                                                                        listDs={isState.listDs}
                                                                        dataLang={dataLang}
                                                                        name={e.name}
                                                                        representative={e.representative}
                                                                        code={e.code}
                                                                        tax_code={e.tax_code}
                                                                        phone_number={e.phone_number}
                                                                        address={e.address}
                                                                        date_incorporation={e.date_incorporation}
                                                                        note={e.note}
                                                                        email={e.email}
                                                                        website={e.website}
                                                                        debt_limit={e.debt_limit}
                                                                        debt_limit_day={e.debt_limit_day}
                                                                        debt_begin={e.debt_begin}
                                                                        city={e.city}
                                                                        district={e.district}
                                                                        ward={e.ward}
                                                                        id={e?.id}
                                                                        nameModel={"client_contact"}
                                                                    />
                                                                    :
                                                                    <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                                                                }
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type="client_customers"
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
                                                        {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
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
