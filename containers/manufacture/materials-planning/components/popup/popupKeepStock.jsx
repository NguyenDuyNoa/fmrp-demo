import apiMaterialsPlanning from "@/Api/apiManufacture/manufacture/materialsPlanning/apiMaterialsPlanning";
import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useMutation } from "@tanstack/react-query";
import { Add, Trash as IconDelete, ArrowDown2 as IconDown, TickCircle } from "iconsax-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import ModalImage from "react-modal-image";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    onFetching: false,
    type: [
        {
            id: uuidv4(),
            label: "materials_planning_semi",
            value: "product",
        },
        {
            id: uuidv4(),
            label: "materials_planning_materials",
            value: "material",
        },
    ],
    arrayItem: [],
};

const initForm = {
    date: new Date(),
    note: "",
    type: "material",
    arrayItem: [],
}

const PopupKeepStock = ({ dataLang, icon, title, dataTable, className, queryValue, fetchDataTable, ...rest }) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const dataSeting = useSetingServer();

    const [isState, sIsState] = useState(initialState);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature();

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const form = useForm({ defaultValues: { ...initForm } });

    /// lắng nghe thay đổi
    const findValue = form.watch();

    const hangdingMutation = useMutation({
        mutationFn: async (data) => {
            return await apiMaterialsPlanning.apiHandlingKeepProductionsPlan(formData);
        }
    })

    const onSubmit = async (value) => {
        if (value.arrayItem.length == 0) {
            return isShow("error", dataLang?.materials_planning_no_items || "materials_planning_no_items");
        }

        let formData = new FormData();
        formData.append("note", value.note);
        formData.append("type", value.type == "material" ? 1 : 2);
        formData.append("plan_id", dataTable?.listDataRight?.idCommand);
        formData.append("date", formatMoment(value.date, FORMAT_MOMENT.DATE_SLASH_LONG));

        value.arrayItem.forEach((e, index) => {
            formData.append(`items[${index}][id]`, e?.idParent);
            formData.append(`items[${index}][item_id]`, e?.item?.item_id);
            formData.append(`items[${index}][item_code]`, e?.item?.item_code);
            formData.append(`items[${index}][item_name]`, e?.item?.name);
            formData.append(`items[${index}][item_variation]`, e?.item?.variation);
            formData.append(`items[${index}][item_variation_option_value_id]`, e?.itemVariationOptionValueId);
            formData.append(`items[${index}][warehouse_id]`, e?.valueWarehouse?.id);

            e?.valueLocation?.forEach((i, locaitonIndex) => {
                formData.append(`items[${index}][location][${locaitonIndex}][location_id]`, i?.location_id);
                formData.append(`items[${index}][location][${locaitonIndex}][location_value]`, parseFloat(i?.newValue));
                formData.append(`items[${index}][location][${locaitonIndex}][location_lot]`, i?.lot);
                formData.append(`items[${index}][location][${locaitonIndex}][location_expiration_date]`, i?.expiration_date);
                formData.append(`items[${index}][location][${locaitonIndex}][location_serial]`, i?.serial);
            });
        });

        hangdingMutation.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess == 1) {
                    isShow("success", message);
                    queryValue({ page: 1 });
                    fetchDataTable(1);
                    _ToggleModal(false);
                    form.reset();
                    return
                }
                isShow("error", message);
            },
        })

    };

    useEffect(() => {
        if (open) {
            form.setValue("arrayItem", []);
            fetchListItem();
        }
    }, [findValue.type, open]);

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const removeItem = (id) => {
        const updatedData = form.getValues("arrayItem").filter((item) => item.id !== id);
        form.setValue("arrayItem", updatedData);
    };

    const fetchListItem = async () => {
        try {
            queryState({ onFetching: true });
            await new Promise((resolve) => setTimeout(resolve, 500));
            let formData = new FormData();
            // type: 1 nvl, 2 BTP
            formData.append("type", findValue.type == "material" ? 1 : 2);
            formData.append("pPlan_id", dataTable.listDataRight.idCommand);
            const { isSuccess, message, data } = await apiMaterialsPlanning.apiKeepItemsWarehouses(formData);
            const newData = data?.items?.map((e) => {
                return {
                    child: false,
                    id: uuidv4(),
                    idParent: e?.id,
                    item: {
                        item_id: e?.item_id,
                        item_code: e?.item_code,
                        name: e?.item_name,
                        type: e?.type_item,
                        image: e?.images,
                        variation: e?.item_variation,
                    },
                    unit: e?.unit_name_parent,
                    //sl cần
                    quantityNeed: formatNumber(e?.quota_primary),
                    // sl giữ
                    quantityKeepp: formatNumber(e?.quantity_keep),
                    // sl tồn
                    quantityInventory: formatNumber(e?.quantity_warehouse),
                    warehouse: e?.arrW?.map((i) => {
                        return {
                            id: i?.w_id,
                            variation_id: i?.item_variation_id,
                            label: i?.name_warehouse,
                            value: formatNumber(i?.quantity_warehouse),
                        };
                    }),
                    valueWarehouse: null,
                    warehouseLocation: [],
                    valueLocation: [],
                    itemVariationOptionValueId: e?.item_variation_option_value_id,
                };
            })
            form.setValue("arrayItem", newData);
            queryState({ onFetching: false });
        } catch (error) {
            throw error
        }
    };
    const fetchListLocationWarehouse = async (item, idWarehouse) => {
        try {
            let formData = new FormData();
            formData.append("w_id", idWarehouse);
            formData.append("type_item", item?.item?.type);
            formData.append("item_variation_option_value_id", item.itemVariationOptionValueId);
            const { isSuccess, message, data } = await apiMaterialsPlanning.apiLocationItemsWarehouse(formData);
            if (data?.locationsWarehouse) {
                const newData = findValue.arrayItem.map((e) => {
                    if (e.id == item.id) {
                        return {
                            ...e,
                            warehouseLocation: data?.locationsWarehouse?.map((i) => {
                                return {
                                    ...i,
                                    idFe: uuidv4(),
                                    id: i?.location_id,
                                    label: i?.name_location,
                                    value: formatNumber(i?.quantity_warehouse),
                                    qty: formatNumber(i?.quantity_warehouse),
                                    newValue: "1000",
                                    show: true,
                                };
                            }),
                        };
                    }
                    return e;
                });
                console.log("newData", newData);
                form.setValue("arrayItem", newData);
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    const handleShow = (idParent, idChild) => {
        const newData = findValue.arrayItem?.map((e) => {
            if (e?.id == idParent) {
                return {
                    ...e,
                    warehouseLocation: e.warehouseLocation?.map((i) => {
                        if (i.idFe == idChild) {
                            return {
                                ...i,
                                show: !i.show,
                            };
                        }
                        return i;
                    }),
                };
            }
            return e;
        });
        form.setValue("arrayItem", newData);
    };

    const handleIncrease = (e) => {
        const newData = [...findValue.arrayItem];
        const insertIndex = newData.findIndex((item) => item.id === e?.id) + 1;
        newData.splice(insertIndex, 0, {
            ...e,
            id: uuidv4(),
            idParent: e?.idParent,
            valueLocation: null,
            valueWarehouse: null,
            warehouseLocation: [],
            child: true,
        });
        form.setValue("arrayItem", newData);
    };

    return (
        <PopupCustom
            title={dataLang?.materials_planning_raw_materials || "materials_planning_raw_materials"}
            button={
                <button
                    className="bg-blue-100 rounded-lg outline-none focus:outline-none"
                    onClick={() => {
                        if (+dataTable?.countAll == 0) {
                            return isShow("error", dataLang?.materials_planning_please_add || "materials_planning_please_add");
                        }
                        _ToggleModal(true);
                    }}
                >
                    <div className="flex items-center gap-2 px-3 py-2 ">
                        {icon}
                        <h3 className="text-xs font-medium text-blue-600 3xl:text-base">{title}</h3>
                    </div>
                </button>
            }
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={className}
        >
            <div className="mt-4">
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="grid grid-cols-10 gap-4">
                    <div className="flex flex-col col-span-4">
                        <div className="text-[#344054] font-normal 3xl:text-[16px] text-sm mb-1 ">
                            {dataLang?.materials_planning_storage_date || "materials_planning_storage_date"}{" "}
                            <span className="text-red-500 ">*</span>
                        </div>
                        <Controller
                            name="date"
                            control={form.control}
                            rules={{
                                required: {
                                    value: true,
                                    message: dataLang?.materials_planning_pease_select_date || "materials_planning_pease_select_date",
                                },
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <>
                                        <div className="relative flex flex-row custom-date-picker">
                                            <DatePicker
                                                {...field}
                                                ref={(ref) => {
                                                    if (ref !== null) {
                                                        field.ref({
                                                            focus: ref.setFocus,
                                                        });
                                                    }
                                                }}
                                                fixedHeight
                                                id={field.name}
                                                // showTimeSelect
                                                selected={field.value}
                                                placeholderText="DD/MM/YYYY"
                                                dateFormat="dd/MM/yyyy"
                                                // timeInputLabel={"Time: "}
                                                className={`border ${fieldState.error ? "border-red-500" : "border-[#d0d5dd]"
                                                    } 3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer relative`}
                                            />
                                            {field.value && (
                                                <MdClear
                                                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                    onClick={() => form.setValue("date", null)}
                                                />
                                            )}
                                            <BsCalendarEvent className="absolute right-5 top-1/2 -translate-y-1/2 text-[#CCCCCC] scale-110 cursor-pointer" />
                                        </div>
                                        {fieldState.error && (
                                            <span className="text-[12px]  text-red-500">
                                                {fieldState.error.message}{" "}
                                            </span>
                                        )}
                                    </>
                                );
                            }}
                        />
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <div className="flex gap-8 mt-6 items-centerem">
                                        {isState.type.map((e) => {
                                            return (
                                                <div className="flex items-center cursor-pointer">
                                                    <input
                                                        id={e.value}
                                                        type="radio"
                                                        {...field}
                                                        checked={field.value === e.value}
                                                        onChange={() => field.onChange(e.value)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 focus:ring-2"
                                                    />
                                                    <label
                                                        htmlFor={e.value}
                                                        className="ml-2 cursor-pointer 3xl:text-sm text-xs font-medium text-[#52575E]"
                                                    >
                                                        {dataLang[e.label] || e.label}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                        />
                    </div>
                    <div className="col-span-6">
                        <div className="text-[#344054] font-normal 3xl:text-[16px] text-sm mb-1 ">
                            {dataLang?.sales_product_note || "sales_product_note"}
                        </div>
                        <Controller
                            name="note"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <textarea
                                        {...field}
                                        placeholder={dataLang?.sales_product_note || "sales_product_note"}
                                        name="fname"
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] resize-none placeholder:text-slate-300 w-full min-h-[100px] max-h-[100px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                                    />
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="3xl:w-[1300px] 2xl:w-[1150px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <HeaderTablePopup gridCols={13}>
                        <ColumnTablePopup colSpan={3}>
                            {dataLang?.price_quote_item || "price_quote_item"}
                        </ColumnTablePopup>
                        <ColumnTablePopup>
                            {dataLang?.materials_planning_purchase_unit || "materials_planning_purchase_unit"}
                        </ColumnTablePopup>
                        <ColumnTablePopup>
                            {dataLang?.materials_planning_qty_need || "materials_planning_qty_need"}
                        </ColumnTablePopup>
                        <ColumnTablePopup>
                            {dataLang?.materials_planning_qty_held || "materials_planning_qty_held"}
                        </ColumnTablePopup>
                        <ColumnTablePopup>
                            {dataLang?.materials_planning_qty_inventory || "materials_planning_qty_inventory"}
                        </ColumnTablePopup>
                        <ColumnTablePopup colSpan={2}>
                            {dataLang?.salesOrder_warehouse || "salesOrder_warehouse"}
                        </ColumnTablePopup>
                        <ColumnTablePopup colSpan={3}>
                            {dataLang?.warehouses_localtion_title || "warehouses_localtion_title"}
                        </ColumnTablePopup>
                        <ColumnTablePopup>
                            {dataLang?.inventory_operatione || "inventory_operatione"}
                        </ColumnTablePopup>
                    </HeaderTablePopup>
                    {isState.onFetching ? (
                        <Loading className="max-h-40 2xl:h-[160px]" color="#0f4f9e" />
                    ) : findValue.arrayItem && findValue.arrayItem?.length > 0 ? (
                        <>
                            <Customscrollbar className="min-h-[300px] max-h-[300px] overflow-hidden">
                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                    {findValue.arrayItem?.map((e, index) => (
                                        <div
                                            className="grid items-center grid-cols-13 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                            key={e?.id?.toString()}
                                        >
                                            <h6 className="text-[13px] flex items-center font-medium py-1 col-span-3 text-left">
                                                {!e?.child && (
                                                    <button
                                                        className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                        onClick={() => {
                                                            handleIncrease(e);
                                                        }}
                                                    >
                                                        <Add size="20" />
                                                    </button>
                                                )}
                                                {e?.child && <IconDown className="rotate-45" />}
                                                <div className={`flex items-center gap-2`}>
                                                    <div>
                                                        {e?.item?.image != null ? (
                                                            <ModalImage
                                                                small={e?.item?.image}
                                                                large={e?.item?.image}
                                                                alt="Product Image"
                                                                className="custom-modal-image object-cover rounded w-[50px] h-[50px] mx-auto"
                                                            />
                                                        ) : (
                                                            <div className="w-[50px] h-[50px] object-cover  mx-auto">
                                                                <ModalImage
                                                                    small="/no_img.png"
                                                                    large="/no_img.png"
                                                                    className="object-contain w-full h-full p-1 rounded"
                                                                ></ModalImage>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                            {e?.item?.name}
                                                        </h6>
                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                            {e?.item?.variation}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </h6>
                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                {e?.unit}
                                            </h6>
                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                {e?.quantityNeed == 0 ? "-" : e?.quantityNeed}
                                            </h6>
                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                {e?.quantityKeepp == 0 ? "-" : e?.quantityKeepp}
                                            </h6>
                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                {e?.quantityInventory == 0 ? "-" : e?.quantityInventory}
                                            </h6>
                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-2  rounded-md text-center break-words">
                                                <Controller
                                                    name={`arrayItem.${index}.valueWarehouse`}
                                                    control={form.control}
                                                    rules={{
                                                        required: {
                                                            value: findValue.arrayItem.find((x) => x?.id == e?.id)?.valueWarehouse ? false : true,
                                                            message: dataLang?.materials_planning_pease_select_warehouse || "materials_planning_pease_select_warehouse",
                                                        },
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        const arrWareHouse = findValue.arrayItem.find((x) => x?.id == e?.id)?.warehouse;
                                                        return (
                                                            <>
                                                                <SelectComponent
                                                                    className={`${fieldState.error ? "border-red-500" : "border-gray-400"} border  rounded`}
                                                                    isClearable={true}
                                                                    placeholder={dataLang?.salesOrder_select_warehouse || "salesOrder_select_warehouse"}
                                                                    options={arrWareHouse}
                                                                    formatOptionLabel={(option) => (
                                                                        <div className="flex justify-start items-center gap-1 z-[99]">
                                                                            <h2>{option?.label}</h2>
                                                                            <h2>{`(${dataLang?.materials_planning_exist || "materials_planning_exist"}: ${option?.value})`}</h2>
                                                                        </div>
                                                                    )}
                                                                    {...field}
                                                                    onChange={(event) => {
                                                                        const check = findValue.arrayItem.some((x) => x?.valueWarehouse?.id == event?.id);
                                                                        if (check) {
                                                                            return isShow("error", dataLang?.materials_planning_warehouse_has_been_selected || "materials_planning_warehouse_has_been_selected");
                                                                        }

                                                                        fetchListLocationWarehouse(e, event?.id);
                                                                        field.onChange(event);
                                                                    }}
                                                                    styles={{
                                                                        menu: (provided, state) => ({
                                                                            ...provided,
                                                                            width: "150%",
                                                                            zIndex: 999,
                                                                        }),
                                                                    }}
                                                                    value={
                                                                        findValue.arrayItem.find(
                                                                            (x) => x?.id == e?.id
                                                                        )?.valueWarehouse
                                                                    }
                                                                    maxMenuHeight={150}
                                                                />
                                                                {fieldState.error && (
                                                                    <span className="text-[12px]  text-red-500">
                                                                        {fieldState.error.message}{" "}
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                    }}
                                                />
                                            </h6>
                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-3 grid grid-cols-1 gap-2  rounded-md text-center break-words">
                                                <Controller
                                                    name={`arrayItem.${index}.valueLocation`}
                                                    control={form.control}
                                                    render={({ field, fieldState }) => {
                                                        const arrWareHouse = findValue.arrayItem.find((x) => x?.id == e?.id)?.warehouseLocation;
                                                        return arrWareHouse?.map((x, Iindex) => {
                                                            return (
                                                                <Controller
                                                                    name={`arrayItem.${index}.valueLocation.${Iindex}`}
                                                                    control={form.control}
                                                                    rules={{
                                                                        required: {
                                                                            value: x.show,
                                                                            message: dataLang?.materials_planning_enter_quantity || "materials_planning_enter_quantity",
                                                                        },
                                                                        validate: {
                                                                            fn: (value) => {
                                                                                try {
                                                                                    let mss = "";
                                                                                    if (x.show && value.newValue == null) {
                                                                                        mss = dataLang?.materials_planning_enter_quantity || "materials_planning_enter_quantity";
                                                                                    }
                                                                                    if (x.show && value.newValue == 0) {
                                                                                        mss = dataLang?.materials_planning_must_be_greater || "materials_planning_must_be_greater";
                                                                                    }
                                                                                    return mss || true;
                                                                                } catch (error) {
                                                                                    throw error;
                                                                                }
                                                                            },
                                                                        },
                                                                    }}
                                                                    render={({ field, fieldState }) => {

                                                                        return (
                                                                            <div
                                                                                key={x.idFe}
                                                                                className="w-full  z-[99]"
                                                                            >
                                                                                <Zoom>
                                                                                    <div
                                                                                        onClick={() =>
                                                                                            handleShow(e.id, x.idFe)
                                                                                        }
                                                                                        className={`border-gray-400  w-full text-[10px] font-medium bg-white hover:bg-gray-100 transition-all ease-in-out  border rounded-2xl py-1 px-2 flex items-center gap-1`}
                                                                                    >
                                                                                        <div>
                                                                                            {x.show ? (
                                                                                                <TickCircle
                                                                                                    className="bg-blue-600 rounded-full "
                                                                                                    color="white"
                                                                                                    size={15}
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="w-4 h-4 bg-transparent border border-gray-300 rounded-full" />
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex flex-col items-start jus">
                                                                                            <h3>
                                                                                                {x.label} -
                                                                                                <span className="pl-1 text-blue-500">
                                                                                                    {x.value}
                                                                                                </span>
                                                                                            </h3>
                                                                                            <div className="flex flex-wrap items-center font-oblique">
                                                                                                {dataProductSerial.is_enable === "1" && (
                                                                                                    <div className="flex gap-0.5">
                                                                                                        <h6 className="text-[8px]">
                                                                                                            Serial:
                                                                                                        </h6>
                                                                                                        <h6 className="text-[9px] px-1  w-[full] text-left ">
                                                                                                            {x.serial == null || x.serial == "" ? "-" : x?.serial}
                                                                                                        </h6>
                                                                                                    </div>
                                                                                                )}
                                                                                                {(dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1") && (
                                                                                                    <>
                                                                                                        <div className="flex gap-0.5">
                                                                                                            <h6 className="text-[8px]">
                                                                                                                Lot:
                                                                                                            </h6>{" "}
                                                                                                            <h6 className="text-[9px] px-1  w-[full] text-left ">
                                                                                                                {x.lot == null || x.lot == "" ? "-" : x?.lot}
                                                                                                            </h6>
                                                                                                        </div>
                                                                                                        <div className="flex gap-0.5">
                                                                                                            <h6 className="text-[8px]">
                                                                                                                Date:
                                                                                                            </h6>{" "}
                                                                                                            <h6 className="text-[9px] px-1  w-[full] text-center ">
                                                                                                                {x?.expiration_date ? formatMoment(x?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                                                            </h6>
                                                                                                        </div>
                                                                                                    </>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Zoom>
                                                                                {/* {console.log(e)
                                                                                } */}
                                                                                {x.show && (
                                                                                    <InPutNumericFormat
                                                                                        className={`py-1 px-2 my-1 ${fieldState.error
                                                                                            ? "border-red-500"
                                                                                            : "border-gray-400"
                                                                                            }  border outline-none rounded-3xl w-full`}
                                                                                        {...field}
                                                                                        onValueChange={(event) =>
                                                                                            field.onChange({
                                                                                                newValue: event.value == "" ? null : event.value,
                                                                                                ...x,
                                                                                            })
                                                                                        }
                                                                                        value={x?.newValue}
                                                                                        // value={field.value?.newValue}
                                                                                        isAllowed={(values) => {
                                                                                            const { floatValue, value, } = values;
                                                                                            if (floatValue == 0) {
                                                                                                return true;
                                                                                            }
                                                                                            if (floatValue > x.value) {
                                                                                                isShow("warning", `${dataLang?.materials_planning_llease_enter || "materials_planning_llease_enter"} ${formatNumber(x.value)}`);
                                                                                                return false;
                                                                                            }
                                                                                            if (floatValue < 0) {
                                                                                                isShow("warning", dataLang?.materials_planning_please_enter_greater || "materials_planning_please_enter_greater");
                                                                                                return false;
                                                                                            }
                                                                                            return true;
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                {x.show && fieldState.error && (
                                                                                    <span className="text-[12px]  text-red-500">
                                                                                        {fieldState.error.message}{" "}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }}
                                                                />
                                                            );
                                                        });
                                                    }}
                                                />
                                            </h6>
                                            <div className="flex items-center justify-center col-span-1">
                                                <button
                                                    onClick={(event) => removeItem(e.id)}
                                                    type="button"
                                                    title="Xóa"
                                                    className="transition w-[40px] h-10 rounded-[5.5px] hover:text-red-600 text-red-500 flex flex-col justify-center items-center"
                                                >
                                                    <IconDelete />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Customscrollbar>
                        </>
                    ) : (
                        <NoData />
                    )}
                    <div className="mt-5 space-x-2 text-right">
                        <ButtonCancel
                            loading={false}
                            onClick={() => _ToggleModal(false)}
                            dataLang={dataLang}
                        />
                        <ButtonSubmit
                            loading={hangdingMutation.isPending}
                            dataLang={dataLang}
                            onClick={() => form.handleSubmit((data) => onSubmit(data))()}
                        />

                    </div>
                </div>
            </div>
        </PopupCustom>
    );
};

export default PopupKeepStock;
