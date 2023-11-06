import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";
import { _ServerInstance as Axios } from "/services/axios";
import React, { useState, useEffect, useTransition } from "react";
import { SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import ImageErrors from "@/components/UI/imageErrors";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { routerInternalPlan } from "@/components/UI/router/internalPlan";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import DatepickerComponent from "@/components/UI/filterComponents/dateTodateComponent";
const PopupDetail = dynamic(() => import("./(popupDetail)/PopupDetail"), { ssr: false });
const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const initsArr = { data: [], dataExcel: [], listBr: [] };
    const initsId = {
        idBranch: null,
        valueDate: { startDate: null, endDate: null },
    };
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const [listData, sListData] = useState(initsArr);
    const [idFillter, sIdFillter] = useState(initsId);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);
    const [limit, sLimit] = useState(15);
    const [total, sTotal] = useState({});
    const [keySearch, sKeySearch] = useState("");
    const [totalItems, sTotalItems] = useState([]);
    const [isEvent, startEvent] = useTransition();

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
    }, []);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_internal_plan/getInternalPlan?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    branch_id: idFillter.idBranch != null ? idFillter.idBranch.value : null,
                    start_date:
                        idFillter?.valueDate?.startDate != null
                            ? moment(idFillter?.valueDate?.startDate).format("DD/MM/YYYY")
                            : null,
                    end_date:
                        idFillter?.valueDate?.endDate != null
                            ? moment(idFillter?.valueDate?.endDate).format("DD/MM/YYYY")
                            : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data?.data;
                    sListData((e) => ({
                        ...e,
                        data: rResult,
                        dataExcel: rResult,
                    }));
                    sTotalItems(output);
                    sTotal(rTotal);
                    sOnFetching(false);
                }
            }
        );
    };

    // filter
    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sListData((e) => ({ ...e, listBr: rResult.map((e) => ({ label: e.name, value: e.id })) }));
            }
        });
        sOnFetching_filter(false);
    };

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true);
        sOnFetching_filter(true);
    }, []);

    useEffect(() => {
        if (
            idFillter.idBranch != null ||
            (idFillter.valueDate.startDate != null && idFillter.valueDate.endDate != null)
        ) {
            setTimeout(() => {
                (idFillter.idBranch != null && sOnFetching(true)) ||
                    (idFillter.valueDate.startDate != null &&
                        idFillter.valueDate.endDate != null &&
                        sOnFetching(true)) ||
                    (keySearch && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [limit, idFillter.idBranch, idFillter.valueDate.endDate, idFillter.valueDate.startDate]);

    const onChangeFilter = (type) => (event) => sIdFillter((e) => ({ ...e, [type]: event }));

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const handleOnChangeKeySearch = ({ target: { value } }) => {
        startEvent(() => {
            sKeySearch(value);
            router.replace({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            sOnFetching(true);
        });
    };

    // excel
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
                    title: `${dataLang?.import_day_vouchers || "import_day_vouchers"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_code_vouchers || "import_code_vouchers"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.internal_plan_name || "internal_plan_name"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.internal_plan_status || "internal_plan_status"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.internal_plan_creators || "internal_plan_creators"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_from_note || "import_from_note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_branch || "import_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: listData?.dataExcel?.map((e, index) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                { value: `${e?.plan_name ? e?.plan_name : ""}` },
                { value: `${index % 2 == 0 ? "Chưa lập KHNVL" : "Đã lập KHNVL"}` },
                { value: `${e?.created_by_full_name ? e?.created_by_full_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
                { value: `${e?.name_branch ? e?.name_branch : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.internal_plan || "internal_plan"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.internal_planEnd || "internal_planEnd"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.internal_plan || "internal_plan"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.internal_plan || "internal_plan"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href={routerInternalPlan.form}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E]  via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.btn_new || "btn_new"}
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-lg grid grid-cols-7 justify-between xl:p-3 p-2">
                                        <div className="col-span-6">
                                            <div className="grid grid-cols-5 gap-2">
                                                <SearchComponent
                                                    dataLang={dataLang}
                                                    colSpan={1}
                                                    onChange={handleOnChangeKeySearch.bind(this)}
                                                />
                                                <SelectComponent
                                                    colSpan={1}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.price_quote_branch || "price_quote_branch",
                                                            isDisabled: true,
                                                        },
                                                        ...listData.listBr,
                                                    ]}
                                                    onChange={onChangeFilter("idBranch")}
                                                    value={idFillter.idBranch}
                                                    placeholder={
                                                        dataLang?.price_quote_select_branch ||
                                                        "price_quote_select_branch"
                                                    }
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    closeMenuOnSelect={true}
                                                />
                                                <DatepickerComponent
                                                    value={idFillter.valueDate}
                                                    onChange={onChangeFilter("valueDate")}
                                                    colSpan={1}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                <OnResetData sOnFetching={sOnFetching} />
                                                <div>
                                                    {listData.dataExcel?.length > 0 && (
                                                        <ExcelFileComponent
                                                            dataLang={dataLang}
                                                            filename={"Danh sách kế hoạch nội bộ"}
                                                            multiDataSet={multiDataSet}
                                                            title="DSKHNB"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <DropdowLimit dataLang={dataLang} sLimit={sLimit} limit={limit} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] 3xl:h-[90%] 2xl:h-[87%] xl:h-[78%] lg:h-[90%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lg:w-[100%] ">
                                        <div className="grid grid-cols-9 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                {dataLang?.internal_plan_name || "internal_plan_name"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.internal_plan_status || "internal_plan_status"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.internal_plan_creators || "internal_plan_creators"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_branch || "import_branch"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.recall_noteChild || "recall_noteChild"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_action || "import_action"}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : listData.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[900px]">
                                                    {listData?.data?.map((e, index) => (
                                                        <div
                                                            className="relative  grid grid-cols-9 items-center py-1.5  hover:bg-slate-100/40 group"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer ">
                                                                <PopupDetail
                                                                    dataLang={dataLang}
                                                                    className="text-left"
                                                                    name={e?.reference_no}
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left capitalize">
                                                                {e.plan_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base mx-auto 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left capitalize">
                                                                {index % 2 === 0 ? (
                                                                    <span className="block font-normal text-orange-500  rounded-xl py-[1px] px-2 w-fit min-w-[136px] bg-orange-200 text-center text-[13px]">
                                                                        {"Chưa lập KHNVL"}
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-[1px] px-2 w-fit min-w-[136px]  bg-lime-200 text-center text-[13px]">
                                                                        <TickCircle
                                                                            className="bg-lime-500 rounded-full"
                                                                            color="white"
                                                                            size={15}
                                                                        />
                                                                        {"Đã lập KHNVL"}
                                                                    </span>
                                                                )}
                                                            </h6>

                                                            <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left flex items-center space-x-1">
                                                                <div className="relative">
                                                                    <ModalImage
                                                                        small={
                                                                            e?.created_by_profile_image
                                                                                ? e?.created_by_profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        large={
                                                                            e?.created_by_profile_image
                                                                                ? e?.created_by_profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        className="h-6 w-6 rounded-full object-cover "
                                                                    >
                                                                        <div className="">
                                                                            <ImageErrors
                                                                                src={e?.created_by_profile_image}
                                                                                width={25}
                                                                                height={25}
                                                                                defaultSrc="/user-placeholder.jpg"
                                                                                alt="Image"
                                                                                className="object-cover  rounded-[100%] text-left cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </ModalImage>
                                                                    <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <h6 className="capitalize">
                                                                    {e?.created_by_full_name}
                                                                </h6>
                                                            </h6>

                                                            <h6 className="col-span-1 w-fit mx-auto">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2">
                                                                    {e?.name_branch}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left capitalize">
                                                                {e.note}
                                                            </h6>
                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    type="internal_plan"
                                                                    className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
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
                            </div>
                        </div>
                        {listData.data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6 className="">
                                    {dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {totalItems?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
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
