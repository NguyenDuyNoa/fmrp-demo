import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    ArrowDown2 as IconDown,
    TickCircle,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
} from "iconsax-react";
import ModalImage from "react-modal-image";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import ExpandableContent from "@/components/UI/more";
import ImageErrors from "@/components/UI/imageErrors";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagWarehouse } from "@/components/UI/common/Tag/TagWarehouse";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { TagColorLime, TagColorOrange, TagColorRed, TagColorSky } from "@/components/UI/common/Tag/TagStatus";

import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";
const Popup_chitietThere = (props) => {
    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [data, sData] = useState();

    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    }

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    }

    console.log(props?.type);
    const _ServerFetching_detailThere = () => {
        Axios(
            "GET",
            `${(props?.type == "import" &&
                `/api_web/Api_import/import/${props?.id}?csrf_protection=true`) ||
            (props?.type == "service" &&
                `/api_web/Api_service/service/${props?.id}?csrf_protection=true`) ||
            (props?.type == "deposit" &&
                `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`) ||
            (props?.type == "1" &&
                `/api_web/Api_purchases/purchases/${props?.id}?csrf_protection=true`) ||
            (props?.type == "typePo" &&
                `/api_web/Api_purchase_order/purchase_order/${props?.id}?csrf_protection=true`) ||
            (props?.type == "order" && `/api_web/Api_sale_order/saleOrder/${props?.id}?csrf_protection=true`)
            }`,
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data;

                    sData(db);
                }
                sOnFetching(false);
            }
        );
    };
    useEffect(() => {
        (onFetching && _ServerFetching_detailThere())
    }, [open]);


    let listQty = data?.items;
    let totalQuantity = 0;
    for (let i = 0; i < listQty?.length; i++) {
        totalQuantity += parseInt(listQty[i].quantity);
    }
    return (
        <>
            <PopupEdit
                title={
                    (props?.type == "import" && (props.dataLang?.import_detail_title || "import_detail_title")) ||
                    (props?.type == "service" && (props.dataLang?.serviceVoucher_service_voucher_details || "serviceVoucher_service_voucher_details")) ||
                    (props?.type == "deposit" && (props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title")) ||
                    (props?.type == "1" && (props.dataLang?.purchase_detail_title || "purchase_detail_title")) ||
                    (props?.type == "typePo" && (props.dataLang?.purchase_order_detail_title || "purchase_order_detail_title")) ||
                    props?.type == "order" && props.dataLang?.sales_product_popup_detail_title || "sales_product_popup_detail_title"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                {(props?.type == "import" && (
                    <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[640px] h-[600px] ">
                        <div>
                            <div className="3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]">
                                <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]">
                                    <GeneralInformation {...props} />
                                    <div className="grid grid-cols-9  min-h-[130px] px-2">
                                        <div className="col-span-3">
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium">
                                                    {data?.date != null
                                                        ? moment(
                                                            data?.date
                                                        ).format(
                                                            "DD/MM/YYYY, HH:mm:ss"
                                                        )
                                                        : ""}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_code_vouchers || "import_code_vouchers"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium text-blue-600">
                                                    {data?.code}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_the_order || "import_the_order"}
                                                </h3>
                                                <h3 className=" text-[13px]  text-center font-medium text-lime-500  rounded-xl py-1 px-3 max-w-[100px] min-w-[70px]  bg-lime-200 ">
                                                    {data?.purchase_order_code}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="col-span-3">
                                            <div className="my-4 font-medium grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_payment_status || "import_payment_status"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-center">
                                                    {(data?.status_pay ===
                                                        "not_spent" && (
                                                            <TagColorSky className={'!py-1'} name={"Chưa chi"} />
                                                        )) ||
                                                        (data?.status_pay ===
                                                            "spent_part" && (
                                                                <TagColorOrange className={'!py-1'} name={`Chi 1 phần (${formatNumber(data?.amount_paid)})`} />
                                                            )) ||
                                                        (data?.status_pay ===
                                                            "spent" && (
                                                                <TagColorLime name={'Đã chi đủ'} />
                                                            ))}
                                                </div>
                                            </div>
                                            <div className="my-4 font-medium grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_from_browse || "import_from_browse"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-center">
                                                    <TagWarehouse data={data} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 ">
                                            <div className="my-4 font-medium grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.import_supplier || "import_supplier"}
                                                </h3>
                                                <h3 className="text-[13px] font-normal">
                                                    {data?.supplier_name}
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-2 col-span-2">
                                                <h3 className="col-span-1 text-[13px] font-medium">
                                                    {props.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <ImageErrors
                                                            src={
                                                                data
                                                                    ?.staff_create
                                                                    ?.profile_image
                                                            }
                                                            width={25}
                                                            height={25}
                                                            defaultSrc="/user-placeholder.jpg"
                                                            alt="Image"
                                                            className="object-cover rounded-[100%] text-left cursor-pointer"
                                                        />
                                                        <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                            <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <h6 className="capitalize">
                                                        {
                                                            data?.staff_create?.full_name
                                                        }
                                                    </h6>
                                                </div>{" "}
                                            </div>
                                            <div className="my-4 font-medium grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.import_branch || "import_branch"}
                                                </h3>
                                                <TagBranch className="w-fit">
                                                    {data?.branch_name}
                                                </TagBranch>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pr-2 w-[100%]">
                                        <HeaderTablePopup gridCols={13}>
                                            <ColumnTablePopup >
                                                {props.dataLang?.import_detail_image || "import_detail_image"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup colSpan={2}>
                                                {props.dataLang?.import_detail_items || "import_detail_items"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_detail_variant || "import_detail_variant"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {"Kho - VTK"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {"ĐVT"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_from_quantity || "import_from_quantity"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_from_unit_price || "import_from_unit_price"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {"% CK"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_from_price_affter || "import_from_price_affter"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_from_tax || "import_from_tax"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_into_money || "import_into_money"}
                                            </ColumnTablePopup>
                                            <ColumnTablePopup>
                                                {props.dataLang?.import_from_note || "import_from_note"}
                                            </ColumnTablePopup>
                                        </HeaderTablePopup>
                                        {onFetching ? (
                                            <Loading
                                                className="max-h-28"
                                                color="#0f4f9e"
                                            />
                                        ) : data?.items?.length > 0 ? (
                                            <>
                                                <Customscrollbar
                                                    className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px]"
                                                >
                                                    <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                        {data?.items?.map(
                                                            (e) => (
                                                                // <div className={`${dataProductSerial.is_enable == "1" ?
                                                                // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-12" :dataMaterialExpiry.is_enable == "1" ? "grid-cols-12" :"grid-cols-10" ) :
                                                                // (dataMaterialExpiry.is_enable != dataProductExpiry.is_enable ? "grid-cols-11" : (dataMaterialExpiry.is_enable == "1" ? "grid-cols-11" :"grid-cols-9") ) }  grid hover:bg-slate-50 `} key={e.id?.toString()}>
                                                                <div
                                                                    className="grid grid-cols-13 hover:bg-slate-50 items-center border-b"
                                                                    key={e.id?.toString()}
                                                                >
                                                                    <h6 className="text-[13px]   py-0.5 col-span-1 text-center">
                                                                        {e?.item
                                                                            ?.images !=
                                                                            null ? (
                                                                            <ModalImage
                                                                                small={
                                                                                    e
                                                                                        ?.item
                                                                                        ?.images
                                                                                }
                                                                                large={
                                                                                    e
                                                                                        ?.item
                                                                                        ?.images
                                                                                }
                                                                                alt="Product Image"
                                                                                className="custom-modal-image object-cover rounded w-[50px] h-[60px] mx-auto"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-[50px] h-[60px] object-cover  mx-auto">
                                                                                <ModalImage
                                                                                    small="/no_img.png"
                                                                                    large="/no_img.png"
                                                                                    className="w-full h-full rounded object-contain p-1"
                                                                                >
                                                                                    {" "}
                                                                                </ModalImage>
                                                                            </div>
                                                                        )}
                                                                    </h6>
                                                                    <h6 className="text-[13px]  px-2 py-0.5 col-span-2 text-left">
                                                                        <h6 className="font-medium">
                                                                            {
                                                                                e
                                                                                    ?.item
                                                                                    ?.name
                                                                            }
                                                                        </h6>
                                                                        <div className="flex-col items-center font-oblique flex-wrap">
                                                                            {dataProductSerial.is_enable === "1" ? (
                                                                                <div className="flex gap-0.5">
                                                                                    <h6 className="text-[12px]">
                                                                                        Serial:
                                                                                    </h6>
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                        {e.serial == null || e.serial == "" ? "-" : e.serial}
                                                                                    </h6>
                                                                                </div>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Lot:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                            {e.lot == null || e.lot == "" ? "-" : e.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Hạn sử dụng:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                            {e.expiration_date ? moment(e.expiration_date).format("DD/MM/YYYY") : "-"}
                                                                                        </h6>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">
                                                                        {
                                                                            e?.item?.product_variation
                                                                        }
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">{`${e?.warehouse_name}-${e.location_name}`}</h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center break-words">
                                                                        {
                                                                            e?.item?.unit_name
                                                                        }
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center mr-1">
                                                                        {formatNumber(e?.quantity)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                        {formatMoney(e?.price)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                        {e?.discount_percent + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                        {formatMoney(e?.price_after_discount)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                        {formatMoney(e?.tax_rate) + "%"}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-right ">
                                                                        {formatMoney(e?.amount)}
                                                                    </h6>
                                                                    <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-left ml-3.5">
                                                                        {e?.note !=
                                                                            undefined ? (
                                                                            <ExpandableContent
                                                                                content={e?.note}
                                                                            />
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </h6>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </Customscrollbar>
                                            </>
                                        ) : (
                                            <NoData />
                                        )}
                                    </div>
                                    <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                        {props.dataLang?.purchase_total || "purchase_total"}
                                    </h2>
                                    <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                        <div className="col-span-7">
                                            <h3 className="text-[13px] p-1 font-semibold">
                                                {props.dataLang?.import_from_note || "import_from_note"}
                                            </h3>
                                            <textarea
                                                className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-1 outline-none "
                                                disabled
                                                value={data?.note}
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1 text-right">
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_total_amount || "import_detail_total_amount"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_discount || "import_detail_discount"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_affter_discount || "import_detail_affter_discount"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_tax_money || "import_detail_tax_money"}
                                                </h3>
                                            </div>
                                            <div className="font-semibold text-left text-[13px]">
                                                <h3>
                                                    {props.dataLang?.import_detail_into_money || "import_detail_into_money"}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-span-3 space-y-1 text-right">
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatMoney(data?.total_price)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatMoney(data?.total_discount)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatMoney(data?.total_price_after_discount)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatMoney(data?.total_tax)}
                                                </h3>
                                            </div>
                                            <div className="font-medium mr-2.5">
                                                <h3 className="text-right text-blue-600 text-[13px]">
                                                    {formatMoney(data?.total_amount)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Customscrollbar>
                            </div>
                        </div>
                    </div>
                )) ||
                    (props?.type == "service" && (
                        <div className=" space-x-5 w-[1100px]  h-auto ">
                            <div>
                                <div className="w-[1100px]">
                                    <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]">
                                        <GeneralInformation {...props} />
                                        <div className="grid grid-cols-8  min-h-[100px] px-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.date != null
                                                            ? moment(
                                                                data?.date
                                                            ).format(
                                                                "DD/MM/YYYY"
                                                            )
                                                            : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-2 items-center font-medium grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props?.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <ImageErrors
                                                                src={
                                                                    data?.staff_create?.profile_image
                                                                }
                                                                width={25}
                                                                height={25}
                                                                defaultSrc="/user-placeholder.jpg"
                                                                alt="Image"
                                                                className="object-cover rounded-[100%] text-left cursor-pointer"
                                                            />
                                                            <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                    <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <h6 className="capitalize">
                                                            {
                                                                data?.staff_create?.full_name
                                                            }
                                                        </h6>
                                                    </div>
                                                </div>{" "}
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-2 mx-auto">
                                                <div className="my-4 font-semibold text-[13px]">
                                                    {props.dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-center">

                                                    {(data?.status_pay ===
                                                        "not_spent" && (
                                                            <TagColorSky className={'!py-1'} name={"Chưa chi"} />
                                                        )) ||
                                                        (data?.status_pay ===
                                                            "spent_part" && (
                                                                <TagColorOrange className={'!py-1'} name={`Chi 1 phần (${formatNumber(data?.amount_paid)})`} />
                                                            )) ||
                                                        (data?.status_pay ===
                                                            "spent" && (
                                                                <TagColorLime name={'Đã chi đủ'} />
                                                            ))}
                                                </div>
                                            </div>
                                            <div className="col-span-3 ">
                                                {" "}
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px] ">
                                                        {props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                                    </h3>
                                                    <h3 className="text-[13px] font-medium ">
                                                        {data?.supplier_name}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                    </h3>
                                                    <TagBranch className='w-fit'>
                                                        {data?.branch_name}
                                                    </TagBranch>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" w-[100%] lx:w-[110%] ">
                                            <HeaderTablePopup gridCols={12}>
                                                <ColumnTablePopup colSpan={2} textAlign={'left'}>
                                                    {props.dataLang?.serviceVoucher_services_arising || "serviceVoucher_services_arising"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"SL"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.serviceVoucher_unit_price || "serviceVoucher_unit_price"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"% CK"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2}>
                                                    {props.dataLang?.import_from_price_affter || "import_from_price_affter"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.serviceVoucher_tax || "serviceVoucher_tax"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2}>
                                                    {props.dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2}>
                                                    {props.dataLang?.serviceVoucher_note || "serviceVoucher_note"}
                                                </ColumnTablePopup>
                                            </HeaderTablePopup>
                                            {onFetching ? (
                                                <Loading
                                                    className="max-h-28"
                                                    color="#0f4f9e"
                                                />
                                            ) : data?.item?.length > 0 ? (
                                                <>
                                                    <Customscrollbar
                                                        className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px]"
                                                    >
                                                        <div className="divide-y divide-slate-200 min:h-[300px] h-[100%] max:h-[400px]">
                                                            {data?.item?.map(
                                                                (e) => (
                                                                    <div
                                                                        className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                        key={e.id?.toString()}
                                                                    >
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-left">
                                                                            {
                                                                                e?.name
                                                                            }
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                            {formatNumber(e?.quantity)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                            {formatMoney(e?.price)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                            {e?.discount_percent + "%"}
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-center">
                                                                            {formatMoney(e?.price_after_discount)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-1  font-medium text-center">
                                                                            {formatNumber(e?.tax_rate) + "%"}
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-right">
                                                                            {formatMoney(e?.amount)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]  px-2 py-0.5 col-span-2  font-medium text-left">
                                                                            {e?.note !=
                                                                                undefined ? (
                                                                                <ExpandableContent
                                                                                    content={
                                                                                        e?.note
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </h6>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </Customscrollbar>
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </div>
                                        <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                            {props.dataLang?.purchase_total || "purchase_total"}
                                        </h2>
                                        <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                            <div className="col-span-7">
                                                <div>
                                                    <div className="text-[#344054] font-semibold 2xl:text-[12px] xl:text-[13px] text-[13px] mb-1 ">
                                                        {props.dataLang?.purchase_note || "purchase_note"}
                                                    </div>
                                                    <textarea
                                                        value={data?.note}
                                                        disabled
                                                        name="fname"
                                                        type="text"
                                                        className="text-[13px]  placeholder:text-slate-300 w-[80%] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 min-h-[100px] max-h-[100px] resize-none bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-2 outline-none "
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2 mt-2 space-y-2">
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-3 mt-2 space-y-2">
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_price_after_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_tax_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_amount)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Customscrollbar>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "deposit" && (
                        <div className=" space-x-5 w-[1100px]  h-auto">
                            <div>
                                <div className="w-[1100px]">
                                    <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]">
                                        <GeneralInformation {...props} />
                                        <div className="grid grid-cols-8  min-h-[170px] px-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.delivery_date != null ? moment(data?.delivery_date).format("DD/MM/YYYY") : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_voucher_code || "purchase_order_detail_voucher_code"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}
                                                    </h3>
                                                    <h3 className="font-medium">
                                                        {data?.order_type ==
                                                            "0" ? (
                                                            <TagColorRed name={'Tạo mới'} />
                                                        ) : (
                                                            <TagColorOrange name='YCHM' />
                                                        )}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="col-span-2 mx-auto">
                                                <div className="my-4 font-medium text-[13px]">
                                                    {"Trạng thái nhập hàng"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start">
                                                    {(data?.import_status === "not_stocked" && (
                                                        <TagColorSky className={'!py-1'} name={props.dataLang[data?.import_status] || data?.import_status} />
                                                    )) ||
                                                        (data?.import_status === "stocked_part" && (
                                                            <TagColorOrange className={'!py-1'} name={props.dataLang[data?.import_status] || data?.import_status} />

                                                        )) ||
                                                        (data?.import_status === "stocked" && (
                                                            <TagColorLime className={'!py-1'} name={props.dataLang[data?.import_status] || data?.import_status} />

                                                        ))}
                                                </div>
                                                <div className="my-4 font-medium text-[13px]">
                                                    {props.dataLang?.purchase_order_table_number || "purchase_order_table_number"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start text-[13px]">
                                                    {data?.purchases?.reduce((acc, cur) => acc + (acc ? ", " : "") + cur.code, "")
                                                        .split("")
                                                        .join("")
                                                        .replace(/^,/, "")}
                                                </div>
                                            </div>
                                            <div className="col-span-3 ">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                                    </h3>
                                                    <h3 className="text-[13px] font-medium">
                                                        {data?.supplier_name}
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-2 col-span-2">
                                                    <h3 className="col-span-1 text-[13px] font-medium">
                                                        {props.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <ImageErrors
                                                                src={data?.staff_create?.profile_image}
                                                                width={25}
                                                                height={25}
                                                                defaultSrc="/user-placeholder.jpg"
                                                                alt="Image"
                                                                className="object-cover rounded-[100%] text-left cursor-pointer"
                                                            />
                                                            <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                    <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <h6 className="capitalize">
                                                            {
                                                                data?.staff_create?.full_name
                                                            }
                                                        </h6>
                                                    </div>{" "}
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                    </h3>
                                                    <TagBranch className="w-fit col-span-1">
                                                        {data?.branch_name}
                                                    </TagBranch>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <HeaderTablePopup gridCols={12}>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_image || "purchase_image"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_items || "purchase_items"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_variant || "purchase_variant"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"ĐVT"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"SL"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"% ck"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2}>
                                                    {"Đơn giá SCK"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                                </ColumnTablePopup>
                                            </HeaderTablePopup>
                                            {onFetching ? (
                                                <Loading
                                                    className="max-h-28"
                                                    color="#0f4f9e"
                                                />
                                            ) : data?.item?.length > 0 ? (
                                                <>
                                                    <Customscrollbar
                                                        className="min-h-[90px] max-h-[100px] 2xl:max-h-[250px]"
                                                    >
                                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                            {data?.item?.map(
                                                                (e) => (
                                                                    <div
                                                                        className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                        key={e.id?.toString()}
                                                                    >
                                                                        <h6 className="text-[13px] mx-auto   py-0.5 col-span-1  rounded-md text-center">
                                                                            {e
                                                                                ?.item
                                                                                ?.images !=
                                                                                null ? (
                                                                                <ModalImage
                                                                                    small={e?.item?.images}
                                                                                    large={e?.item?.images}
                                                                                    alt="Product Image"
                                                                                    className="custom-modal-image object-cover rounded w-[50px] h-[60px]"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                                    <ModalImage
                                                                                        small="/no_img.png"
                                                                                        large="/no_img.png"
                                                                                        className="w-full h-full rounded object-contain p-1"
                                                                                    >
                                                                                        {" "}
                                                                                    </ModalImage>
                                                                                </div>
                                                                            )}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left">
                                                                            {e?.item?.name}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left break-words">
                                                                            {e?.item?.product_variation}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center break-words">
                                                                            {e?.item?.unit_name}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center mr-1">
                                                                            {formatNumber(e?.quantity)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                            {formatMoney(e?.price)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                            {e?.discount_percent + "%"}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">
                                                                            {formatMoney(e?.price_after_discount)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center ">
                                                                            {formatNumber(e?.tax_rate) + "%"}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-right mr-3.5">
                                                                            {formatMoney(e?.amount)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left ml-3.5 ">
                                                                            {e?.note != undefined ? (
                                                                                <ExpandableContent
                                                                                    content={
                                                                                        e?.note
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </h6>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </Customscrollbar>
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </div>
                                        <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                            {props.dataLang?.purchase_total || "purchase_total"}
                                        </h2>
                                        <div className="mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                            <div className="col-span-7">
                                                <h3 className="text-[13px] p-1 font-medium">
                                                    {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                                </h3>
                                                <textarea
                                                    className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                                    disabled
                                                    value={data?.note}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_price_after_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_tax)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_amount)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Customscrollbar>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "1" && (
                        <div className="mt-4 space-x-5 w-[1100px] h-auto ">
                            <div>
                                <div className="w-[1100px]">
                                    <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]">
                                        <GeneralInformation {...props} />
                                        <div className="grid grid-cols-8  min-h-[140px] p-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_day || "purchase_day"}
                                                    </h3>
                                                    <h3 className="col-span-1 font-medium text-[13px]">
                                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_code || "purchase_code"}
                                                    </h3>
                                                    <h3 className="col-span-1 font-medium text-[13px] text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_planNumber || "purchase_planNumber"}
                                                    </h3>
                                                    <h3 className="col-span-1 font-medium text-[13px]">
                                                        {data?.reference_no}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="col-span-2 mx-auto">
                                                <div className="my-4 font-semibold text-[13px]">
                                                    {props.dataLang?.purchase_orderStatus || "purchase_orderStatus"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start">
                                                    {(data?.order_status
                                                        ?.status === "purchase_ordered" && (
                                                            <TagColorSky className={'!py-1'} name={props.dataLang[data?.order_status?.status]} />
                                                        )) ||
                                                        (data?.order_status?.status === "purchase_portion" && (
                                                            <TagColorOrange className={'!py-1'} name={`${props.dataLang[data?.order_status?.status]} (${data?.order_status?.count})`} />
                                                        )) ||
                                                        (data?.order_status?.status === "purchase_enough" && (
                                                            <TagColorLime className={'!py-1'} name={`${props.dataLang[data?.order_status?.status]} (${data?.order_status?.count})`} />

                                                        ))}
                                                </div>
                                            </div>
                                            <div className="col-span-3 ">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_status || "purchase_status"}
                                                    </h3>
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {data?.status == "1" ? (
                                                            <TagColorLime className={'!py-1'} name={props.dataLang?.purchase_approved || "purchase_approved"} />
                                                        ) : (
                                                            <TagColorRed name={props.dataLang?.purchase_notapproved || "purchase_notapproved"} />
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_propnent || "purchase_propnent"}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <ImageErrors
                                                                src={
                                                                    data?.profile_image
                                                                }
                                                                width={25}
                                                                height={25}
                                                                defaultSrc="/user-placeholder.jpg"
                                                                alt="Image"
                                                                className="object-cover rounded-[100%] text-left cursor-pointer"
                                                            />
                                                            <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                    <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <h6 className="capitalize">
                                                            {data?.user_create_name}
                                                        </h6>
                                                    </div>{" "}
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="col-span-1 text-[13px]">
                                                        {props.dataLang?.purchase_branch || "purchase_branch"}
                                                    </h3>
                                                    <TagBranch className="w-fit">
                                                        {data?.branch_name}
                                                    </TagBranch>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pr-2 w-[100%] lx:w-[110%] ">
                                            <HeaderTablePopup gridCols={8}>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_image || "purchase_image"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_items || "purchase_items"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_variant || "purchase_variant"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_unit || "purchase_unit"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_quantity || "purchase_quantity"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"SL đã mua"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"SL còn lại"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_note || "purchase_note"}
                                                </ColumnTablePopup>
                                            </HeaderTablePopup>
                                            {onFetching ? (
                                                <Loading
                                                    className="max-h-28"
                                                    color="#0f4f9e"
                                                />
                                            ) : data?.items?.length > 0 ? (
                                                <>
                                                    <Customscrollbar
                                                        className="min-h-[90px] max-h-[200px] 2xl:max-h-[166px]"
                                                    >
                                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                            {data?.items?.map(
                                                                (e) => (
                                                                    <div
                                                                        className="grid items-center grid-cols-8 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                        key={e.id.toString()}
                                                                    >
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1  rounded-md text-center mx-auto">
                                                                            {e?.item?.images != null ? (
                                                                                <ModalImage
                                                                                    small={e?.item?.images}
                                                                                    large={e?.item?.images}
                                                                                    alt="Product Image"
                                                                                    className="object-cover rounded w-[50px] h-[60px]"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                                    <ModalImage
                                                                                        small="/no_img.png"
                                                                                        large="/no_img.png"
                                                                                        className="w-full h-full rounded object-contain p-1"
                                                                                    >
                                                                                        {" "}
                                                                                    </ModalImage>
                                                                                </div>
                                                                            )}
                                                                        </h6>

                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left">
                                                                            {e?.item?.name}
                                                                        </h6>
                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left break-words">
                                                                            {e?.item?.product_variation}
                                                                        </h6>
                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center break-words">
                                                                            {e?.item?.unit_name}
                                                                        </h6>
                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                            {formatNumber(e?.quantity)}
                                                                        </h6>
                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                            {formatNumber(e?.quantity_create)}
                                                                        </h6>
                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-center">
                                                                            {Number(e?.quantity_left) < 0 ? "Đặt dư" + " " + formatNumber(Number(Math.abs(e?.quantity_left))) : formatNumber(e?.quantity_left)}
                                                                        </h6>
                                                                        <h6 className="text-[13px] font-medium  px-2 py-0.5 col-span-1 text-left">
                                                                            <ExpandableContent content={e?.note} />
                                                                        </h6>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </Customscrollbar>
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </div>
                                        <h2 className="font-medium p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5] text-[13px]">
                                            {props.dataLang?.purchase_total || "purchase_total"}
                                        </h2>
                                        <div className=" mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
                                            <div className="col-span-9">
                                                <h3 className="text-[13px] p-1 font-medium">
                                                    {props.dataLang?.purchase_note || "import_from_note"}
                                                </h3>
                                                <textarea
                                                    className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                                    disabled
                                                    value={data?.note}
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <div className="flex justify-between ">
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="font-medium">
                                                            {props.dataLang?.purchase_totalCount || "purchase_totalCount"}
                                                        </h3>
                                                    </div>
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="text-blue-600">
                                                            {formatNumber(totalQuantity)}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between ">
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="font-medium">
                                                            {props.dataLang?.purchase_totalItem || "purchase_totalItem"}
                                                        </h3>
                                                    </div>
                                                    <div className="font-normal text-[13px]">
                                                        <h3 className="text-blue-600">
                                                            {formatNumber(data?.items?.length)}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Customscrollbar>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "typePo" && (
                        <div className=" space-x-5 w-[1100px]  h-auto">
                            <div>
                                <div className="w-[1100px]">
                                    <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]">
                                        <GeneralInformation {...props} />
                                        <div className="grid grid-cols-8  min-h-[170px] px-2">
                                            <div className="col-span-3">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_day_vouchers || "purchase_order_detail_day_vouchers"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_delivery_date || "purchase_order_detail_delivery_date"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium">
                                                        {data?.delivery_date != null ? moment(data?.delivery_date).format("DD/MM/YYYY") : ""}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_detail_voucher_code || "purchase_order_detail_voucher_code"}
                                                    </h3>
                                                    <h3 className=" text-[13px]  font-medium text-blue-600">
                                                        {data?.code}
                                                    </h3>
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className=" text-[13px] ">
                                                        {props.dataLang?.purchase_order_table_ordertype || "purchase_order_table_ordertype"}
                                                    </h3>
                                                    <h3 className=" font-medium">
                                                        {data?.order_type == "0" ? (

                                                            <TagColorRed className={'!py-1'} name='Tạo mới' />
                                                        ) : (
                                                            <TagColorOrange className={'!py-1'} name={'YCMH'} />

                                                        )}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="col-span-2 mx-auto">
                                                <div className="my-4 font-medium text-[13px]">
                                                    {"Trạng thái nhập hàng"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start">
                                                    {(data?.import_status === "not_stocked" && (
                                                        <TagColorSky className={'!py-1'} name={props.dataLang[data?.import_status] || data?.import_status} />
                                                    )) ||
                                                        (data?.import_status === "stocked_part" && (
                                                            <TagColorOrange className={'!py-1'} name={props.dataLang[data?.import_status] || data?.import_status} />
                                                        )) ||
                                                        (data?.import_status === "stocked" && (
                                                            <TagColorLime className={'!py-1'} name={props.dataLang[data?.import_status] || data?.import_status} />
                                                        ))}
                                                </div>
                                                <div className="my-4 font-medium text-[13px]">
                                                    {props.dataLang?.purchase_order_table_number || "purchase_order_table_number"}
                                                </div>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start text-[13px]">
                                                    {data?.purchases?.reduce((acc, cur) => acc + (acc ? ", " : "") + cur.code, "")
                                                        .split("")
                                                        .join("")
                                                        .replace(/^,/, "")}
                                                </div>
                                            </div>
                                            <div className="col-span-3 ">
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_supplier || "purchase_order_table_supplier"}
                                                    </h3>
                                                    <h3 className="text-[13px] font-medium">
                                                        {data?.supplier_name}
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-2 col-span-2">
                                                    <h3 className="col-span-1 text-[13px] font-medium">
                                                        {props.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                                    </h3>
                                                    <div className="my-2 font-medium grid grid-cols-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative">
                                                                <ImageErrors
                                                                    src={data?.staff_create?.profile_image}
                                                                    width={25}
                                                                    height={25}
                                                                    defaultSrc="/user-placeholder.jpg"
                                                                    alt="Image"
                                                                    className="object-cover rounded-[100%] text-left cursor-pointer"
                                                                />
                                                                <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                    <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                        <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <h6 className="capitalize">
                                                                {
                                                                    data?.staff_create?.full_name
                                                                }
                                                            </h6>
                                                        </div>
                                                    </div>{" "}
                                                </div>
                                                <div className="my-4 font-semibold grid grid-cols-2">
                                                    <h3 className="text-[13px]">
                                                        {props.dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                                                    </h3>
                                                    <TagBranch className="w-fit">
                                                        {data?.branch_name}
                                                    </TagBranch>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pr-2 w-[100%] lx:w-[110%] ">
                                            <HeaderTablePopup gridCols={12}>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_image || "purchase_image"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_items || "purchase_items"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_variant || "purchase_variant"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {"ĐVT"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_quantity || "purchase_quantity"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_unit_price || "purchase_order_detail_unit_price"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_discount || "purchase_order_detail_discount"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2}>
                                                    {props.dataLang?.purchase_order_detail_after_discount || "purchase_order_detail_after_discount"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_tax || "purchase_order_detail_tax"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup>
                                                    {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                                </ColumnTablePopup>
                                            </HeaderTablePopup>
                                            {onFetching ? (
                                                <Loading
                                                    className="max-h-28"
                                                    color="#0f4f9e"
                                                />
                                            ) : data?.item?.length > 0 ? (
                                                <>
                                                    <Customscrollbar
                                                        className="min-h-[90px] max-h-[100px] 2xl:max-h-[250px]"
                                                    >
                                                        <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                            {data?.item?.map(
                                                                (e) => (
                                                                    <div
                                                                        className="grid items-center grid-cols-12 py-1.5 px-2 hover:bg-slate-100/40 "
                                                                        key={e.id?.toString()}
                                                                    >
                                                                        <h6 className="text-[13px] mx-auto   py-0.5 col-span-1  rounded-md text-center">
                                                                            {e
                                                                                ?.item
                                                                                ?.images !=
                                                                                null ? (
                                                                                <ModalImage
                                                                                    small={e?.item?.images}
                                                                                    large={e?.item?.images}
                                                                                    alt="Product Image"
                                                                                    className="custom-modal-image object-cover rounded w-[50px] h-[60px]"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                                    <ModalImage
                                                                                        small="/no_img.png"
                                                                                        large="/no_img.png"
                                                                                        className="w-full h-full rounded object-contain p-1"
                                                                                    >
                                                                                        {" "}
                                                                                    </ModalImage>
                                                                                </div>
                                                                            )}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left">
                                                                            {e?.item?.name}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left break-words">
                                                                            {e?.item?.product_variation}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center break-words">
                                                                            {e?.item?.unit_name}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center mr-1">
                                                                            {formatNumber(e?.quantity)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                            {formatMoney(e?.price)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center">
                                                                            {e?.discount_percent + "%"}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-2  rounded-md text-center">
                                                                            {formatMoney(e?.price_after_discount)}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-center ">
                                                                            {formatNumber(e?.tax_rate) + "%"}
                                                                        </h6>
                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-right mr-3.5">
                                                                            {formatMoney(e?.amount)}
                                                                        </h6>

                                                                        <h6 className="text-[13px]   py-0.5 col-span-1 font-medium  text-left ml-3.5 ">
                                                                            {e?.note !=
                                                                                undefined ? (
                                                                                <ExpandableContent
                                                                                    content={
                                                                                        e?.note
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </h6>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </Customscrollbar>
                                                </>
                                            ) : (
                                                <NoData />
                                            )}
                                        </div>
                                        <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                            {props.dataLang?.purchase_total || "purchase_total"}
                                        </h2>
                                        <div className="mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                            <div className="col-span-7">
                                                <h3 className="text-[13px] p-1 font-medium">
                                                    {props.dataLang?.purchase_order_note || "purchase_order_note"}
                                                </h3>
                                                <textarea
                                                    className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                                    disabled
                                                    value={data?.note}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_table_total || "purchase_order_table_total"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_discounty || "purchase_order_detail_discounty"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_money_after_discount || "purchase_order_detail_money_after_discount"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_tax_money || "purchase_order_detail_tax_money"}
                                                    </h3>
                                                </div>
                                                <div className="font-semibold text-left text-[13px]">
                                                    <h3>
                                                        {props.dataLang?.purchase_order_detail_into_money || "purchase_order_detail_into_money"}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_price)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_price_after_discount)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_tax)}
                                                    </h3>
                                                </div>
                                                <div className="font-medium mr-2.5">
                                                    <h3 className="text-right text-blue-600 text-[13px]">
                                                        {formatMoney(data?.total_amount)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Customscrollbar>
                                </div>
                            </div>
                        </div>
                    )) ||
                    (props?.type == "order" && (
                        <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                            <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                                <GeneralInformation {...props} />
                                <div className="grid grid-cols-12 min-h-[100px]">
                                    <div className="col-span-4">
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap">
                                                {props.dataLang?.sales_product_date || "sales_product_date"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                                {data?.date != null
                                                    ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss")
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.sales_product_code || "sales_product_code"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                                {data?.code}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 ">
                                                {props.dataLang?.sales_product_order_type || "sales_product_order_type"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[10px] text-[10px] col-span-4 ml-3">
                                                {data?.quote_code !== null && data?.quote_id !== "0" ? (
                                                    <div className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[80px] lg:w-[80px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                        Phiếu báo giá
                                                    </div>
                                                ) : (
                                                    <div className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-[88px] xl:w-[80px] lg:w-[80px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                        Tạo mới
                                                    </div>
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-span-4 ">
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_code || "price_quote_code"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                                {data?.quote_code}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_customer || "price_quote_customer"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                                {data?.client_name}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_contact_person ||
                                                    "price_quote_contact_person"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                                {data?.contact_name && data?.contact_id !== "0"
                                                    ? data?.contact_name
                                                    : ""}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-4 ">
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.sales_product_staff_in_charge ||
                                                    "sales_product_staff_in_charge"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2">
                                                {data?.staff_name}
                                            </h3>
                                        </div>

                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_order_status || "price_quote_order_status"}
                                                :
                                            </h3>
                                            <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4">
                                                {(data?.status == "un_approved" && (
                                                    <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                        Chưa Duyệt
                                                    </span>
                                                )) ||
                                                    (data?.status == "approved" && (
                                                        <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                            Đã Duyệt
                                                        </span>
                                                    ))}
                                            </h3>
                                        </div>
                                        <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                                {props.dataLang?.price_quote_branch || "price_quote_branch"}:
                                            </h3>
                                            <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[10px]  col-span-4 mr-2 px-2 max-w-[250px] w-fit max-h-[100px] text-center text-[#0F4F9E]  font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] ">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 w-[100%]">
                                    <HeaderTablePopup gridCols={12}>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_image || "price_quote_image"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_item || "price_quote_item"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_variant || "price_quote_variant"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_from_unit || "price_quote_from_unit"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_quantity || "price_quote_quantity"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_unit_price || "price_quote_unit_price"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_person || "price_quote_person"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_after_discount || "price_quote_after_discount"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_tax || "price_quote_tax"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.sales_product_item_date || "sales_product_item_date"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.price_quote_note_item || "price_quote_note_item"}
                                        </ColumnTablePopup>
                                    </HeaderTablePopup>
                                    {onFetching ? (
                                        <Loading className="max-h-20 2xl:max-h-[160px]" color="#0f4f9e" />
                                    ) : data?.items?.length > 0 ? (
                                        <>
                                            <Customscrollbar
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px]"
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className="grid items-center grid-cols-12 3xl:py-1.5 py-0.5 px-2 hover:bg-slate-100/40"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]   py-0.5 col-span-1  rounded-md text-center">
                                                                {e?.item?.images != null ? (
                                                                    <ModalImage
                                                                        small={e?.item?.images}
                                                                        large={e?.item?.images}
                                                                        alt="Product Image"
                                                                        className="custom-modal-image object-cover rounded w-[50px] h-[60px]"
                                                                    />
                                                                ) : (
                                                                    <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                        <ModalImage
                                                                            small="/no_img.png"
                                                                            large="/no_img.png"
                                                                            className="w-full h-full rounded object-contain p-1"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-left">
                                                                {e?.item?.name}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-left break-words">
                                                                {e?.item?.product_variation}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center break-words">
                                                                {e?.item?.unit_name}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                {formatNumber(e?.quantity)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                                {formatNumber(e?.price)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                {e?.discount_percent + "%"}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-right">
                                                                {formatNumber(e?.price_after_discount)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1  rounded-md text-center">
                                                                {formatNumber(e?.tax_rate) + "%"}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px]  px-2 py-0.5 col-span-1 pr-2 rounded-md text-right">
                                                                {formatNumber(e?.amount)}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] col-span-1 rounded-md text-center whitespace-normal">
                                                                {e?.delivery_date != null
                                                                    ? moment(e?.delivery_date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="2xl:text-[13px] xl:text-[12px] text-[11px] pl-4 col-span-1 rounded-md text-left whitespace-normal">
                                                                {e?.note != undefined ? e?.note : ""}
                                                            </h6>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Customscrollbar>
                                        </>
                                    ) : <NoData />}
                                </div>
                                <h2 className="font-normal p-2 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px] border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total || "purchase_total"}
                                </h2>
                                <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between">
                                    <div className="col-span-7 font-medium grid grid-cols-7 text-left">
                                        <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] ">
                                            {props.dataLang?.price_quote_note || "price_quote_note"}
                                        </h3>
                                        <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] col-span-5 font-normal rounded-lg">
                                            {data?.note}
                                        </h3>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>{props.dataLang?.price_quote_total || "price_quote_total"}</h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>
                                                {props.dataLang?.price_quote_total_discount || "price_quote_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>
                                                {props.dataLang?.price_quote_total_money_after_discount ||
                                                    "price_quote_money_after_discount"}
                                            </h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>{props.dataLang?.price_quote_tax_money || "price_quote_tax_money"}</h3>
                                        </div>
                                        <div className="font-normal text-left 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                            <h3>
                                                {props.dataLang?.price_quote_into_money || "price_quote_into_money"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_price)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_discount)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_price_after_discount)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_tax_price)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px]">
                                                {formatNumber(data?.total_amount)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </PopupEdit>
        </>
    );
};
export default Popup_chitietThere;
