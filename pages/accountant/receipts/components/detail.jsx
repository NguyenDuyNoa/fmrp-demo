import React, { useEffect, useState } from "react";

import useSetingServer from "@/hooks/useConfigNumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
import { getdataDetail } from "../../../../Api/apiReceipts/api";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import { TagColorMore, TagColorOrange, TagColorRed, TagColorSky } from "@/components/UI/common/Tag/TagStatus";
import CustomAvatar from "@/components/UI/common/user/CustomAvatar";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupEdit from "@/components/UI/Popup";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { formatMoment } from "@/utils/helpers/formatMoment";
const Popup_chitiet = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);
    const dataSeting = useSetingServer()
    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (number) => {
        return formatMoneyConfig(+number, dataSeting);
    };

    const _ServerFetching_detail = () => {
        getdataDetail(props?.id, (err, result) => {
            if (err) return console.error(err);
            sData(result);
        });
        sOnFetching(false);
    };

    useEffect(() => {
        onFetching && _ServerFetching_detail();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.receipts_detail || "receipts_detail"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 w-[530px] h-auto">
                    <div>
                        <div className="w-[530px]">
                            <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]  pb-1">
                                <GeneralInformation {...props} />
                                <div className="min-h-[130px] px-2 bg-gray-50 ">
                                    <Customscrollbar className="grid grid-cols-2 space-x-4 3xl:max-h-[400px] xxl:max-h-[300px] 2xl:max-h-[350px] xl:max-h-[300px] lg:max-h-[280px] max-h-[300px]">
                                        <div className="col-span-1">
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium">
                                                    {data?.date != null ? formatMoment(data?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.payment_creator || "payment_creator"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start relative">
                                                    <CustomAvatar fullName={data?.staff_name} profileImage={data?.profile_image} />
                                                </div>
                                            </div>
                                            <div className=" font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.payment_obType || "payment_obType"}
                                                </h3>
                                                {(data?.objects === "client" && (
                                                    <TagColorSky name={props.dataLang[data?.objects] || data?.objects} />
                                                )) ||
                                                    (data?.objects === "supplier" && (
                                                        <TagColorOrange name={props.dataLang[data?.objects] || data?.objects} />
                                                    )) ||
                                                    (data?.objects === "other" && (
                                                        <TagColorRed name={props.dataLang[data?.objects] || data?.objects} />
                                                    ))}
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                                </h3>
                                                {(data?.type_vouchers === "import" && (
                                                    <TagColorMore color={'#a855f7'} backgroundColor={"#e9d5ff"} name={props.dataLang[data?.type_vouchers] || data?.type_vouchers} />
                                                )) ||
                                                    (data?.type_vouchers === "deposit" && (
                                                        <TagColorMore color={'#06b6d4'} backgroundColor={"#a5f3fc"} name={props.dataLang[data?.type_vouchers] || data?.type_vouchers} />
                                                    )) ||
                                                    (data?.type_vouchers === "service" && (
                                                        <TagColorRed name={props.dataLang[data?.type_vouchers] || data?.type_vouchers} />
                                                    )) ||
                                                    (data?.type_vouchers === "order" && (
                                                        <TagColorMore color={'#22c55e'} backgroundColor={'#bbf7d0'} name={props.dataLang[data?.type_vouchers] || data?.type_vouchers} />
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="col-span-1 ">
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.payment_code || "payment_code"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium text-blue-600">
                                                    {data?.code}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.payment_TT_method || "payment_TT_method"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium">{data?.payment_mode_name}</h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.payment_ob || "payment_ob"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start">
                                                    <h3 className=" text-[13px]  font-medium">{data?.object_text}</h3>
                                                </div>
                                            </div>
                                            <div className=" font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">{"Chi nhánh"}</h3>
                                                <TagBranch className="w-fit">
                                                    {data?.branch_name}
                                                </TagBranch>
                                            </div>
                                        </div>
                                    </Customscrollbar>
                                    <div className="mb-4 font-semibold col-span-2 grid grid-cols-4 ">
                                        <h3 className=" text-[13px] col-span-1 ">
                                            {props.dataLang?.payment_voucherCode || "payment_voucherCode"}
                                        </h3>
                                        <div className="flex flex-wrap col-span-3 gap-2 items-center justify-start font-medium">
                                            {data?.voucher?.length > 0 && data?.voucher?.map((code, index) => (
                                                <React.Fragment key={code?.id}>
                                                    {code.code}
                                                    {index !== data?.voucher.length - 1 && ", "}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <h2 className="font-semibold bg-[#ECF0F4]  p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5">
                                    {props.dataLang?.receipts_info || "receipts_info"}
                                </h2>
                                <div className=" w-[100%]">
                                    <HeaderTablePopup gridCols={5} className={'!rounded-none'}>
                                        <ColumnTablePopup>
                                            #
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={2}>
                                            {props.dataLang?.receipts_code || "receipts_code"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup>
                                            {props.dataLang?.receipts_money || "receipts_money"}
                                        </ColumnTablePopup>
                                    </HeaderTablePopup>
                                    {onFetching ? (
                                        <Loading className="max-h-28" color="#0f4f9e" />
                                    ) : data?.voucher?.length > 0 ? (
                                        <>
                                            <Customscrollbar
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px]"
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.voucher?.map((e, index) => (
                                                        <div
                                                            className="grid grid-cols-5 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px] col-span-1 font-medium  py-2  text-center break-words">
                                                                {index + 1}
                                                            </h6>
                                                            <h6 className="text-[13px] col-span-2 font-medium pl-2 py-2  text-left break-words">
                                                                {e?.code}
                                                            </h6>
                                                            <h6 className="text-[13px] col-span-2 font-medium pl-2 py-2  text-center">
                                                                {formatNumber(e?.money)}
                                                            </h6>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Customscrollbar>
                                        </>
                                    ) : <NoData />}
                                </div>
                                <h2 className="font-semibold p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total || "purchase_total"}
                                </h2>
                                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className="col-span-7">
                                        <h3 className="text-[13px] font-semibold">
                                            {props.dataLang?.import_from_note || "import_from_note"}
                                        </h3>
                                        <textarea
                                            className="text-[13px] resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-1 outline-none "
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
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(data?.total)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Customscrollbar>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};

export default Popup_chitiet;
