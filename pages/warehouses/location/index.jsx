import { Grid6, Edit as IconEdit } from "iconsax-react";
import { debounce } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";
import SearchComponent from "@/components/UI/filterComponents/searchComponent";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Loading from "@/components/UI/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";

import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";

import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import apiLocationWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouseLocation/apiWarehouseLocation";
import { BtnAction } from "@/components/UI/BtnAction";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, HeaderTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import { Container, ContainerBody, ContainerTable } from "@/components/UI/common/layout";
import NoData from "@/components/UI/noData/nodata";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import usePagination from "@/hooks/usePagination";
import useActionRole from "@/hooks/useRole";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { useSelector } from "react-redux";
import Popup_Vitrikho from "./components/popup";
const Location = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const statusExprired = useStatusExprired();

    const initialState = {
        keySearch: "",
        onFetching: false,
        data: [],
        data_ex: [],
        valueWarehouse: null,
        listWarehouse: [],
        onSending: null,
        onFetchingWarehouse: false,
    };

    const { paginate } = usePagination();

    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { isOpen, isId, isKeyState, handleQueryId } = useToggle();

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);
    //thay type
    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, "warehouse_location");

    const [limit, sLimit] = useState(15);

    const [totalItem, sTotalItems] = useState([]);

    const [status, sStatus] = useState(null);

    const [active, sActive] = useState(null);

    const _HandleFresh = () => { };

    const _ServerFetching = async () => {
        const params = {
            search: isState.keySearch,
            limit: limit,
            page: router.query?.page || 1,
            "filter[warehouse_id]": isState.valueWarehouse ? isState.valueWarehouse?.value : null,
        };
        try {
            const { rResult, output } = await apiLocationWarehouse.apiLocationWarehouse({ params: params });
            sTotalItems(output);
            queryState({ data: rResult, data_ex: rResult, onFetching: false });
        } catch (error) { }
    };
    const _ServerFetching_kho = async () => {
        const params = {
            limit: 0,
            "filter[is_system]": 2,
        };
        try {
            const { rResult } = await apiWarehouse.apiListWarehouse({ params: params });
            queryState({
                listWarehouse: rResult?.map((e) => ({ label: e.name, value: e.id })),
                onFetchingWarehouse: false,
            });
        } catch (error) { }
    };

    useEffect(() => {
        isState.onFetching && _ServerFetching();
    }, [isState.onFetching]);

    useEffect(() => {
        isState.onFetchingWarehouse && _ServerFetching_kho();
    }, [isState.onFetchingWarehouse]);

    useEffect(() => {
        queryState({ onFetchingWarehouse: true });
    }, []);

    useEffect(() => {
        queryState({ onFetching: true });
    }, [limit, router.query?.page, isState.valueWarehouse]);

    // 1true 0 fal
    const handleDelete = async () => {
        // if (isKeyState) {
        sActive(isKeyState);
        let index = isState.data.findIndex((x) => x.id === isKeyState);

        if (index !== -1 && isState.data[index].status === "0") {
            sStatus((isState.data[index].status = "1"));
        } else if (index !== -1 && isState.data[index].status === "1") {
            sStatus((isState.data[index].status = "0"));
        }
        _ServerSending();

        handleQueryId({ status: false });
    };

    const _ServerSending = async () => {
        let id = active;
        if (!id) return;
        try {
            const { isSuccess, message } = await apiLocationWarehouse.apiHandingStatus(id, {
                data: {
                    status: status,
                },
            });
            if (isSuccess) {
                isShow("success", `${dataLang[message] || message}`);
            } else {
                isShow("error", `${dataLang[message] || message}`);
            }
            await _ServerFetching();
        } catch (error) { }
        queryState({ onSending: false });
    };
    useEffect(() => {
        isState.onSending && _ServerSending();
    }, [isState.onSending]);

    useEffect(() => {
        queryState({ onSending: true });
    }, [status]);

    useEffect(() => {
        queryState({ onSending: true });
    }, [active]);

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryState({ keySearch: value });
        router.replace({
            pathname: router.route,
            query: {
                page: router.query?.page,
            },
        });
        queryState({ onFetching: true });
    }, 500);
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
                    title: `${dataLang?.warehouses_localtion_ware || "warehouses_localtion_ware"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_localtion_code || "warehouses_localtion_code"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_localtion_NAME || "warehouses_localtion_NAME"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_localtion_date || "warehouses_localtion_date"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: isState.data_ex?.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.warehouse_name ? e.warehouse_name : ""}` },
                { value: `${e.code ? e.code : ""}` },
                { value: `${e.name ? e.name : ""}` },
                {
                    value: `${e.status ? (e.status == "1" ? "Đang sử dụng" : "Không sử dụng") : ""}`,
                },
                { value: `${e.date_create ? e.date_create : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.warehouses_localtion_title || "warehouses_localtion_title"}</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.warehouses_localtion_title || "warehouses_localtion_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.warehouses_localtion_title || "warehouses_localtion_title"}</h6>
                    </div>
                )}

                <ContainerBody>
                    <div className="space-y-3 h-[96%] overflow-hidden">
                        <div className="flex justify-between  mt-1 mr-2">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                {dataLang?.warehouses_localtion_title || "warehouses_localtion_title"}
                            </h2>
                            <div className="flex justify-end items-center gap-2">
                                {role == true || checkAdd ? (
                                    <Popup_Vitrikho
                                        // listKho={listKho}
                                        isState={isState}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            isShow("warning", WARNING_STATUS_ROLE);
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
                                                colSpan={2}
                                                onChange={_HandleOnChangeKeySearch.bind(this)}
                                                dataLang={dataLang}
                                            />
                                            <SelectComponent
                                                placeholder={"kho hàng"}
                                                colSpan={2}
                                                onChange={(e) => queryState({ valueWarehouse: e })}
                                                value={isState.valueWarehouse}
                                                components={{ MultiValue }}
                                                aria-label={"kho hàng"}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "kho hàng",
                                                        isDisabled: true,
                                                    },
                                                    ...isState.listWarehouse,
                                                ]}
                                                isClearable={true}
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex space-x-2 items-center justify-end">
                                            <OnResetData sOnFetching={(e) => queryState({ onFetching: e })} />
                                            {role == true || checkExport ? (
                                                <div className={``}>
                                                    {isState.data_ex?.length > 0 && (
                                                        <ExcelFileComponent
                                                            filename="Vị trí kho"
                                                            title="Vtk"
                                                            dataSet={multiDataSet}
                                                            data={multiDataSet}
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
                            <Customscrollbar className="min:h-[500px] 2xl:h-[88%] xl:h-[73%] h-[100%] max:h-[800px]">
                                {/* <Customscrollbar className="min:h-[500px] 2xl:h-[85%] xl:h-[69%] h-[100%] max:h-[800px]"> */}
                                <div className="w-full">
                                    <HeaderTable display={"grid"} gridCols={12}>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.warehouses_localtion_ware}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.warehouses_localtion_code}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.warehouses_localtion_NAME}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.warehouses_localtion_status}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.warehouses_localtion_date}
                                        </ColumnTable>
                                        <ColumnTable colSpan={2} textAlign={"center"}>
                                            {dataLang?.branch_popup_properties}
                                        </ColumnTable>
                                    </HeaderTable>
                                    {isState.onFetching ? (
                                        <Loading className="h-80" color="#0f4f9e" />
                                    ) : isState.data?.length > 0 ? (
                                        <>
                                            <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[600px]">
                                                {isState.data?.map((e) => (
                                                    <RowTable gridCols={12} key={e?.id?.toString()}>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e.warehouse_name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e.code}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e.name}
                                                        </RowItemTable>
                                                        <RowItemTable colSpan={2} textAlign={"center"}>
                                                            <label
                                                                htmlFor={e.id}
                                                                className="relative inline-flex items-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    value={e.status}
                                                                    id={e.id}
                                                                    checked={e.status == "0" ? false : true}
                                                                    onChange={() =>
                                                                        handleQueryId({
                                                                            initialKey: e.id,
                                                                            status: true,
                                                                        })
                                                                    }
                                                                />

                                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </RowItemTable>
                                                        {/* <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">{e.email}</h6>                 */}
                                                        <RowItemTable colSpan={2} textAlign={"left"}>
                                                            {e?.date_create != null
                                                                ? formatMoment(e.date_create, FORMAT_MOMENT.TIME_SHORT)
                                                                : ""}
                                                        </RowItemTable>

                                                        <RowItemTable
                                                            colSpan={2}
                                                            className="space-x-2 text-center flex items-center justify-center"
                                                        >
                                                            {role == true || checkEdit ? (
                                                                <Popup_Vitrikho
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    warehouse_name={e.warehouse_name}
                                                                    warehouse_id={e.warehouse_id}
                                                                    isState={isState}
                                                                    className="xl:text-base text-xs "
                                                                    dataLang={dataLang}
                                                                    name={e.name}
                                                                    code={e.code}
                                                                    id={e?.id}
                                                                />
                                                            ) : (
                                                                <IconEdit
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        isShow("warning", WARNING_STATUS_ROLE)
                                                                    }
                                                                />
                                                            )}
                                                            <BtnAction
                                                                onRefresh={_ServerFetching.bind(this)}
                                                                onRefreshGroup={() => { }}
                                                                dataLang={dataLang}
                                                                id={e?.id}
                                                                type="warehouse_location"
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
                isOpen={isOpen}
                save={handleDelete}
                nameModel="warehouse_location_status"
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Location;
