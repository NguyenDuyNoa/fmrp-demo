import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { _ServerInstance as Axios } from "/services/axios";

import { Edit as IconEdit, Trash as IconDelete, Grid6 as IconExcel, SearchNormal1 as IconSearch, Grid6 } from "iconsax-react";
import "react-phone-input-2/lib/style.css";
import Popup_phongban from "./components/departments/popup";

import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";

import useToast from "@/hooks/useToast";
import useActionRole from "@/hooks/useRole";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";

import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import BtnAction from "@/components/UI/BtnAction";

const Index = (props) => {
    const router = useRouter();

    const { isOpen, isId, handleQueryId } = useToggle();

    const dataLang = props.dataLang;

    const isShow = useToast()

    const trangthaiExprired = useStatusExprired();

    const { limit, updateLimit: sLimit, totalItems: totalItem, updateTotalItems: sTotalItem } = useLimitAndTotalItems()

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'department');

    const initalState = {
        keySearch: '',
        onFetching: false,
        onFetchingBrand: false,
        data: [],
        data_ex: [],
        valueBr: [],
        listBr: []
    }

    const [isState, sIsState] = useState(initalState)

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));


    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_staff/department/?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.valueBr?.length > 0 ? isState.valueBr.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;

                    sTotalItem(output);
                    queryState({ data: rResult || [], data_ex: rResult || [] });
                }
                queryState({ onFetching: false });
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
                    queryState({ listBr: rResult?.map((e) => ({ label: e.name, value: e.id })) });
                }
                queryState({ onFetchingBrand: false });
            }
        );
    };


    useEffect(() => {
        (isState.onFetching && _ServerFetching())
    }, [isState.onFetching]);

    useEffect(() => {
        (isState.onFetchingBrand && _ServerFetching_brand());
    }, [isState.onFetchingBrand]);

    useEffect(() => {
        queryState({ onFetching: true })
    }, [limit, router.query?.page, isState.valueBr, isState.keySearch]);

    useEffect(() => {
        queryState({ onFetchingBrand: true })
    }, [])

    const paginate = (pageNumber) => {
        router.push({
            pathname: "/personnels/departments",
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value })
        router.replace("/personnels/departments");
        queryState({ onFetching: true })
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
                    title: `${dataLang?.personnels_deparrtments_name}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_deparrtments_email}`,
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
                { value: `${e.email ? e.email : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.personnels_deparrtments_title}</title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.personnels_deparrtments_title}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.personnels_deparrtments_title}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.personnels_deparrtments_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ?
                                    <Popup_phongban
                                        isState={isState}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        nameModel={"client_contact"}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" /> :
                                    < button
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
                                <div className="bg-slate-100 w-full rounded grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                                    <div className="col-span-4">
                                        <div className="grid grid-cols-9 gap-2">
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
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
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
                                                            filename="Phòng ban"
                                                            title="Pb"
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
                            <Customscrollbar className="min:h-[500px] 2xl:h-[92%] xl:h-[69%] h-[72%] max:h-[800px]   overflow-auto pb-2">
                                <div className="w-full">
                                    <div className="grid grid-cols-12 items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-3 text-center">
                                            {dataLang?.personnels_deparrtments_name}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-3 text-center">
                                            {dataLang?.personnels_deparrtments_email}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-4 text-center">
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
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px] ">
                                                {isState.data?.map((e) => (
                                                    <div
                                                        className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                        key={e.id.toString()}
                                                    >
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-3 text-left">
                                                            {e.name}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-3 text-left">
                                                            {e.email}
                                                        </h6>
                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-4 text-center">
                                                            <span className="flex flex-wrap space-x-2">
                                                                {e.branch?.map((i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="cursor-default w-fit 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase ml-2"
                                                                    >
                                                                        {i.name}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        </h6>
                                                        <div className="col-span-2 space-x-2 text-center flex items-center justify-center">
                                                            {role == true || checkEdit ?
                                                                <Popup_phongban
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    className="xl:text-base text-xs "
                                                                    isState={isState}
                                                                    sValueBr={e.branch}
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    email={e.email}
                                                                    id={e.id}
                                                                />
                                                                :
                                                                <IconEdit className="cursor-pointer" onClick={() => isShow('warning', WARNING_STATUS_ROLE)} />
                                                            }
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={() => { }}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="department"
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
                            </Customscrollbar>
                        </ContainerTable>
                    </div>
                    {isState.data?.length != 0 && (
                        <div className="flex space-x-5 items-center">
                            <h6>
                                {dataLang?.display} {totalItem?.iTotalDisplayRecords} thành phần
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
            </Container >
        </React.Fragment >
    );
};

export default Index;
