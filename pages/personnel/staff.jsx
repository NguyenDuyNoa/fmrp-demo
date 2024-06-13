import Head from "next/head";
import { debounce } from "lodash";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ModalImage from "react-modal-image";
import React, { useState, useEffect } from "react";
import { _ServerInstance as Axios } from "/services/axios";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Eye as IconEye,
    EyeSlash as IconEyeSlash,
    Image as IconImage,
    GalleryEdit as IconEditImg,
    Grid6,
} from "iconsax-react";

import Popup_dsnd from "./components/staff/popup";
import Popup_chitiet from "./components/staff/popupDetail";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";

import useToast from "@/hooks/useToast";
import useActionRole from "@/hooks/useRole";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";

import { WARNING_STATUS_ROLE, WARNING_STATUS_ROLE_ADMIN } from "@/constants/warningStatus/warningStatus";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import usePagination from "@/hooks/usePagination";

const Index = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const { paginate } = usePagination();

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const router = useRouter();

    const statusExprired = useStatusExprired();

    const initalState = {
        onFetching: false,
        onFetchingRoom: false,
        onFetchingOpt: false,
        onFetchingBranch: false,
        onSending: false,
        data: {},
        data_ex: [],
        dataOption: [],
        dataBranch: [],
        idPos: null,
        room: [],
        valueBr: [],
        keySearch: "",
    };

    const [isState, sIsState] = useState(initalState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const {
        limit,
        updateLimit: sLimit,
        totalItems: totalItem,
        updateTotalItems: sTotalItems,
    } = useLimitAndTotalItems();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const [status, sStatus] = useState("");

    const [active, sActive] = useState("");

    const _ServerFetching_room = () => {
        Axios("GET", `/api_web/api_staff/department/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({ room: rResult });
            }
            queryState({ onFetchingRoom: false });
        });
    };

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_staff/staff/?csrf_protection=true" }`,
            {
                params: {
                    search: isState.keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState.valueBr?.length > 0 ? isState.valueBr.map((e) => e.value) : null,
                    "filter[position_id]": isState.idPos?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    const { rResult, output } = response.data;
                    queryState({ data: rResult || [], data_ex: rResult || [] });
                    sTotalItems(output);
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
                params: {},
            },
            (err, response) => {
                if (!err) {
                    const { rResult } = response.data;
                    queryState({
                        dataBranch: rResult?.map((e) => ({ label: e.name, value: e.id })) || [],
                    });
                }
                queryState({ onFetchingBranch: false });
            }
        );
    };

    const _ServerFetchingOtp = () => {
        Axios("GET", "/api_web/api_staff/positionOption", {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data;
                queryState({
                    dataOption:
                        rResult.map((x) => ({
                            label: x.name,
                            value: x.id,
                            level: x.level,
                            code: x.code,
                            parent_id: x.parent_id,
                        })) || [],
                });
            }
        });
        queryState({ onFetchingOpt: false });
    };

    useEffect(() => {
        isState.onFetchingOpt && _ServerFetchingOtp();
    }, [isState.onFetchingOpt]);

    useEffect(() => {
        isState.onFetchingRoom && _ServerFetching_room();
    }, [isState.onFetchingRoom]);
    useEffect(() => {
        isState.onFetchingBranch && _ServerFetching_brand();
    }, [isState.onFetchingBranch]);

    useEffect(() => {
        queryState({
            onFetching: true,
            onFetchingOpt: true,
            onFetchingRoom: true,
            onFetchingBranch: true,
        });
    }, []);

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        queryState({ onFetching: true });
    }, 500);

    useEffect(() => {
        isState.onFetching && _ServerFetching();
    }, [isState.onFetching]);

    useEffect(() => {
        queryState({ onFetching: true });
    }, [limit, router.query?.page, , isState.valueBr, isState.idPos]);

    const handleDelete = async () => {
        sStatus(isKeyState);
        const index = isState.data.findIndex((x) => x.id === isKeyState);
        if (index !== -1 && isState.data[index].active === "0") {
            sActive((isState.data[index].active = "1"));
        } else if (index !== -1 && isState.data[index].active === "1") {
            sActive((isState.data[index].active = "0"));
        }
        queryState({ data: [...isState.data] });
        handleQueryId({ status: false });
    };

    const _ServerSending = () => {
        let id = status;
        var data = new FormData();
        data.append("active", active);
        Axios(
            "POST",
            `${id && `/api_web/api_staff/change_status_staff/${id}?csrf_protection=true`}`,
            {
                data: {
                    active: active,
                },
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", dataLang[message] || message);
                    } else {
                        isShow("error", dataLang[message] || message);
                    }
                }
                queryState({ onSending: false });
            }
        );
    };

    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);

    useEffect(() => {
        if (active || status) {
            queryState({ onSending: true });
        }
    }, [active, status]);

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
                    title: `${dataLang?.personnels_staff_table_fullname}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_code}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_email}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_depart}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_position}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_logged}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_table_active}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_popup_manager}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.personnels_staff_position}`,
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
                { value: `${e.full_name ? e.full_name : ""}` },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.email ? e.email : ""}` },
                {
                    value: `${e.department ? e.department?.map((e) => e.name) : ""}`,
                },
                { value: `${e.position_name ? e.position_name : ""}` },
                { value: `${e.last_login ? e.last_login : ""}` },

                {
                    value: `${e.active ? (e.active == "1" ? "Đang hoạt động" : "Không hoạt động") : ""}`,
                },
                {
                    value: `${e.admin ? e.admin == "1" && "Có" : e.admin == "0" && "Không"}`,
                },
                { value: `${e.position_name ? e.position_name : ""}` },
                { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
            ]),
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.personnels_staff_title}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.personnels_staff_title || "personnels_staff_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.personnels_staff_title || "personnels_staff_title"}</h6>
                    </div>
                )}
                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.personnels_staff_title}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role ? (
                                    <Popup_dsnd
                                        isState={isState}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE_ADMIN);
                                        }}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.branch_popup_create_new}
                                    </button>
                                )}
                            </div>
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
                                                    ...isState.dataBranch,
                                                ]}
                                                onChange={(e) => queryState({ valueBr: e })}
                                                value={isState.valueBr}
                                                placeholder={dataLang?.price_quote_branch || "price_quote_branch"}
                                                colSpan={3}
                                                components={{ MultiValue }}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                            />
                                            <SelectComponent
                                                options={[
                                                    {
                                                        value: "",
                                                        label:
                                                            dataLang?.personnels_staff_position ||
                                                            "personnels_staff_position",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.dataOption,
                                                ]}
                                                isClearable={true}
                                                formatOptionLabel={SelectOptionLever}
                                                onChange={(e) => queryState({ idPos: e })}
                                                value={isState.idPos}
                                                placeholder={
                                                    dataLang?.personnels_staff_position || "personnels_staff_position"
                                                }
                                                colSpan={3}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {role ? (
                                                <div className={``}>
                                                    {isState.data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            multiDataSet={multiDataSet}
                                                            filename="Danh sách người dùng"
                                                            title="Dsnd"
                                                            dataLang={dataLang}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => isShow("warning", WARNING_STATUS_ROLE)}
                                                    className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                                >
                                                    <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                </button>
                                            )}
                                            <div>
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Customscrollbar className="min:h-[500px] 2xl:h-[92%] xl:h-[69%] h-[72%] max:h-[800px] pb-2">
                                <div className="w-full">
                                    <HeaderTable gridCols={13}>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_avtar || "personnels_staff_table_avtar"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_fullname ||
                                                "personnels_staff_table_fullname"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_code || "personnels_staff_table_code"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_email || "personnels_staff_table_email"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_depart || "personnels_staff_table_depart"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.personnels_staff_position || "personnels_staff_position"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_logged || "personnels_staff_table_logged"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.personnels_staff_table_active || "personnels_staff_table_active"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.client_list_brand || "client_list_brand"}
                                        </ColumnTable>
                                        <ColumnTable colSpan={1} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties || "branch_popup_properties"}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={13} key={e?.id.toString()}>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            <div className="w-[60px] h-[60px] mx-auto">
                                                                {e?.profile_image == null ? (
                                                                    <ModalImage
                                                                        small="/no_image.png"
                                                                        large="/no_image.png"
                                                                        className="w-full h-full rounded object-contain"
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <ModalImage
                                                                            small={e?.profile_image}
                                                                            large={e?.profile_image}
                                                                            className="w-[60px] h-[60px]  rounded-[100%] object-cover"
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1}>
                                                            <Popup_chitiet
                                                                dataLang={dataLang}
                                                                className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:textx-blue-600 transition-all ease-linear px-2 text-left"
                                                                name={e.full_name}
                                                                id={e?.id}
                                                            />
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"center"}>
                                                            {e.code}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e.email}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            <div className="flex flex-wrap gap-2">
                                                                {e.department?.map((e) => {
                                                                    return <span key={e.id}>{e.name}</span>;
                                                                })}
                                                            </div>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            {e.position_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"center"}>
                                                            {e.last_login != null
                                                                ? moment(e.last_login).format("DD/MM/YYYY, h:mm:ss")
                                                                : ""}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} textAlign={"center"}>
                                                            <label
                                                                htmlFor={e.id}
                                                                className="relative inline-flex items-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    value={e.active}
                                                                    id={e.id}
                                                                    checked={e.active == "0" ? false : true}
                                                                    onChange={() => {
                                                                        if (role) {
                                                                            handleQueryId({
                                                                                initialKey: e.id,
                                                                                status: true,
                                                                            });
                                                                        } else {
                                                                            isShow(
                                                                                "warning",
                                                                                WARNING_STATUS_ROLE_ADMIN
                                                                            );
                                                                        }
                                                                    }}
                                                                />

                                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={1} className="flex  gap-1 flex-wrap">
                                                            {e.branch?.map((i) => (
                                                                <TagBranch key={i}>{i.name}</TagBranch>
                                                            ))}
                                                        </RowItemTable>

                                                        <RowItemTable
                                                            colSpan={1}
                                                            className="space-x-2 text-center flex items-center justify-center"
                                                        >
                                                            <Popup_dsnd
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                className="xl:text-base text-xs "
                                                                dataLang={dataLang}
                                                                name={e.name}
                                                                code={e.code}
                                                                phone_number={e.phone_number}
                                                                email={e.email}
                                                                id={e?.id}
                                                                department={e.department}
                                                                position_name={e.position_name}
                                                                last_login={e.last_login}
                                                                isState={isState}
                                                            />
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={() => {}}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="personnel_staff"
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
                        </ContainerTable>
                    </div>
                    {isState.data?.length != 0 && (
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
            </Container>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                nameModel="personnel_staff_status"
                isOpen={isOpen}
                save={handleDelete}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Index;
