import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash as IconDelete } from "iconsax-react";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import { RiBox3Fill } from "react-icons/ri";

const initilaState = {
    open: false,
    item: { bom: [] },
    dtPoi: {},
    dtPois: {},
    warehouseImport: [],
    warehouseExport: [],
    idWarehouseExport: [],
    idWarehouseImport: null,
    errorWarehouseImport: false,
    errorWarehouseExport: false
};

const PopupImportProducts = memo(({ dataLang, dataDetail, type, dataStage, ...props }) => {
    const isShow = useToast();

    const queryClient = useQueryClient()

    const dataSeting = useSetingServer()

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const formanumber = (num) => formatNumberConfig(+num, dataSeting)

    const handingPopup = useMutation({
        mutationFn: (data) => {
            if (type == "begin_production") {
                return apiProductionsOrders.apiAgreeProcess(data)
            }
            if (type == "end_production") {
                return apiProductionsOrders.apiHandingProducts(data)
            }
        }
    })

    const { isLoading } = useQuery({
        queryKey: ["api_data_products"],
        queryFn: async () => {
            let formData = new FormData();
            formData.append('poi_id', dataStage?.poi_id);
            formData.append('pois_id', dataStage?.id);
            formData.append('type', dataStage?.type);
            formData.append('bom_id', dataStage?.bom_id);
            const { data, ...res } = await apiProductionsOrders.apiDataProducts(formData);

            const newData = {
                warehouseImport: data?.warehouses?.map(e => {
                    return {
                        value: e?.id,
                        label: e?.name
                    }
                }),
                warehouseExport: data?.warehouses_export?.map(e => {
                    return {
                        value: e?.id,
                        label: e?.name
                    }
                }),
                dtPois: data?.product?.dtPois,
                dtPoi: data?.dtPoi,
                item: {
                    ...data?.product?.item,
                    quantityDefault: data?.product?.item?.quantity,
                    image: data?.product?.item?.item_image ?? '/no_img.png',
                    bom: data?.product?.item?.bom?.map(e => {
                        return {
                            ...e,
                            quantity: e?.quantity_total_quota,
                            image: e?.images ? e?.images : "/no_img.png",
                        }
                    })
                }
            }
            queryState({ ...newData })
            return newData
        },
        enabled: isState.open && type === 'end_production' ? true : false,
    })

    const handChangeQuantityParent = (value) => {
        queryState({
            item: {
                ...isState.item,
                quantity: formanumber(value?.value),
                quantityEnter: formanumber(value?.value),
                bom: isState.item?.bom?.map(e => {
                    return {
                        ...e,
                        // Số lượng thành phẩm nhân cho định mức bao gồm bù hao
                        quantity: formanumber((+value?.value * +e?.quota) * (1 + (+e?.loss / 100)))
                    }
                })
            }
        })
    }

    const handChangeQuantity = (value, id) => {
        queryState({
            item: {
                ...isState.item,
                bom: isState.item?.bom?.map(e => {
                    if (e?.item_id == id) {
                        return {
                            ...e,
                            quantity: formanumber(+value?.value),
                        }
                    }
                    return e
                })
            }
        })
    };

    const handleDeleteItem = (id) => {
        queryState({
            item: {
                ...isState.item,
                bom: isState.item?.bom?.filter((e) => e?.item_id != id),
            }
        });
    };

    useEffect(() => {
        queryState({ errorWarehouseImport: false })
    }, [isState.idWarehouseImport])

    useEffect(() => {
        queryState({ errorWarehouseExport: false })
    }, [isState.idWarehouseExport])

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            let formData = new FormData()
            if (type == "begin_production") {
                formData.append('pois_id', dataStage?.id)
                formData.append('status', 1)
                formData.append('type_event', type)
                handingPopup.mutate(formData, {
                    onSuccess: ({ isSuccess, message }) => {
                        isShow("success", message)
                        queryState({ open: false })
                        queryClient.invalidateQueries('apiItemOrdersDetail');
                    },
                    onError: (error) => {
                        throw new Error(error);
                    },
                })
            }

            if (type == "end_production") {
                if (!isState.idWarehouseImport || isState.idWarehouseExport?.length == 0) {
                    queryState({
                        errorWarehouseImport: !isState.idWarehouseImport,
                        errorWarehouseExport: isState.idWarehouseExport?.length == 0
                    })
                    isShow('error', 'Vui lòng kiểm tra dữ liệu!')
                    return
                }

                formData.append("warehouse_import_id", isState.idWarehouseImport?.value ?? "")
                isState.idWarehouseExport.forEach((e, index) => {
                    formData.append(`warehouse_export_id[]`, e?.value)
                })
                formData.append("product[item][poi_id]", isState?.item?.poi_id)
                formData.append("product[item][product_id]", isState?.item?.product_id)
                formData.append("product[item][item_code]", isState?.item?.item_code)
                formData.append("product[item][item_name]", isState?.item?.item_name)
                formData.append("product[item][item_variation_id]", isState?.item?.item_variation_id)
                formData.append("product[item][type_products]", isState?.item?.type_products)
                formData.append("product[item][quantity]", isState?.item?.quantity)
                formData.append("product[item][item_image]", isState?.item?.item_image)
                formData.append("product[item][product_variation]", isState?.item?.product_variation)
                formData.append("product[item][quantity_enter]", isState?.item?.quantity || isState?.item?.quantityEnter)

                isState.item?.bom?.forEach((e, index) => {
                    formData.append(`product[item][bom][${index}][type_products]`, e?.type_products)
                    formData.append(`product[item][bom][${index}][type_item]`, e?.type_item)
                    formData.append(`product[item][bom][${index}][item_id]`, e?.item_id)
                    formData.append(`product[item][bom][${index}][item_variation_option_value_id]`, e?.item_variation_option_value_id)
                    formData.append(`product[item][bom][${index}][item_code]`, e?.item_code)
                    formData.append(`product[item][bom][${index}][item_name]`, e?.item_name)
                    formData.append(`product[item][bom][${index}][unit_name]`, e?.unit_name)
                    formData.append(`product[item][bom][${index}][unit_name_primary]`, e?.unit_name_primary)
                    formData.append(`product[item][bom][${index}][unit_id]`, e?.unit_id)
                    formData.append(`product[item][bom][${index}][unit_parent_id]`, e?.unit_parent_id)
                    formData.append(`product[item][bom][${index}][quota]`, e?.quota)
                    formData.append(`product[item][bom][${index}][loss]`, e?.loss)
                    formData.append(`product[item][bom][${index}][quota_exchange]`, e?.quota_exchange)
                    formData.append(`product[item][bom][${index}][quantity_total_quota]`, e?.quantity_total_quota)
                    formData.append(`product[item][bom][${index}][quantity_quota_primary]`, e?.quantity_quota_primary)
                    formData.append(`product[item][bom][${index}][images]`, e?.image)
                    formData.append(`product[item][bom][${index}][product_variation]`, e?.product_variation)
                    formData.append(`product[item][bom][${index}][quantity_enter]`, e?.quantity)
                    formData.append(`product[item][bom][${index}][quantity_warehouse]`, e?.quantity_warehouse)
                })

                formData.append("product[dtPois][pois_id]", isState?.dtPois?.pois_id)
                formData.append("product[dtPois][stage_id]", isState?.dtPois?.stage_id)
                formData.append("product[dtPois][number]", isState?.dtPois?.number)
                formData.append("product[dtPois][final_stage]", isState?.dtPois?.final_stage)
                formData.append("product[dtPois][bom_id]", isState?.dtPois?.bom_id)
                formData.append("product[dtPois][name_stage]", isState?.dtPois?.name_stage)

                formData.append("dtPoi[poi_id]", isState?.dtPoi?.poi_id)
                formData.append("dtPoi[branch_id]", isState?.dtPoi?.branch_id)
                formData.append("dtPoi[reference_no_po]", isState?.dtPoi?.reference_no_po)
                formData.append("dtPoi[reference_no_detail]", isState?.dtPoi?.reference_no_detail)
                formData.append("dtPoi[pp_id]", isState?.dtPoi?.pp_id)

                handingPopup.mutate(formData, {
                    onSuccess: (data) => {
                        if (data?.isSuccess) {
                            isShow('success', data?.message)
                            queryClient.invalidateQueries(["api_item_orders_detail", true])
                            queryState({
                                open: false,
                                idWarehouseExport: [],
                                idWarehouseImport: null,
                                errorWarehouseImport: false,
                                errorWarehouseExport: false
                            })
                            return
                        }
                        isShow('error', data?.message)
                    },
                    onError: (error) => {
                        throw new Error(error);
                    },
                })
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <PopupCustom
            title={type === "begin_production" ? "Bạn có muốn bắt đầu sản xuất công đoạn này ?" : `Hoàn thành công đoạn ${dataStage?.stage_name?.toUpperCase()}`}
            button={props.children}
            onClickOpen={() => {
                if (type == 'begin_production' && dataStage?.begin_production == 1) {
                    return isShow("error", "Công đoạn đã bắt đầu sản xuất")
                }
                // if (type == 'end_production' && dataStage?.begin_production == 1) {
                //     return isShow("error", "Công đoạn đã hoàn thành")
                // }
                queryState({ open: true })
            }}
            lockScroll={true}
            open={isState.open}
            onClose={() => {
                queryState({
                    open: false,
                    idWarehouseExport: [],
                    idWarehouseImport: null,
                    errorWarehouseImport: false,
                    errorWarehouseExport: false
                })
            }}
            classNameBtn={`${props?.className}`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            <div className={`${type === "begin_production" ? "w-[500px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto" : "3xl:w-[1100px] 2xl:w-[900px] xl:w-[800px] w-[700px] h-[575px]"} `}>
                {
                    type == 'end_production' &&
                    <>
                        <div className="flex flex-col w-full gap-2">
                            <div className="flex items-center gap-2 bg-[#EEF1FC] p-3 rounded-lg">
                                <RiBox3Fill className="text-[#5770F7]" size={20} />
                                <h2 className="font-medium  uppercase text-[#5770F7] 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                                    Thành phẩm
                                </h2>
                            </div>
                            <div className="flex bg-[#F8FAFC] p-3 rounded-sm">
                                <div className="w-[45%] 2xl:w-[45%] lg:w-[40%] flex items-center gap-3">
                                    <div className="min-h-[44px] h-11 w-11 min-w-[44px]  rounded-md">
                                        <Image
                                            src={isState.item.image}
                                            width={1280}
                                            height={1024}
                                            alt="@image tp"
                                            className="object-cover w-full h-full rounded-md"
                                        />
                                    </div>
                                    <div className="">
                                        <h1 className="text-base font-medium">
                                            {isState.item.item_name}
                                        </h1>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-xs font-medium 2xl:text-sm text-black/60">
                                                {isState.item.item_code} - Cần SX: <span className="font-medium text-black">{formanumber(isState.item.quantityDefault)}</span>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[55%] 2xl:w-[55%] lg:w-[60%] flex items-center gap-2">
                                    <div className="flex items-center justify-center w-1/2 gap-2">
                                        <h1 className="text-xs font-medium 2xl:text-sm">Số lượng hoàn thành</h1>
                                        <div className="bg-[#BAD1FE] rounded-xl flex justify-center items-center py-[1px]">
                                            <InPutNumericFormat
                                                className={'border-2 text-right py-1.5 px-2 text-base focus:outline-none border-[#BAD1FE] bg-white w-[70%]'}
                                                placeholder={'0'}
                                                isAllowed={(values) => {
                                                    const { floatValue, value } = values;
                                                    if (floatValue == 0) {
                                                        return true;
                                                    }
                                                    if (floatValue < 0) {
                                                        isShow('warning', 'Vui lòng nhập lớn hơn 0');
                                                        return false
                                                    }
                                                    return true
                                                }}
                                                onValueChange={(value) => {
                                                    handChangeQuantityParent(value)
                                                }}
                                                value={isState.item.quantity}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <SelectCore
                                            options={isState.warehouseImport}
                                            onChange={(e) => {
                                                queryState({ idWarehouseImport: e });
                                            }}
                                            value={isState.idWarehouseImport}
                                            isClearable={true}
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            placeholder={'Kho nhập'}
                                            className={`${isState.errorWarehouseImport ? 'border-[#FF0000]' : 'border-[#d0d5dd]'} placeholder:text-slate-300 w-full z-50 rounded-xl bg-[#ffffff] text-[#52575E] font-normal outline-none border `}
                                            isSearchable={true}
                                            style={{
                                                border: "none",
                                                boxShadow: "none",
                                                outline: "none",
                                            }}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#EBF5FF",
                                                    primary50: "#92BFF7",
                                                    primary: "#0F4F9E",
                                                },
                                                borderRadius: "12px",
                                            })}
                                            styles={{
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#cbd5e1",
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    zIndex: 9999, // Giá trị z-index tùy chỉnh
                                                }),
                                                control: (base, state) => ({
                                                    ...base,
                                                    boxShadow: "none",
                                                    padding: "2.7px",
                                                    ...(state.isFocused && {
                                                        border: "0 0 0 1px #92BFF7",
                                                        borderRadius: "12px",
                                                    }),
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#FCF3EE] p-3 rounded-lg">
                                <FaBox className="text-[#FF641C]" size={16} />
                                <h2 className="font-medium  uppercase text-[#FF641C] 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                                    Nguyên vật liệu
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="">
                                    <label className="text-[#344054] font-normal 2xl:text-sm text-xs mb-1 ">
                                        Chọn kho xuất
                                        <span className="pl-1 text-red-500">*</span>
                                    </label>
                                    <SelectCore
                                        options={isState.warehouseExport}
                                        onChange={(e) => {
                                            queryState({ idWarehouseExport: e });
                                        }}
                                        components={{ MultiValue }}
                                        maxShowMuti={1}
                                        value={isState.idWarehouseExport}
                                        isMulti={true}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={'Chọn kho xuất'}
                                        className={`${isState.errorWarehouseExport ? 'border-[#FF0000]' : 'border-[#d0d5dd]'} placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded-xl text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        style={{
                                            border: "none",
                                            boxShadow: "none",
                                            outline: "none",
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: "#EBF5FF",
                                                primary50: "#92BFF7",
                                                primary: "#0F4F9E",
                                            },
                                            borderRadius: "12px",
                                        })}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                boxShadow: "none",
                                                padding: "2.7px",
                                                ...(state.isFocused && {
                                                    border: "0 0 0 1px #92BFF7",
                                                    borderRadius: "12px",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="">
                                    <label className="text-[#344054] font-normal 2xl:text-sm text-xs mb-1 ">
                                        Thêm NVL/BTP xuất kho
                                        <span className="pl-1 text-red-500">*</span>
                                    </label>
                                    <SelectCore
                                        options={[]}
                                        // onChange={(e) => {
                                        //     queryStateQlty({ idCategoryError: e });
                                        // }}
                                        // value={isState.idCategoryError}
                                        isClearable={true}
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        placeholder={'Chọn NVL/BTP'}
                                        className={`placeholder:text-slate-300 rounded-xl w-full z-30 bg-[#ffffff] text-[#52575E] font-normal outline-none border `}
                                        isSearchable={true}
                                        style={{
                                            border: "none",
                                            boxShadow: "none",
                                            outline: "none",
                                        }}
                                        theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: "#EBF5FF",
                                                primary50: "#92BFF7",
                                                primary: "#0F4F9E",
                                            },
                                            borderRadius: "12px",
                                        })}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                boxShadow: "none",
                                                padding: "2.7px",
                                                ...(state.isFocused && {
                                                    border: "0 0 0 1px #92BFF7",
                                                    borderRadius: "12px",
                                                }),
                                            }),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <Customscrollbar className="3xl:h-[250px] xxl:h-[260px] 2xl:h-[250px] xl:h-[260px] h-[250 px] overflow-hidden mt-2">
                            {isLoading
                                ?
                                <Loading />
                                :
                                <div className="grid h-full grid-cols-2 gap-2">
                                    {
                                        isState.item?.bom?.length > 0 ? isState.item?.bom?.map((e, index) => {
                                            return (
                                                <div key={e?.item_id} className="bg-[#FCFAF8] min-h-[140px] h-fit p-3 flex items-start  gap-2 rounded-lg relative">
                                                    <div className="text-[#667085] font-normal text-[10px]">
                                                        #{index + 1}
                                                    </div>
                                                    <div className="flex flex-col w-full">
                                                        <div className="flex items-start w-full gap-3">
                                                            <div className="min-h-[44px] h-11 w-11 min-w-[44px]  rounded-md">
                                                                <Image
                                                                    src={e.image}
                                                                    width={1280}
                                                                    height={1024}
                                                                    alt="@image nvl"
                                                                    className="object-cover w-full h-full rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col w-full gap-1">
                                                                <h1 className="text-base font-medium">
                                                                    {e.item_name}
                                                                </h1>
                                                                <h1 className="text-xs font-medium 2xl:text-sm text-black/60">
                                                                    {e.item_code} - Tồn kho: <span className="font-medium text-black">{formanumber(e?.quantity_warehouse)}</span>
                                                                </h1>
                                                                <h1 className="text-xs font-medium 2xl:text-sm text-black/60">
                                                                    Đã giữ kho: <span className="font-medium text-black">{formanumber(0)}</span> Kg
                                                                </h1>
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <h1 className="w-1/4 text-xs font-medium 2xl:text-sm">Số lượng xuất kho</h1>
                                                                    <div className="bg-[#FFC8A6] rounded-xl flex justify-center items-center py-[1px] w-[73%]">
                                                                        <InPutNumericFormat
                                                                            placeholder={'0'}
                                                                            value={e.quantity}
                                                                            isAllowed={(values) => {
                                                                                const { floatValue, value } = values;
                                                                                if (floatValue == 0) {
                                                                                    return true;
                                                                                }
                                                                                if (floatValue < 0) {
                                                                                    isShow('warning', 'Vui lòng nhập lớn hơn 0');
                                                                                    return false
                                                                                }
                                                                                return true
                                                                            }}
                                                                            onValueChange={(value) => {
                                                                                handChangeQuantity(value, e.item_id)
                                                                            }}
                                                                            className={'border-2 text-right py-1.5 px-2 text-base focus:outline-none border-[#FFC8A6] bg-white max-w-[80%] w-[80%]'}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <IconDelete
                                                            size={18}
                                                            cursor={"pointer"}
                                                            onClick={() => handleDeleteItem(e.item_id)}
                                                            className="absolute text-red-500 transition-all duration-150 ease-linear top-2 hover:scale-105 right-2"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                            :
                                            <div className="col-span-2">
                                                <NoData />
                                            </div>
                                    }
                                </div>
                            }
                        </Customscrollbar>
                    </>
                }
                <div className="flex items-center justify-end gap-2 mt-2">
                    <ButtonCancel
                        loading={false}
                        onClick={() => {
                            queryState({
                                open: false,
                                idWarehouseExport: [],
                                idWarehouseImport: null,
                                errorWarehouseImport: false,
                                errorWarehouseExport: false
                            })
                        }}
                        dataLang={dataLang}
                    />
                    <ButtonSubmit
                        loading={false}
                        dataLang={dataLang}
                        onClick={handleSubmit.bind(this)}
                    />
                </div>
            </div>
        </PopupCustom>
    );
})
export default PopupImportProducts;
