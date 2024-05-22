import { useEffect, useState } from "react";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupEdit from "@/components/UI/popup";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { Add, Trash as IconDelete, ArrowDown2 as IconDown, TickCircle } from "iconsax-react";
import moment from "moment";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { BsCalendarEvent } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import ModalImage from "react-modal-image";
import { v4 as uuidv4 } from "uuid";
import { _ServerInstance as Axios } from "/services/axios";
const PopupKeepStock = ({ dataLang, icon, title, dataTable, className, ...rest }) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()

    const _ToggleModal = (e) => sOpen(e);

    const initialState = {
        onFetching: false,
        type: [
            {
                id: uuidv4(),
                label: "Bán thành phẩm",
                value: "product",
            },
            {
                id: uuidv4(),
                label: "Nguyên vật liệu",
                value: "material",
            }
        ],
        arrayItem: []
    }

    const dataSeting = useSetingServer()

    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const shhowToat = useToast();

    const form = useForm({
        defaultValues: {
            date: new Date(),
            note: '',
            type: 'material',
            arrayItem: []
        }
    });

    /// lắng nghe thay đổi
    const findValue = form.watch()

    const onSubmit = async (value) => {
        if (value.arrayItem.length == 0) {
            return shhowToat('error', 'Không có mặt hàng cần giữ kho. Vui lòng thêm mặt hàng')
        }

        let formData = new FormData();
        formData.append('note', value.note)
        formData.append('type', value.type == "material" ? 1 : 2)
        formData.append('plan_id', dataTable?.listDataRight?.idCommand)
        formData.append('date', moment(value.date).format('DD/MM/YYYY'))
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
                formData.append(`items[${index}][location][${locaitonIndex}][location_value]`, i?.newValue);
                formData.append(`items[${index}][location][${locaitonIndex}][location_lot]`, i?.lot);
                formData.append(`items[${index}][location][${locaitonIndex}][location_expiration_date]`, i?.expiration_date);
                formData.append(`items[${index}][location][${locaitonIndex}][location_serial]`, i?.serial);
            })
        })
        Axios("POST", "/api_web/api_manufactures/handlingKeepProductionsPlan",
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const data = response.data;
                    if (data?.isSuccess) {
                        isShow('success', data?.message)
                        _ToggleModal(false)
                        form.reset()
                    } else {
                        isShow('error', data?.message)
                    }
                }
            }
        );
    }


    useEffect(() => {
        if (open) {
            form.setValue('arrayItem', [])
            fetchListItem()
        }
    }, [findValue.type, open])


    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    }

    const removeItem = (id) => {
        const updatedData = form.getValues("arrayItem").filter((item) => item.id !== id);
        form.setValue("arrayItem", updatedData);
    };

    const fetchListItem = async () => {
        queryState({ onFetching: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        let formData = new FormData()
        // type: 1 nvl, 2 BTP
        formData.append('type', findValue.type == "material" ? 1 : 2)
        formData.append('pPlan_id', dataTable.listDataRight.idCommand)
        Axios("POST", `/api_web/api_manufactures/keepItemsWarehouses`, {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message, data } = response?.data
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
                                    value: formatNumber(i?.quantity_warehouse)
                                }
                            }),
                            valueWarehouse: null,
                            warehouseLocation: [],
                            valueLocation: [],
                            itemVariationOptionValueId: e?.item_variation_option_value_id
                        }
                    })
                    form.setValue("arrayItem", newData);
                    queryState({ onFetching: false });
                }
            }
        );
    }
    const fetchListLocationWarehouse = async (item, idWarehouse) => {
        let formData = new FormData()
        formData.append('w_id', idWarehouse)
        formData.append('type_item', item?.item?.type)
        formData.append('item_variation_option_value_id', item.itemVariationOptionValueId)
        Axios("POST", `/api_web/api_manufactures/getLocationItemsWarehouse`, {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message, data } = response?.data
                    if (data?.locationsWarehouse) {
                        const newData = findValue.arrayItem.map((e) => {
                            if (e.id == item.id) {
                                return {
                                    ...e,
                                    warehouseLocation: data?.locationsWarehouse?.map((i) => {
                                        return {
                                            ...i,
                                            id: i?.location_id,
                                            label: i?.name_location,
                                            value: formatNumber(i?.quantity_warehouse),
                                            qty: formatNumber(i?.quantity_warehouse),
                                            show: false,
                                        }
                                    })
                                }
                            }
                            return e
                        })
                        form.setValue("arrayItem", newData);
                    }
                }
            }
        );
    }

    const handleShow = (idParent, idChild) => {
        const newData = findValue.arrayItem?.map((e) => {
            if (e?.id == idParent) {
                return {
                    ...e,
                    warehouseLocation: e.warehouseLocation?.map((i) => {
                        if (i.id == idChild) {
                            return {
                                ...i,
                                show: !i.show,
                            };
                        }
                        return i;
                    })
                }
            }
            return e;
        })
        form.setValue("arrayItem", newData);
    };

    const handleIncrease = (e) => {
        const newData = [...findValue.arrayItem
        ];
        const insertIndex = newData.findIndex(item => item.id === e?.id) + 1;
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
    }

    return (
        <>
            <PopupEdit
                title={'Giữ kho nguyên vật liệu'}
                button={
                    <button
                        className=" bg-[#F3F4F6] rounded-lg  outline-none focus:outline-none"
                        onClick={() => {
                            if (+dataTable?.countAll == 0) {
                                return isShow('error', 'Vui lòng thêm kế hoạch sản xuất')
                            }
                            _ToggleModal(true)
                        }}
                    >
                        <div className="flex items-center gap-2 py-2 px-3 ">
                            <Image height={16} width={16} src={icon} className="object-cover" />
                            <h3 className="text-[#141522] font-medium 3xl:text-base text-xs">
                                {title}
                            </h3>
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
                        <div className="col-span-4 flex flex-col">
                            <div className="text-[#344054] font-normal 3xl:text-[16px] text-sm mb-1 ">
                                Ngày giữ kho  <span className=" text-red-500">*</span>
                            </div>
                            <Controller
                                name="date"
                                control={form.control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Vui lòng chọn ngày giữ kho'
                                    }
                                }}
                                render={({ field, fieldState }) => {
                                    return (
                                        <>
                                            <div className="custom-date-picker flex flex-row  relative">
                                                <DatePicker
                                                    {...field}
                                                    ref={(ref) => {
                                                        if (ref !== null) {
                                                            field.ref({
                                                                focus: ref.setFocus
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
                                                    className={`border ${fieldState.error ? 'border-red-500' : 'border-[#d0d5dd]'} 3xl:text-sm 2xl:text-[13px] xl:text-[12px] text-[11px] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer relative`}
                                                />
                                                {
                                                    field.value && <MdClear
                                                        className="absolute right-10 top-1/2 -translate-y-1/2 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                                                        onClick={() => form.setValue('date', null)}
                                                    />
                                                }
                                                <BsCalendarEvent className="absolute right-5 top-1/2 -translate-y-1/2 text-[#CCCCCC] scale-110 cursor-pointer" />
                                            </div >
                                            {fieldState.error && <span className="text-[12px]  text-red-500">{fieldState.error.message} </span>}
                                        </>
                                    )
                                }}
                            />
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <div className="mt-6 flex items-centerem gap-8">
                                            {isState.type.map((e) => {
                                                return (
                                                    <div className="flex items-center cursor-pointer">
                                                        <input
                                                            id={e.value}
                                                            type="radio"
                                                            {...field}
                                                            checked={field.value === e.value}
                                                            onChange={() => field.onChange(e.value)}
                                                            className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2"
                                                        />
                                                        <label
                                                            htmlFor={e.value}
                                                            className="ml-2 cursor-pointer 3xl:text-sm text-xs font-medium text-[#52575E]"
                                                        >
                                                            {e.label}
                                                        </label>
                                                    </div >
                                                )
                                            })}
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        <div className="col-span-8">
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
                                    )
                                }}
                            />
                        </div>
                    </div >
                    <div className="3xl:w-[1300px] 2xl:w-[1150px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                        <HeaderTablePopup gridCols={13}>
                            <ColumnTablePopup colSpan={3}>
                                {dataLang?.price_quote_item || "price_quote_item"}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {'Đơn vị mua'}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {'SL Cần'}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {'SL Đã giữ'}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {"SL tồn kho"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={2}>
                                {dataLang?.salesOrder_warehouse || "salesOrder_warehouse"}
                            </ColumnTablePopup>
                            <ColumnTablePopup colSpan={3}>
                                {'Vị trí kho'}
                            </ColumnTablePopup>
                            <ColumnTablePopup>
                                {'Thao tác'}
                            </ColumnTablePopup>
                        </HeaderTablePopup>
                        {isState.onFetching ? (
                            <Loading className="max-h-40 2xl:h-[160px]" color="#0f4f9e" />
                        ) : findValue.arrayItem && findValue.arrayItem?.length > 0 ? (
                            <>
                                <Customscrollbar
                                    className="min-h-[300px] max-h-[300px] overflow-hidden"
                                >
                                    <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                        {findValue.arrayItem?.map((e, index) => (
                                            <div
                                                className="grid items-center grid-cols-13 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                                key={e?.id?.toString()}
                                            >

                                                <h6 className="text-[13px] flex items-center font-medium py-1 col-span-3 text-left">
                                                    {!e?.child &&
                                                        <button
                                                            className=" text-gray-400 hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-slate-200 rounded-full"
                                                            onClick={() => {
                                                                console.log(e)
                                                                handleIncrease(e);
                                                            }}
                                                        >
                                                            <Add size="20" />
                                                        </button>
                                                    }
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
                                                                        className="w-full h-full rounded object-contain p-1"
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
                                                                value: findValue.arrayItem.find(x => x?.id == e?.id)?.valueWarehouse ? false : true,
                                                                message: 'Vui lòng chọn kho'
                                                            },
                                                        }}
                                                        render={({ field, fieldState }) => {
                                                            const arrWareHouse = findValue.arrayItem.find(x => x?.id == e?.id)?.warehouse
                                                            return (
                                                                <>
                                                                    <SelectComponent
                                                                        className={`${fieldState.error ? 'border-red-500' : 'border-gray-400'} border  rounded`}
                                                                        isClearable={true}
                                                                        placeholder={dataLang?.salesOrder_select_warehouse || "salesOrder_select_warehouse"}
                                                                        options={arrWareHouse}
                                                                        formatOptionLabel={(option) => (
                                                                            <div className="flex justify-start items-center gap-1 z-[99]">
                                                                                <h2>{option?.label}</h2>
                                                                                <h2>{`(Tồn: ${option?.value})`}</h2>
                                                                            </div>
                                                                        )}
                                                                        {...field}
                                                                        onChange={(event) => {
                                                                            const check = findValue.arrayItem.some(x => x?.valueWarehouse?.id == event?.id)
                                                                            if (check) {
                                                                                return isShow("error", "Kho đã được chọn")
                                                                            }

                                                                            fetchListLocationWarehouse(e, event?.id)
                                                                            field.onChange(event)
                                                                        }
                                                                        }
                                                                        styles={{
                                                                            menu: (provided, state) => ({
                                                                                ...provided,
                                                                                width: "150%",
                                                                                zIndex: 999,
                                                                            }),
                                                                        }}
                                                                        value={findValue.arrayItem.find(x => x?.id == e?.id)?.valueWarehouse}
                                                                        maxMenuHeight={150}
                                                                    />
                                                                    {fieldState.error && <span className="text-[12px]  text-red-500">{fieldState.error.message} </span>}
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                </h6>
                                                <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-3 grid grid-cols-1 gap-2  rounded-md text-center break-words">
                                                    <Controller
                                                        name={`arrayItem.${index}.valueLocation`}
                                                        control={form.control}
                                                        render={({ field, fieldState }) => {
                                                            const arrWareHouse = findValue.arrayItem.find(x => x?.id == e?.id)?.warehouseLocation
                                                            return (
                                                                arrWareHouse?.map((x, Iindex) => {
                                                                    return (
                                                                        <Controller
                                                                            name={`arrayItem.${index}.valueLocation.${Iindex}`}
                                                                            control={form.control}
                                                                            rules={{
                                                                                required: {
                                                                                    value: x.show,
                                                                                    message: 'Nhập số lượng'
                                                                                },
                                                                                validate: {
                                                                                    fn: (value) => {
                                                                                        try {
                                                                                            let mss = ''
                                                                                            if (x.show && value.newValue == null) {
                                                                                                mss = 'Nhập số lượng'
                                                                                            }
                                                                                            if (x.show && value.newValue == 0) {
                                                                                                mss = 'Số lượng phải lớn hơn 0'
                                                                                            }
                                                                                            return mss || true;
                                                                                        } catch (error) {
                                                                                            throw error;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }}
                                                                            render={({ field, fieldState }) => {
                                                                                return (
                                                                                    <div
                                                                                        key={x.id}
                                                                                        className="w-full  z-[99]"
                                                                                    >
                                                                                        <Zoom>
                                                                                            <div
                                                                                                onClick={() => handleShow(e.id, x.id)}
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
                                                                                                        <div className="h-4 w-4 rounded-full bg-transparent border border-gray-300" />
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex flex-col items-start jus">
                                                                                                    <h3>
                                                                                                        {x.label} -
                                                                                                        <span className="text-blue-500 pl-1">
                                                                                                            {x.value}
                                                                                                        </span>
                                                                                                    </h3>
                                                                                                    <div className="flex items-center font-oblique flex-wrap">
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
                                                                                                                        {x?.expiration_date ? moment(x?.expiration_date).format("DD/MM/YYYY") : "-"}
                                                                                                                    </h6>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                        </Zoom>
                                                                                        {
                                                                                            x.show &&
                                                                                            <InPutNumericFormat
                                                                                                className={`py-1 px-2 my-1 ${fieldState.error ? 'border-red-500' : 'border-gray-400'}  border outline-none rounded-3xl w-full`}
                                                                                                {...field}
                                                                                                onChange={(event) =>
                                                                                                    field.onChange({
                                                                                                        newValue: event.target.value == '' ? null : event.target.value,
                                                                                                        ...x
                                                                                                    })
                                                                                                }
                                                                                                value={field.value?.newValue}
                                                                                                isAllowed={(values) => {
                                                                                                    const { floatValue, value } = values;
                                                                                                    if (floatValue == 0) {
                                                                                                        return true;
                                                                                                    }
                                                                                                    if (floatValue > x.value) {
                                                                                                        isShow('warning', `Vui lòng nhập số nhỏ hơn hoặc bằng ${formatNumber(x.value)}`);
                                                                                                        return false
                                                                                                    }
                                                                                                    if (floatValue < 0) {
                                                                                                        isShow('warning', 'Vui lòng nhập lớn hơn 0');
                                                                                                        return false
                                                                                                    }
                                                                                                    return true
                                                                                                }}
                                                                                            />
                                                                                        }
                                                                                        {x.show && fieldState.error && <span className="text-[12px]  text-red-500">{fieldState.error.message} </span>}
                                                                                    </div>
                                                                                )
                                                                            }}

                                                                        />

                                                                    )
                                                                })
                                                            )
                                                        }}
                                                    />

                                                </h6>
                                                <div className="col-span-1 flex items-center justify-center">
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
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="button"
                                onClick={() => form.handleSubmit((data) => onSubmit(data))()}
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </div>
                </div >
            </PopupEdit >
        </>
    );
};

export default PopupKeepStock