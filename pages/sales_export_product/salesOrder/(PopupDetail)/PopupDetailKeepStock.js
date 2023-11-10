// Danh sách dữ kho

import moment from "moment";
import Swal from "sweetalert2";
import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";
import { SearchNormal1 as IconSearch, Trash as IconDelete, BoxSearch } from "iconsax-react";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ToatstNotifi from "@/components/UI/alerNotification/alerNotification";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import ExcelFileComponent from "@/components/UI/filterComponents/excelFilecomponet";

const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });
const Popup_EditDetail = dynamic(() => import("./PopupEditDetail"), { ssr: false });

const Popup_DetailKeepStock = (props) => {
    const { dataLang, id } = props;

    const initialFetchs = {
        onSending: false,
        onFetching: false,
        onFetchingFilter: false,
        onFetchingWarehouse: false,
    };

    const initialValues = {
        idTranfer: null,
        idWarehouse: null,
        idStatus: null,
    };

    const initialDataFilters = {
        tranfer: [],
        warehouse: [],
        status: [
            { label: "Đã duyệt kho", value: "warehouse_confirmed" },
            { label: "Chưa duyệt kho", value: "warehouse_unconfirmed" },
        ],
    };

    const [data, sData] = useState({});

    let dataClone = { ...data };

    const [open, sOpen] = useState(false);

    const [isValue, sIsValue] = useState(initialValues);

    const [isFetching, sIsFetching] = useState(initialFetchs);

    const [dataFilter, sDataFilter] = useState(initialDataFilters);

    const _ToggleModal = (e) => sOpen(e);

    const setIsFetch = (e) => sIsFetching((prev) => ({ ...prev, ...e }));

    const onChangeValue = (key) => (event) => sIsValue((prev) => ({ ...prev, [key]: event }));

    useEffect(() => {
        open && sIsValue(initialValues);
        open && setIsFetch({ onFetching: true, onFetchingFilter: true });
    }, [open]);

    const handleFetching = () => {
        Axios(
            "GET",
            `/api_web/Api_sale_order/GetListKeepOrder/${id}/?csrf_protection=true`,
            {
                params: {
                    "filter[status_bar]": isValue.idStatus?.value,
                    "filter[id]": isValue.idTranfer?.value,
                    "filter[warehouses_id]": isValue.idWarehouse?.value,
                },
            },
            (err, response) => {
                if (!err) {
                    let db = response?.data;

                    sData(db);
                }

                setIsFetch({ onFetching: false });
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", "/api_web/Api_transfer/TransferCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { result } = response?.data;

                sDataFilter((prev) => ({
                    ...prev,
                    tranfer: result?.map(({ code, id }) => ({ label: code, value: id })),
                }));
            }
        });

        Axios(
            "GET",
            "/api_web/Api_warehouse/warehouseComboboxFindBranch/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    let data = response?.data;

                    sDataFilter((prev) => ({
                        ...prev,
                        warehouse: data?.map((e) => ({ label: e?.warehouse_name, value: e?.id })),
                    }));
                }
            }
        );

        setIsFetch({ onFetchingFilter: false });
    };

    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText: `${props.dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                Axios(
                    "DELETE",
                    `/api_web/Api_transfer/deletetransferKeep/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            let { isSuccess, message } = response.data;

                            if (isSuccess) {
                                ToatstNotifi("success", props.dataLang[message]);
                                sIsFetching({ onFetching: true });
                            } else {
                                ToatstNotifi("error", props.dataLang[message]);
                            }
                        }
                    }
                );
            }
        });
    };

    useEffect(() => {
        isFetching.onFetching && handleFetching();
    }, [isFetching.onFetching]);

    useEffect(() => {
        isFetching.onFetchingFilter && _ServerFetching_filter();
    }, [isFetching.onFetchingFilter]);

    useEffect(() => {
        isValue && setIsFetch({ onFetching: true });
    }, [isValue]);

    const selectArray = [
        {
            id: uuid(),
            options: dataFilter.tranfer,
            value: isValue.idTranfer,
            placeholder: "Phiếu giữ kho",
            key: "idTranfer",
        },
        {
            id: uuid(),
            options: dataFilter.warehouse,
            value: isValue.idWarehouse,
            placeholder: "Kho chuyển",
            key: "idWarehouse",
        },
        {
            id: uuid(),
            options: dataFilter.status,
            value: isValue.idStatus,
            placeholder: "Trạng thái",
            key: "idStatus",
        },
    ];

    const columnArray = [
        {
            id: uuid(),
            title: "id",
            width: 4,
        },
        {
            id: uuid(),
            title: "Ngày chứng từ",
            width: 40,
        },
        {
            id: uuid(),
            title: "Mã chứng từ",
            width: 40,
        },
        {
            id: uuid(),
            title: "Mã đơn hàng",
            width: 40,
        },
        {
            id: uuid(),
            title: "Kho chuyển",
            width: 40,
        },
        {
            id: uuid(),
            title: "Kho nhận",
            width: 40,
        },
        {
            id: uuid(),
            title: "Trạng thái",
            width: 40,
        },
        {
            id: uuid(),
            title: `${dataLang?.note || "note"}`,
            width: 40,
        },
    ];

    const multiDataSet = [
        {
            columns: columnArray?.map((e) => {
                return {
                    title: e?.title,
                    width: { wch: e?.width },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                };
            }),
            data: dataClone?.transfer?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${dataClone?.order.code}` },
                { value: `${e?.warehouses_id_name ? e?.warehouses_id_name : ""}` },
                { value: `${e?.warehouses_to_name ? e?.warehouses_to_name : ""}` },
                { value: `${e?.warehouseman_id == "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <>
            <PopupEdit
                title={dataLang?.salesOrder_listarchive || "salesOrder_listarchive"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={""}
                button={
                    <button className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                        <BoxSearch
                            size={20}
                            className="group-hover:text-amber-500 group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-amber-500 pr-2.5">
                            {dataLang?.salesOrder_see_stock_keeping || "salesOrder_see_stock_keeping"}
                        </p>
                    </button>
                }
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="3xl:w-[1300px] 2xl:w-[1150px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <div className="grid grid-cols-11 gap-2 items-center py-2 bg-slate-100 w-full rounded-t-lg">
                            {selectArray.map((e) => (
                                <SelectComponent
                                    key={e.id}
                                    isClearable={true}
                                    onChange={onChangeValue(e.key)}
                                    options={[{ label: e.placeholder, value: null, isDisabled: true }, ...e.options]}
                                    value={e.value}
                                    colSpan={2}
                                    styles={{
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#cbd5e1",
                                            fontSize: "14px !important",
                                        }),
                                        control: (base, state) => ({
                                            ...base,
                                            border: "none",
                                            outline: "none",
                                            boxShadow: "none",
                                            ...(state.isFocused && {
                                                boxShadow: "0 0 0 1.5px #0F4F9E",
                                            }),
                                        }),
                                    }}
                                    maxMenuHeight={180}
                                    placeholder={e.placeholder}
                                />
                            ))}
                            <div className="col-span-5 justify-end flex items-center gap-1 mr-2">
                                <OnResetData sOnFetching={sIsFetching} />
                                {dataClone?.transfer?.length > 0 && (
                                    <ExcelFileComponent
                                        multiDataSet={multiDataSet}
                                        dataLang={dataLang}
                                        filename={"Danh sách giữ kho"}
                                        title={"Danh sách giữ kho"}
                                    />
                                )}
                            </div>
                        </div>
                        <div className=" w-[100%]">
                            <div
                                className={`grid-cols-10 divide-x p-2 grid sticky top-0 bg-white shadow-lg  z-10 rounded `}
                            >
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.inventory_dayvouchers || "inventory_dayvouchers"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.inventory_vouchercode || "inventory_vouchercode"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.salesOrder_code_orders || "salesOrder_code_orders"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                    {dataLang?.warehouseTransfer_transferWarehouse ||
                                        "warehouseTransfer_transferWarehouse"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                    {dataLang?.warehouseTransfer_receivingWarehouse ||
                                        "warehouseTransfer_receivingWarehouse"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.warehouses_localtion_status || "warehouses_localtion_status"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.inventory_note || "inventory_note"}
                                </h4>
                                <h4 className="text-[13px] px-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                    {dataLang?.salesOrder_action || "salesOrder_action"}
                                </h4>
                            </div>
                            {isFetching.onFetching ? (
                                <Loading className="max-h-28" color="#0f4f9e" />
                            ) : dataClone?.transfer?.length > 0 ? (
                                <>
                                    <ScrollArea
                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                        speed={1}
                                        smoothScrolling={true}
                                    >
                                        <div className=" divide-slate-200 min:h-[170px]  max:h-[170px]">
                                            {dataClone?.transfer?.map((e) => {
                                                return (
                                                    <div
                                                        className="grid grid-cols-10 hover:bg-slate-50 items-center border-b"
                                                        key={e.id?.toString()}
                                                    >
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {moment(e?.date).format("DD/MM/YYYY")}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {e?.code}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {dataClone?.order.code}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-2 text-left break-words">
                                                            {e?.warehouses_id_name}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-2 text-left break-words">
                                                            {e?.warehouses_to_name}
                                                        </h6>
                                                        <h6
                                                            className={`text-[12px] ${
                                                                e?.warehouseman_id == "0"
                                                                    ? "bg-blue-200 text-blue-700 px-1.5"
                                                                    : " bg-green-200 text-green-700 px-3"
                                                            } py-1 col-span-1 font-medium text-center break-words w-fit  mx-auto rounded-2xl`}
                                                        >
                                                            {`${
                                                                e?.warehouseman_id == "0"
                                                                    ? "Chưa duyệt kho"
                                                                    : "Đã duyệt kho"
                                                            }`}
                                                        </h6>
                                                        <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">
                                                            {e?.note}
                                                        </h6>

                                                        <h6 className="text-[13px] flex items-center justify-center gap-4 py-2 col-span-1 font-medium text-center break-words">
                                                            <Popup_EditDetail
                                                                {...props}
                                                                id={e.id}
                                                                sIsFetchingParent={sIsFetching}
                                                                dataClone={dataClone}
                                                            />
                                                            <button
                                                                type="button"
                                                                title="Xóa"
                                                                onClick={(event) => _HandleDelete(e?.id)}
                                                                className="group transition h-10 rounded-[5.5px] hover:text-red-600 text-red-500 flex flex-col justify-center items-center"
                                                            >
                                                                <IconDelete
                                                                    size={23}
                                                                    className="group-hover:text-red-500 group-hover:scale-110 group-hover:shadow-md "
                                                                />
                                                            </button>
                                                        </h6>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </>
                            ) : (
                                <div className=" max-w-[352px] mt-24 mx-auto">
                                    <div className="text-center">
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                            <IconSearch />
                                        </div>
                                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                            {dataLang?.purchase_order_table_item_not_found ||
                                                "purchase_order_table_item_not_found"}
                                        </h1>
                                        <div className="flex items-center justify-around mt-6 "></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between border-t">
                            <div className="col-span-7 font-medium grid grid-cols-7 text-left"></div>
                            <div className="col-span-3 space-y-2"></div>
                            <div className="col-span-2 space-y-2">
                                <div className="text-right mt-5 mr-2 space-x-2">
                                    <button
                                        type="button"
                                        onClick={_ToggleModal.bind(this, false)}
                                        className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
                                    >
                                        {dataLang?.branch_popup_exit || "branch_popup_exit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_DetailKeepStock;
