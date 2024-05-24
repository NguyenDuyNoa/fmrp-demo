import React, { useEffect, useState } from "react";
import {
    SearchNormal1 as IconSearch,
    UserEdit as IconUserEdit,
    TickCircle as IconTick,
} from "iconsax-react";

import Loading from "@/components/UI/loading";
import PopupEdit from "@/components/UI/popup";

import { _ServerInstance as Axios } from "/services/axios";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import useSetingServer from "@/hooks/useConfigNumber";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import NoData from "@/components/UI/noData/nodata";
import Image from "next/image";
import Popup_GiaiDoan from "./popupGiaiDoan";
import Popup_Bom from "./popupBom";
import { formatMoment } from "@/utils/helpers/formatMoment";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
const Popup_ThongTin = React.memo((props) => {
    const dataSeting = useSetingServer()

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    }

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting)
    }

    const { isMoment } = formatMoment()

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [tab, sTab] = useState(0);

    const _HandleSelectTab = (e) => sTab(e);

    const [tabBom, sTabBom] = useState(0);

    const _HandleSelectTabBom = (e) => sTabBom(e);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetchingStage, sOnFetchingStage] = useState(false);

    const [onFetchingBom, sOnFetchingBom] = useState(false);

    const [list, sList] = useState({});

    const [dataStage, sDataStage] = useState([]);

    const [dataBom, sDataBom] = useState([]);

    const [selectedListBom, sSelectedListBom] = useState([]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_product/product/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                sList({ ...response.data });
            }
            sOnFetching(false);
        });
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerFetchingStage = () => {
        Axios("GET", `/api_web/api_product/getDesignStages/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const data = response.data;
                sDataStage(data);
            }
            sOnFetchingStage(false);
        });
    };

    useEffect(() => {
        open && _ServerFetchingStage();
    }, [open]);

    const _ServerFetchingBom = () => {
        Axios(
            "GET",
            `/api_web/Api_product/getDesignBOM?csrf_protection=true`,
            {
                params: {
                    id: props.id,
                },
            },
            (err, response) => {
                if (!err) {
                    const { data } = response.data;
                    sDataBom(data?.variations || []);
                    sTabBom(data?.variations[0]?.product_variation_option_value_id);
                }
                sOnFetchingBom(false);
            }
        );
    };

    useEffect(() => {
        open && _ServerFetchingBom();
    }, [open]);

    useEffect(() => {
        open && sTab(0);
        open && sOnFetching(true);
        open && sOnFetchingStage(true);
        open && sOnFetchingBom(true);
    }, [open]);

    useEffect(() => {
        open && sOnFetchingStage(true);
    }, [open]);

    useEffect(() => {
        open && sOnFetchingBom(true);
    }, [open]);

    useEffect(() => {
        open && tabBom && sSelectedListBom(dataBom.find((item) => item.product_variation_option_value_id === tabBom));
        open && dataBom && sSelectedListBom(dataBom.find((item) => item.product_variation_option_value_id === tabBom));
    }, [tabBom, dataBom]);

    const dataTab = [
        {
            id: 0,
            name: props.dataLang?.information || "information",
        },
        {
            id: 1,
            name: props.dataLang?.category_material_list_variant || "category_material_list_variant",
        },
        {
            id: 2,
            name: props.dataLang?.bom_finishedProduct || "bom_finishedProduct",
        },
        {
            id: 3,
            name: props.dataLang?.stage_finishedProduct || "stage_finishedProduct",
        }
    ]
    console.log("selectedListBom", selectedListBom);
    return (
        <PopupEdit
            title={"Chi tiết thành phẩm"}
            button={props.children}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            nested
        >
            <div className="py-4 w-[900px] space-y-5">
                <div className="flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                    {dataTab.map((item) => (
                        <button
                            onClick={_HandleSelectTab.bind(this, item.id)}
                            className={`${tab === item.id ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                                }  px-4 py-2 outline-none font-medium`}
                        >
                            {item.name}
                        </button>
                    ))}

                </div>
                {onFetching ? (
                    <Loading className="h-96" color="#0f4f9e" />
                ) : (
                    <React.Fragment>
                        {tab === 0 && (
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-5">
                                    <div className="space-y-3 bg-slate-100/40 p-2 rounded-md">
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.client_list_brand || "client_list_brand"}:
                                            </h5>
                                            <div className="w-[55%] flex flex-col items-end">
                                                {list?.branch?.map((e) => (
                                                    <TagBranch key={e.id.toString()} className="w-fit">
                                                        {e.name}
                                                    </TagBranch>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.category_titel}:
                                            </h5>
                                            <h6 className="w-[55%] text-right">{list?.category_name}</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.code_finishedProduct}:
                                            </h5>
                                            <h6 className="w-[55%] text-right">{list?.code}</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.name_finishedProduct}:
                                            </h5>
                                            <h6 className="w-[55%] text-right">{list?.name}</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.type_finishedProduct}:
                                            </h5>
                                            <h6 className="w-[55%] text-right">
                                                {/* {props.dataLang[list?.type_products?.name]} */}
                                                <span
                                                    className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-xs
                                                                     ${(list?.type_products?.id === 0 && "text-lime-500 border-lime-500") ||
                                                        (list?.type_products?.id === 1 && "text-orange-500 border-orange-500") ||
                                                        (list?.type_products?.id === 2 && "text-sky-500 border-sky-500")
                                                        }`}
                                                >
                                                    {props.dataLang[list?.type_products?.name] || list?.type_products?.name}
                                                </span>
                                            </h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">{props.dataLang?.unit}:</h5>
                                            <h6 className="w-[55%] text-right">{list?.unit}</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">{props.dataLang?.stock}:</h5>
                                            <h6 className="w-[55%] text-right">
                                                {formatNumber(list?.stock_quantity)}
                                            </h6>
                                        </div>
                                        {props.dataProductExpiry?.is_enable === "1" && (
                                            <div className="flex justify-between">
                                                <h5 className="text-slate-400 text-sm w-[40%]">
                                                    {props.dataLang?.category_material_list_expiry_date}:
                                                </h5>
                                                <h6 className="w-[55%] text-right">{list?.expiry}</h6>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">{props.dataLang?.note}:</h5>
                                            <h6 className="w-[55%] text-right">{list?.note}</h6>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-slate-100/40 p-2 rounded-md">
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">Giá bán:</h5>
                                            <h6 className="w-[55%] text-right">
                                                {formatMoney(list?.price_sell)}
                                            </h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang?.minimum_amount}:
                                            </h5>
                                            <h6 className="w-[55%] text-right">
                                                {formatNumber(list?.quantity_minimum)}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 flex flex-col justify-between">
                                    <div className="flex bg-slate-100/40 p-2 rounded-md">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.avatar || "avatar"}:
                                        </h5>
                                        {list?.images == null ? (
                                            <img
                                                src="/no_image.png"
                                                className="w-48 h-48 rounded object-contain select-none pointer-events-none"
                                            />
                                        ) : (
                                            <Image
                                                width={200}
                                                height={200}
                                                quality={100}
                                                src={list?.images}
                                                alt="thumb type"
                                                className="w-48 h-48 rounded object-contain select-none pointer-events-none"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                placeholder="blur"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        )}
                                    </div>
                                    <div className="bg-slate-100/40 p-2 rounded-md space-y-3">
                                        <h4 className="flex space-x-2">
                                            <IconUserEdit size={20} />
                                            <span className="text-[15px] font-medium">Người lập phiếu</span>
                                        </h4>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[30%]">
                                                {props.dataLang?.creator || "creator"}:
                                            </h5>
                                            <h6 className="w-[65%] text-right">{list?.name_created_by}</h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[30%]">
                                                {props.dataLang?.date_created || "date_created"}:
                                            </h5>
                                            <h6 className="w-[65%] text-right">{isMoment(list?.date_created, 'DD/MM/YYYY, HH:mm:ss')}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {tab === 1 && (
                            <React.Fragment>
                                {list?.variation_option_value?.length > 0 ? (
                                    <div className="space-y-0.5 min-h-[384px]">
                                        <HeaderTablePopup gridCols={4} >
                                            <ColumnTablePopup textAlign={'center'}>
                                                {props.dataLang?.avatar}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup textAlign={'center'}>
                                                {list?.variation[0]?.name}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup textAlign={'center'}>
                                                {list?.variation[1]?.name ? list?.variation[1]?.name : ""}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup textAlign={'right'}>
                                                {props.dataLang?.price || "price"}
                                            </ColumnTablePopup>
                                        </HeaderTablePopup>
                                        <Customscrollbar className="max-h-[450px]">
                                            <div className="divide-y divide-slate-200">
                                                {list?.variation_option_value?.map((e) => (
                                                    <div
                                                        key={e?.id ? e?.id.toString() : ""}
                                                        className={`${e?.variation_option_2?.length > 0
                                                            ? "grid-cols-4"
                                                            : "grid-cols-4"
                                                            } grid gap-2 px-2 py-2.5 hover:bg-slate-50`}
                                                    >
                                                        <div className="flex justify-center items-center self-center">
                                                            {e?.image == null ? (
                                                                <img
                                                                    src="/no_image.png"
                                                                    className="w-auto h-20 rounded object-contain select-none pointer-events-none"
                                                                />
                                                            ) : (
                                                                <Image
                                                                    width={200}
                                                                    height={200}
                                                                    quality={100}
                                                                    src={e?.image}
                                                                    alt="thumb type"
                                                                    className="w-auto h-20 rounded object-contain select-none pointer-events-none"
                                                                    loading="lazy"
                                                                    crossOrigin="anonymous"
                                                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                                />
                                                            )}
                                                        </div>
                                                        <h6 className="px-2 xl:text-base text-xs self-center text-center">
                                                            {e?.name}
                                                        </h6>
                                                        {e?.variation_option_2?.length > 0 ? (
                                                            <div className="self-center space-y-0.5 col-span-2 grid grid-cols-2">
                                                                {e?.variation_option_2?.map((ce) => (
                                                                    <React.Fragment key={ce.id ? ce.id?.toString() : ""}>
                                                                        <h6 className="px-2 xl:text-base text-xs text-center">
                                                                            {ce.name}
                                                                        </h6>
                                                                        <h6 className="px-2 xl:text-base text-xs text-right">
                                                                            {formatMoney(ce.price)}
                                                                        </h6>
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <h6 className="px-2 xl:text-base text-xs self-center text-right">
                                                                {formatMoney(e?.price)}
                                                            </h6>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </Customscrollbar>
                                    </div>
                                ) : (
                                    <div className="w-full h-96 flex flex-col justify-center items-center">
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                            <IconSearch />
                                        </div>
                                        <h1 className="text-[#141522] text-base opacity-90 font-medium">
                                            {props.dataLang?.no_data_found}
                                        </h1>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                        {tab === 2 && (
                            <>
                                {onFetchingBom ? (
                                    <Loading className="h-96" color="#0f4f9e" />
                                ) : (
                                    <>
                                        {dataBom?.length > 0 ? (
                                            <div className="space-y-0.5 min-h-[384px]">
                                                <div className="pb-3 flex space-x-3 items-center justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                                    {dataBom?.map((e) => (
                                                        <button
                                                            key={e.product_variation_option_value_id.toString()}
                                                            onClick={_HandleSelectTabBom.bind(
                                                                this,
                                                                e.product_variation_option_value_id
                                                            )}
                                                            className={`${tabBom === e.product_variation_option_value_id
                                                                ? "text-[#0F4F9E] bg-[#0F4F9E10]"
                                                                : "hover:text-[#0F4F9E] bg-slate-50/50"
                                                                } outline-none min-w-fit px-3 py-1.5 rounded relative flex items-center`}
                                                        >
                                                            <span>
                                                                {e.name_variation?.includes("NONE")
                                                                    ? "Mặc định"
                                                                    : e.name_variation}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <HeaderTablePopup gridCols={13}    >
                                                    <ColumnTablePopup colSpan={2}>
                                                        {props.dataLang?.warehouses_detail_type || "warehouses_detail_type"}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={2}>
                                                        {props.dataLang?.name || "name"}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={2}>
                                                        {props.dataLang?.unit}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={2}>
                                                        {props.dataLang?.norm_finishedProduct || "norm_finishedProduct"}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={2}>
                                                        %
                                                        {props.dataLang?.loss_finishedProduct || "loss_finishedProduct"}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={3}>
                                                        {props.dataLang?.stage_usage_finishedProduct}
                                                    </ColumnTablePopup>
                                                </HeaderTablePopup>

                                                <Customscrollbar className="min-h-[250px] max-h-[450px]">
                                                    <div className="divide-y divide-slate-200">
                                                        {selectedListBom?.items?.map((e, index) => (
                                                            <div
                                                                key={e?.id ? e?.id.toString() : ""}
                                                                className={`grid grid-cols-13 px-2 py-2.5 hover:bg-slate-50 items-center`}
                                                            >
                                                                <h6 className="px-2 xl:text-[15px] text-xs col-span-2">
                                                                    {e?.str_type_item}
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs col-span-2">
                                                                    <div className="grid grid-cols-1">
                                                                        <h5>{e?.item_name}</h5>
                                                                        <h5 className="text-xs italic">
                                                                            {e?.variation_name}
                                                                        </h5>
                                                                    </div>
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs col-span-2 text-center">
                                                                    {e?.unit_name}
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs  col-span-2 text-center">
                                                                    {formatNumber(e?.quota)}
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs  col-span-2 text-center">
                                                                    {formatNumber(e?.loss)}%
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs col-span-3 text-center">
                                                                    {e?.stage_name}
                                                                </h6>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Customscrollbar>
                                                <div className="flex items-center space-x-3 justify-end">
                                                    <Popup_Bom
                                                        dataLang={props.dataLang}
                                                        id={props.id}
                                                        name={list?.name}
                                                        code={list?.code}
                                                        type="edit"
                                                        onRefresh={props.onRefresh}
                                                        onRefreshBom={_ServerFetchingBom}
                                                    // className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-96 flex flex-col justify-center items-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                    <IconSearch />
                                                </div>
                                                <h1 className="text-[#141522] text-base opacity-90 font-medium">
                                                    {props.dataLang?.no_data_found}
                                                </h1>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        {tab === 3 && (
                            <>
                                {onFetchingStage ? (
                                    <Loading className="h-96" color="#0f4f9e" />
                                ) : (
                                    <React.Fragment>
                                        {dataStage?.length > 0 ? (
                                            <div className="space-y-0.5 min-h-[384px]">
                                                <HeaderTablePopup gridCols={8}>
                                                    <ColumnTablePopup>
                                                        {props.dataLang?.no || "no"}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={2}>
                                                        {props.dataLang?.stage_finishedProduct}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={3}>
                                                        {props.dataLang?.check_first_stage_finishedProduct}
                                                    </ColumnTablePopup>
                                                    <ColumnTablePopup colSpan={2}>
                                                        {props.dataLang?.stage_last_finishedProduct}
                                                    </ColumnTablePopup>
                                                </HeaderTablePopup>
                                                <Customscrollbar className="min-h-[250px] max-h-[450px]" >
                                                    <div className="divide-y divide-slate-200">
                                                        {dataStage?.map((e, index) => (
                                                            <div
                                                                key={e?.id ? e?.id.toString() : ""}
                                                                className={`grid-cols-8 grid gap-2 px-2 py-2.5 hover:bg-slate-50 items-center`}
                                                            >
                                                                <h6 className="text-center px-2 xl:text-base text-xs">
                                                                    {index + 1}
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs col-span-2">
                                                                    {e?.stage_name}
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs col-span-3 flex justify-center text-green-600">
                                                                    {e?.type == "2" && <IconTick />}
                                                                </h6>
                                                                <h6 className="px-2 xl:text-base text-xs col-span-2 flex justify-center text-green-600">
                                                                    {e?.final_stage == "1" && <IconTick />}
                                                                </h6>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Customscrollbar>
                                                <div className="flex items-center space-x-3 justify-end">
                                                    <Popup_GiaiDoan
                                                        dataLang={props.dataLang}
                                                        id={props.id}
                                                        name={list?.name}
                                                        code={list?.code}
                                                        typeOpen="edit"
                                                        className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <NoData />
                                        )}
                                    </React.Fragment>
                                )}
                            </>
                        )}
                    </React.Fragment>
                )}
            </div>
        </PopupEdit>
    );
});

export default Popup_ThongTin