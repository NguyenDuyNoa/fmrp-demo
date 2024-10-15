import { useEffect, useState } from "react";

import apiMaterialsPlanning from "@/Api/apiManufacture/manufacture/materialsPlanning/apiMaterialsPlanning";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { Trash as IconDelete } from "iconsax-react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import ModalImage from "react-modal-image";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import ButtonCancel from "@/components/UI/button/buttonCancel";

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
    purchaseName: "Yêu cầu mua hàng (PR)",
    arrayItem: [],
}

const PopupPurchase = ({ dataLang, icon, title, dataTable, className, queryValue, fetchDataTable, ...rest }) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const dataSeting = useSetingServer();

    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const form = useForm({ defaultValues: { ...initForm } });

    /// lắng nghe thay đổi
    const findValue = form.watch();

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
            // type_object: 2 YCMH
            formData.append("type_object", 2);
            formData.append("type", findValue.type == "material" ? 1 : 2);
            formData.append("pPlan_id", dataTable.listDataRight.idCommand);
            const { isSuccess, message, data } = await apiMaterialsPlanning.apiKeepItemsWarehouses(formData);
            const newData = data?.items?.map((e) => {
                return {
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
                    // sl giữ
                    quantityKeepp: formatNumber(e?.quantity_keep),
                    // sl còn lại
                    quantityRest: formatNumber(e?.quantity_rest),
                    // sl đã mua
                    quantityPurchased: e?.quantity_purchase,
                    quantity: formatNumber(e?.quantity_rest - e?.quantity_purchase) > 0 ? formatNumber(e?.quantity_rest - e?.quantity_purchase) : e?.quantity_rest,
                    itemVariationOptionValueId: e?.item_variation_option_value_id,
                };
            });
            form.setValue("arrayItem", newData);
            queryState({ onFetching: false });
        } catch (error) {
            throw new error
        }
    };

    useEffect(() => {
        if (open) {
            form.setValue("arrayItem", []);
            fetchListItem();
        }
    }, [findValue.type, open]);

    const hangdingMutation = useMutation({
        mutationFn: async (data) => {
            return await apiMaterialsPlanning.apiHandlingPurchaseProductionPlan(data);
        }
    })

    const onSubmit = async (value) => {
        if (value.arrayItem.length == 0) {
            return shhowToat("error", dataLang?.materials_planning_no_items_purchase || "materials_planning_no_items_purchase");
        }

        let formData = new FormData();
        formData.append("note", value.note);
        formData.append("name", value.purchaseName);
        formData.append("type", value.type == "material" ? 1 : 2);
        formData.append("plan_id", dataTable?.listDataRight?.idCommand);
        formData.append("date", formatMoment(value.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG));
        value.arrayItem.forEach((e, index) => {
            formData.append(`items[${index}][id]`, e?.idParent);
            formData.append(`items[${index}][quantity]`, parseFloat(e?.quantity.replace(/,/g, '')));
            formData.append(`items[${index}][item_id]`, e?.item?.item_id);
            formData.append(`items[${index}][item_variation_option_value_id]`, e?.itemVariationOptionValueId);
        });

        hangdingMutation.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow("success", message);
                    queryValue({ page: 1 });
                    fetchDataTable(1);
                    _ToggleModal(false);
                    form.reset();
                    return
                }
                isShow("error", message);
            }
        });

    };
    return (
        <>
            <PopupCustom
                title={dataLang?.materials_planning_add_purchase || "materials_planning_add_purchase"}
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
                    <div className="grid grid-cols-12 gap-4">
                        <div className="flex flex-col col-span-4">
                            <div className="text-[#344054] font-normal 3xl:text-[16px] text-sm mb-1 ">
                                {dataLang?.materials_planning_date_purchase || "materials_planning_date_purchase"}{" "}
                                <span className="text-red-500 ">*</span>
                            </div>
                            <Controller
                                name="date"
                                control={form.control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: dataLang?.materials_planning_pease_select_purchase || "materials_planning_pease_select_purchase",
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
                                                    showTimeSelect
                                                    selected={field.value}
                                                    placeholderText="DD/MM/YYYY HH:mm:ss"
                                                    dateFormat="dd/MM/yyyy h:mm:ss aa"
                                                    timeInputLabel={"Time: "}
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
                                            {isState.type.map((e, index) => {
                                                return (
                                                    <div key={index} className="flex items-center cursor-pointer">
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
                        <div className="col-span-4">
                            <div className="text-[#344054] font-normal 3xl:text-[16px] text-sm mb-1 ">
                                {dataLang?.purchase_name || "purchase_name"} <span className="text-red-500 ">*</span>
                            </div>
                            <Controller
                                name="purchaseName"
                                rules={{
                                    required: {
                                        value: true,
                                        message: dataLang?.materials_planning_enter_ticket || "materials_planning_enter_ticket",
                                    },
                                }}
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <>
                                            <input
                                                {...field}
                                                name="fname"
                                                type="text"
                                                placeholder={dataLang?.purchase_name || "purchase_name"}
                                                className={`${fieldState.error
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
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
                        </div>
                        <div className="col-span-4">
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
                        <HeaderTablePopup gridCols={12}>
                            <ColumnTablePopup colSpan={4}>
                                {dataLang?.price_quote_item || "price_quote_item"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={1}>
                                {dataLang?.materials_planning_dvt || "materials_planning_dvt"}
                            </ColumnTablePopup>

                            <ColumnTablePopup colSpan={2}>
                                {dataLang?.materials_planning_qty_need_by || "materials_planning_qty_need_by"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={2}>
                                {dataLang?.materials_planning_qty_requested || "materials_planning_qty_requested"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={2}>
                                {dataLang?.materials_planning_qty_buys || "materials_planning_qty_buys"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={1}>
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
                                                key={e?.id?.toString()}
                                                className="grid items-center grid-cols-12 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                            >
                                                <h6 className="text-[13px] flex items-center font-medium py-1 col-span-4 text-left">
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
                                                {/* <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-2  rounded-md text-center break-words">
                                                    {e?.quantityKeepp == 0 ? "-" : e?.quantityKeepp}
                                                </h6> */}
                                                <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-2  rounded-md text-center break-words">
                                                    {e?.quantityRest == 0 ? "-" : e?.quantityRest}
                                                </h6>
                                                <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-2  rounded-md text-center break-words">
                                                    {e?.quantityPurchased == 0 ? "-" : e?.quantityPurchased}
                                                </h6>
                                                <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-2  rounded-md text-center break-words">
                                                    <Controller
                                                        name={`arrayItem.${index}.quantity`}
                                                        control={form.control}
                                                        rules={{
                                                            required: {
                                                                value: true,
                                                                message: dataLang?.materials_planning_enter_quantity || "materials_planning_enter_quantity",
                                                            },
                                                            validate: {
                                                                fn: (value) => {
                                                                    try {
                                                                        let mss = "";
                                                                        if (value == null) {
                                                                            mss = dataLang?.materials_planning_enter_quantity || "materials_planning_enter_quantity";
                                                                        }
                                                                        if (value == 0) {
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
                                                                <duv className="flex flex-col items-center justify-center">
                                                                    <InPutNumericFormat
                                                                        className={`${fieldState.error && "border-red-500"} cursor-default appearance-none text-center 3xl:text-[13px] 2xl:text-[12px] xl:text-[11px] text-[10px] py-1 px-0.5 font-normal 2xl:w-24 xl:w-[90px] w-[63px]  focus:outline-none border-b-2 border-gray-200`}
                                                                        {...field}
                                                                        onValueChange={(event) =>
                                                                            field.onChange(event.value == "" ? null : +event.value)
                                                                        }
                                                                        isAllowed={(values) => {
                                                                            // const { floatValue, value } = values;
                                                                            // if (floatValue == 0) {
                                                                            //     return true;
                                                                            // }
                                                                            // if (floatValue > x.value) {
                                                                            //     isShow('warning', `Vui lòng nhập số nhỏ hơn hoặc bằng ${formatNumber(x.value)}`);
                                                                            //     return false
                                                                            // }
                                                                            // if (floatValue < 0) {
                                                                            //     isShow('warning', 'Vui lòng nhập lớn hơn 0');
                                                                            //     return false
                                                                            // }
                                                                            return true;
                                                                        }}
                                                                    />
                                                                    {fieldState.error && (
                                                                        <span className="text-[12px]  text-red-500">
                                                                            {fieldState.error.message}{" "}
                                                                        </span>
                                                                    )}
                                                                </duv>
                                                            );
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
        </>
    );
};

export default PopupPurchase;
