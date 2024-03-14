import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { _ServerInstance as Axios } from "/services/axios";
import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Grid6,
} from "iconsax-react";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import SearchComponent from "components/UI/filterComponents/searchComponent";
import SelectComponent from "components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "components/UI/filterComponents/excelFilecomponet";
import DropdowLimit from "components/UI/dropdowLimit/dropdowLimit";
import useStatusExprired from "@/hooks/useStatusExprired";
import { debounce } from "lodash";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useToast from "@/hooks/useToast";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import NoData from "@/components/UI/noData/nodata";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
const Index = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast()

    const router = useRouter();

    const trangthaiExprired = useStatusExprired();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkExport } = useActionRole(auth, 'client_contact');

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
        Axios("GET", "/api_web/api_client/contact/?csrf_protection=true",
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
                queryState({ onFetchingBranch: false });
            }
        );
    };

    const _ServerFetching_client = () => {
        Axios("GET", `/api_web/api_client/client_option/?csrf_protection=true`,
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

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.client_contact_title}</title>
            </Head>
            <Container>
                {trangthaiExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.client_contact_title || "client_contact_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.client_contact_title || "client_contact_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-0.5 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.client_contact_title || "client_contact_title"}
                            </h2>
                        </div>
                        <ContainerTable>
                            <div className="xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-6 2xl:xl:p-2 xl:p-1.5 p-1.5">
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
                                                onChange={(e) => queryState({ idBranch: e })}
                                                value={isState.idBranch}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                // placeholder={dataLang?.client_list_filterbrand}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                closeMenuOnSelect={false}
                                                isMulti={true}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label: dataLang?.client_group_client || "client_group_client",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listClient,
                                                ]}
                                                onChange={(e) => queryState({ idClient: e })}
                                                value={isState.idClient}
                                                placeholder={dataLang?.client_group_client || "client_group_client"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                closeMenuOnSelect={false}
                                                isMulti={true}
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
                                                            filename="Danh sách liên hệ"
                                                            title="Dslh"
                                                            dataLang={dataLang}
                                                        />)}
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
                            <Customscrollbar className="min:h-[200px] h-[90%] max:h-[750px] pb-2">
                                {/* <div className="h-[100%] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"> */}
                                <div className="w-[100%] lg:w-[100%] ">
                                    <div className="grid grid-cols-12 items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10">
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.client_contact_table_fulname}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.client_contact_table_name}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.client_contact_table_phone}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                            {dataLang?.client_contact_table_mail}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.client_contact_table_pos}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.client_contact_table_hapy}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                            {dataLang?.client_contact_table_address}
                                        </h4>
                                        <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
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
                                                        className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                        key={e.client_contact_id.toString()}
                                                    >
                                                        <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            {e.client_name}
                                                        </h6>
                                                        <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            {e.contact_name}
                                                        </h6>
                                                        <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            {e.phone_number}
                                                        </h6>
                                                        <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left ">
                                                            {e.email}
                                                        </h6>
                                                        <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            {e.position}
                                                        </h6>
                                                        <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-center">
                                                            {e.birthday != "0000-00-00"
                                                                ? moment(e.birthday).format("DD/MM/YYYY")
                                                                : ""}
                                                        </h6>
                                                        <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            {e.address}
                                                        </h6>
                                                        <h6 className="col-span-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-0.5  rounded-md text-left">
                                                            <span className="flex gap-2 flex-wrap justify-start ">
                                                                {e?.branch?.map((e) => (
                                                                    <span className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
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
                                        <NoData />
                                    )}
                                </div>
                            </Customscrollbar>
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
