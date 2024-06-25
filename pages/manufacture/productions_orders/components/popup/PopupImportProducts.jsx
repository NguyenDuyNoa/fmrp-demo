import PopupCustom from "@/components/UI/popup";
import { memo, useState } from "react";

import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import NoData from "@/components/UI/noData/nodata";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash as IconDelete } from "iconsax-react";
import Image from "next/image";
import { FaBox } from "react-icons/fa";
import { RiBox3Fill } from "react-icons/ri";

const PopupImportProducts = memo(({ dataLang, dataDetail, type, dataStage, ...props }) => {
    const isShow = useToast();

    const initilaState = {
        open: false,
        item: {
            bom: [],
        },
        dtPoi: {},
        warehouseImport: [],
        warehouseExport: [],
        idWarehouseExport: [],
        idWarehouseImport: null,
    };

    const queryClient = useQueryClient()

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const dataSeting = useSetingServer()

    const formanumber = (num) => formatNumberConfig(+num, dataSeting)

    const handingPopup = useMutation({
        mutationFn: (data) => {
            if (type == "begin_production") {
                return apiProductionsOrders.apiAgreeProcess(data)
            }
            if (type == "end_production") {

            }
        }
    })
    console.log("dataDetail", dataDetail);

    useQuery({
        queryKey: ["api_data_products"],
        queryFn: async () => {
            let formData = new FormData();
            formData.append('poi_id', dataStage?.poi_id);
            formData.append('pois_id', dataStage?.id);
            formData.append('type', dataStage?.type);
            formData.append('bom_id', dataStage?.bom_id);
            const { data } = await apiProductionsOrders.apiDataProducts(formData);
            console.log("data?.product?.item?.bom", data?.product);
            queryState({
                warehouseImport: data?.warehouses?.map(e => {
                    return {
                        value: e?.id,
                        label: e?.name
                    }
                }),
                dtPoi: {
                    ...data?.product?.dtPoi,
                    // ...data?.product?.item,
                    // quantityChange: null,
                    // image: '/no_img.png',
                },
                item: {
                    ...data?.product?.item,
                    quantityChange: null,
                    image: data?.product?.item?.itme_image ?? '/no_img.png',
                    bom: data?.product?.item?.bom?.map(e => {
                        return {
                            ...e,
                            quantity: null,
                            image: e?.images ? e?.images : "/no_img.png",
                        }
                    })
                }
            })
            // if(data){

            // }
            // console.log("data", data);

            return data
        },
        enabled: isState.open && type === 'end_production' ? true : false,
    })

    console.log("isState.dtPois", isState.dtPoi);

    // useQuery({
    //     queryKey: ["api_data_warehouse_po", isState.dtPois],
    //     queryFn: async () => {
    //         let formData = new FormData();
    //         formData.append('branch_id', isState.dtPois?.branch_id);
    //         // "branch_id": 59, //id chi nhánh
    //         // "item_variation_id": 626, //item_variation_option_value_id biến thể của BOM
    //         // "type_item": "product", // type_item của bom
    //         // "item_id": 1, // item_id của bom
    //         // "unit_id": 1, // unit_id của bom
    //         // "pp_id": 1 // id của kế hoạch NVL
    //         const { data } = await apiProductionsOrders.apiDataWarehousePo(formData);
    //         console.log("data", data);
    //         // queryState({
    //         //     warehouseExport: data?.warehouses?.map(e => {
    //         //         return {
    //         //             value: e?.id,
    //         //             label: e?.name
    //         //         }
    //         //     }),
    //         // })
    //         // return data
    //     },
    //     enabled: isState.open && type === 'end_production' ? true : false,
    // })


    const handleDeleteItem = (id) => {
        queryState({ item: isState.item.filter((e) => e.id != id) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData()

        if (type == "begin_production") {
            formData.append('pois_id', dataStage?.id)
            formData.append('status', 1)
            formData.append('type_event', type)
            handingPopup.mutate(formData, {
                onSuccess: ({ isSuccess, message }) => {
                    isShow("success", message)
                    queryClient.invalidateQueries('apiItemOrdersDetail');
                },
                onError: (error) => {
                    isShow("error", error)
                },
            })
        }
        queryState({ open: false })
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
            onClose={() => queryState({ open: false })}
            classNameBtn={`${props?.className}`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            <div className={`${type === "begin_production" ? "w-[500px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto" : "3xl:w-[1100px] 2xl:w-[900px] xl:w-[800px] w-[700px] h-[575px]"} `}>
                {
                    type == 'end_production' &&
                    <>
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex items-center gap-2 bg-[#EEF1FC] p-3 rounded-lg">
                                <RiBox3Fill className="text-[#5770F7]" size={20} />
                                <h2 className="font-medium  uppercase text-[#5770F7] 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                                    Thành phẩm
                                </h2>
                            </div>
                            <div className="bg-[#F8FAFC] p-3 rounded-sm  flex flex-col gap-2">
                                <div className="grid grid-cols-12 items-center">
                                    <div className="col-span-9 flex items-center gap-3">
                                        <div className="h-11 w-11">
                                            <Image src={isState.item.image} width={1280} height={1024} alt="" className="object-cover h-full w-full" />
                                        </div>
                                        <div className="">
                                            <h1 className="text-base font-medium">{isState.item.item_name}</h1>
                                            <div className="flex items-center gap-2">
                                                <h1 className="2xl:text-sm text-xs font-medium text-black/60">{isState.item.item_code} - Cần SX: <span className="text-black font-medium">{formanumber(isState.item.quantity)}</span></h1>
                                                <div className="flex items-center justify-center  n gap-3">
                                                    <h1 className="2xl:text-sm text-xs font-medium">Số lượng hoàn thành</h1>
                                                    <InPutNumericFormat
                                                        className={'border-2 text-right px-2 text-base  rounded-xl focus:outline-none border-[#BAD1FE] bg-transparent w-1/3'}
                                                        placeholder={'0'}
                                                        value={isState.item.quantityChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <SelectCore
                                            options={isState.warehouseImport}
                                            onChange={(e) => {
                                                queryState({ idWarehouseImport: e });
                                            }}
                                            value={isState.idWarehouseImport}
                                            isClearable={true}
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            placeholder={'Chọn kho nhập'}
                                            className={`placeholder:text-slate-300 w-full z-50 rounded-xl bg-[#ffffff] text-[#52575E] font-normal outline-none border `}
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
                                        <span className="text-red-500 pl-1">*</span>
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
                                        placeholder={'Chọn kho xuất'}
                                        className={`placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded-xl text-[#52575E] font-normal outline-none border `}
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
                                        <span className="text-red-500 pl-1">*</span>
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
                            <div className="h-full grid grid-cols-2 gap-2">
                                {isState.item?.bom?.length > 0 ? isState.item?.bom?.map((e, index) => {
                                    return (
                                        <div key={e?.item_id} className="bg-[#FCFAF8] h-fit p-3 flex items-start  gap-2 rounded-lg relative">
                                            <div className="text-[#667085] font-normal text-[10px]">#{index + 1}</div>
                                            <div className="flex flex-col w-full">
                                                <div className="flex items-start gap-3 w-full">
                                                    <div className="h-11 w-11">
                                                        <Image src={e.image} width={1280} height={1024} alt="" className="object-cover h-full w-full" />
                                                    </div>
                                                    <div className="w-full">
                                                        <h1 className="text-base font-medium">{e.item_name}</h1>
                                                        <h1 className="2xl:text-sm text-xs font-medium text-black/60">{e.item_code} - Tồn kho: <span className="text-black font-medium">{formanumber(e.quantity_quota_primary)}</span></h1>
                                                        <h1 className="2xl:text-sm text-xs font-medium text-black/60">Đã giữ kho: <span className="text-black font-medium">{formanumber(e.quantity_total_quota)}</span> Kg</h1>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <h1 className="2xl:text-sm text-xs font-medium w-1/2">Số lượng xuất</h1>
                                                            <InPutNumericFormat
                                                                value={e.quantity}
                                                                className={'border-2 text-right pr-2 text-base  rounded-xl focus:outline-none border-[#FFC8A6] bg-transparent w-1/2'}
                                                                placeholder={'0'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <IconDelete onClick={() => handleDeleteItem(e.id)} cursor={"pointer"} className="absolute top-2 hover:scale-105 transition-all duration-150 ease-linear right-2 text-red-500" size={18} />
                                            </div>
                                        </div>
                                    )
                                }) : <div className="col-span-2">
                                    <NoData />
                                </div>
                                }
                            </div>
                        </Customscrollbar>
                    </>
                }
                <div className="flex justify-end items-center gap-2 mt-2">
                    <ButtonCancel loading={false} onClick={() => queryState({ open: false })} dataLang={dataLang} />
                    <ButtonSubmit loading={false} onClick={handleSubmit.bind(this)} dataLang={dataLang} />
                </div>
            </div>
        </PopupCustom>
    );
})
export default PopupImportProducts;
