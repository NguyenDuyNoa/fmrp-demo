import apiImport from "@/api/apiPurchaseOrder/apiImport";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagSingle } from "@/components/UI/common/Tag/TagSingle";
import { TagColorLime, TagColorOrange, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import { TagWarehouse } from "@/components/UI/common/Tag/TagWarehouse";
import NoData from "@/components/UI/noData/nodata";
import { reTryQuery } from "@/configs/configRetryQuery";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useQuery } from "@tanstack/react-query";
import ImageErrors from "components/UI/imageErrors";
import Loading from "components/UI/loading";
import ExpandableContent from "components/UI/more";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import PopupCustom from "/components/UI/popup";
const Popup_chitiet = (props) => {
    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [data, sData] = useState();

    const dataSeting = useSetingServer()

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()


    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    };

    const formatMoney = (number) => {
        return formatMoneyConfig(+number, dataSeting)
    };

    const { isFetching } = useQuery({
        queryKey: ['api_detail_import', props?.id],
        queryFn: async () => {
            const db = await apiImport.apiDetailImport(props?.id);
            sData(db);
            return db
        },
        enabled: open && !!props?.id,
        ...reTryQuery
    })

    return (
        <>
            <PopupCustom
                title={props.dataLang?.import_detail_title || "import_detail_title"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                    <div>
                        <div className="3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <GeneralInformation  {...props} />
                                <div className="grid grid-cols-9  min-h-[130px] px-2">
                                    <div className="col-span-3">
                                        <div className="my-4 font-semibold grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null ? formatMoment(data?.date, FORMAT_MOMENT.DATE_TIME_SLASH_LONG) : ""}
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
                                            <TagSingle name={data?.purchase_order_code} />
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
                                                        <TagColorSky className={'!py-1'} name={'Chưa chi'} />
                                                    )) ||
                                                    (data?.status_pay ===
                                                        "spent_part" && (
                                                            <TagColorOrange className={'!py-1'} name={`Chi 1 phần ${formatNumber()}`} />
                                                        )) ||
                                                    (data?.status_pay ===
                                                        "spent" && (
                                                            <TagColorLime className={'!py-1'} name={'Đã chi đủ'} />
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
                                        <div className="my-2 font-medium grid grid-cols-2">
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
                                <div className="pr-2 w-[100%] ">
                                    <HeaderTablePopup gridCols={13}>
                                        {/* <ColumnTablePopup colSpan={2} textAlign={"left"}> */}
                                        <ColumnTablePopup>
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
                                    {isFetching ? (
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
                                                    {data?.items?.map((e) => (
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
                                                                            e?.item?.images
                                                                        }
                                                                        large={
                                                                            e?.item?.images
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
                                                                        e?.item?.name
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
                                                                                    Hạn
                                                                                    sử
                                                                                    dụng:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                    {e.expiration_date ? formatMoment(e.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
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
                                                            <h6 className="text-[13px] font-medium   px-2 py-0.5 col-span-1 text-left break-words">
                                                                {
                                                                    e?.warehouse_name
                                                                }
                                                                {e?.warehouse_name
                                                                    ? " - "
                                                                    : ""}
                                                                {
                                                                    e.location_name
                                                                }
                                                            </h6>
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
                                                                {formatNumber(e?.discount_percent) + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                {formatMoney(e?.price_after_discount)}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-center">
                                                                {formatNumber(e?.tax_rate) + "%"}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-right ">
                                                                {formatMoney(e?.amount)}
                                                            </h6>
                                                            <h6 className="text-[13px] font-medium   py-0.5 col-span-1 text-left ml-3.5">
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
                                                    ))}
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
                            </div>
                        </div>
                    </div>
                </div>
            </PopupCustom >
        </>
    );
};
export default Popup_chitiet;
