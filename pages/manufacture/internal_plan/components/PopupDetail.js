import Link from "next/link";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import ModalImage from "react-modal-image";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
} from "iconsax-react";
import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import ExpandableContent from "@/components/UI/more";
import ImageErrors from "@/components/UI/imageErrors";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import CustomAvatar from "@/components/UI/common/user/CustomAvatar";
import { TagColorLime, TagColorRed } from "@/components/UI/common/Tag/TagStatus";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
const PopupDetail = (props) => {
    const [data, sData] = useState();

    const [open, sOpen] = useState(false);

    const dataSeting = useSetingServer();

    const _ToggleModal = (e) => sOpen(e);

    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const _ServerFetching_detailOrder = () => {
        Axios("GET", `/api_web/api_internal_plan/detailInternalPlan/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    let { data } = response?.data;
                    sData(data);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching_detailOrder();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.internal_plan_detail || "internal_plan_detail"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 3xl:w-[1000px] 2xl:w-[900px] w-[900px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                    <div>
                        <div className="3xl:w-[1000px] 2xl:w-[900px] w-[900px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                    {props.dataLang?.import_detail_info || "import_detail_info"}
                                </h2>
                                <div className="grid grid-cols-9  min-h-[70px] px-2  bg-zinc-50">
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.internalPlans?.date != null ? moment(data?.internalPlans?.date).format("DD/MM/YYYY") : ""}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 col-span-2 items-center">
                                            <h3 className=" text-[13px] font-medium">
                                                {props?.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                            </h3>
                                            <div className="font-medium grid grid-cols-2">
                                                <CustomAvatar profileImage={data?.internalPlans?.created_by_profile_image} fullName={data?.internalPlans?.created_by_full_name} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600 capitalize">
                                                {data?.internalPlans?.reference_no}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.internal_plan_name || "internal_plan_name"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium capitalize">
                                                {data?.internalPlans?.plan_name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.internal_plan_status || "internal_plan_status"}
                                            </h3>
                                            <h3 className=" w-fit">
                                                {/* <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-0.5 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]">
                                                    <TickCircle
                                                        className="bg-lime-500 rounded-full"
                                                        color="white"
                                                        size={15}
                                                    />
                                                    {"Đã lập KHNVL"}
                                                </span> */}
                                                {data?.internalPlans.status == "1" && (
                                                    <TagColorLime name={"Đã Duyệt"} />
                                                )}
                                                {data?.internalPlans.status == "0" && (

                                                    <TagColorRed name={"Chưa Duyệt"} />
                                                )}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.import_branch || "import_branch"}
                                            </h3>
                                            <TagBranch className="w-fit">
                                                {data?.internalPlans?.name_branch}
                                            </TagBranch>
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-[100%]">
                                    <div
                                        className={`grid-cols-12  grid sticky top-0 bg-white shadow-lg  z-10 rounded `}
                                    >
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-4 text-center whitespace-nowrap">
                                            {props.dataLang?.import_detail_items || "import_detail_items"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {"ĐVT"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang?.import_from_quantity || "import_from_quantity"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang?.internal_plan_date || "internal_plan_date"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang?.import_from_note || "import_from_note"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading className="max-h-28" color="#0f4f9e" />
                                    ) : data?.internalPlansItems?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[250px] max-h-[250px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[250px]  max:h-[250px]">
                                                    {data?.internalPlansItems?.map((e, index) => (
                                                        <div
                                                            className={`grid grid-cols-12 hover:bg-slate-50 items-center`}
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]  px-2 py-2 col-span-4 text-left ">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="">
                                                                        {e?.images != null ? (
                                                                            <ModalImage
                                                                                small={e?.images}
                                                                                large={e?.images}
                                                                                alt="Product Image"
                                                                                className="custom-modal-image object-cover rounded w-[40px] h-[40px] mx-auto"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-[40px] h-[40px] object-cover  mx-auto ">
                                                                                <ModalImage
                                                                                    small="/no_img.png"
                                                                                    large="/no_img.png"
                                                                                    className="w-full h-full rounded object-contain p-1"
                                                                                >
                                                                                    {" "}
                                                                                </ModalImage>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item_name}
                                                                        </h6>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.product_variation}
                                                                        </h6>
                                                                        {/* <div className="flex items-center font-oblique flex-wrap">
                                                                            {dataProductSerial.is_enable === "1" ? (
                                                                                <div className="flex gap-0.5">
                                                                                    <h6 className="text-[12px]">
                                                                                        Serial:
                                                                                    </h6>
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                        {e?.item?.serial == null ||
                                                                                        e?.item?.serial == ""
                                                                                            ? "-"
                                                                                            : e?.item?.serial}
                                                                                    </h6>
                                                                                </div>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {dataMaterialExpiry.is_enable === "1" ||
                                                                            dataProductExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Lot:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                            {e?.item?.lot == null ||
                                                                                            e?.item?.lot == ""
                                                                                                ? "-"
                                                                                                : e?.item?.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Date:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                            {e?.item?.expiration_date
                                                                                                ? moment(
                                                                                                      e?.item
                                                                                                          ?.expiration_date
                                                                                                  ).format("DD/MM/YYYY")
                                                                                                : "-"}
                                                                                        </h6>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-center ">
                                                                {e?.unit_name}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-center ">
                                                                {formatNumber(e?.quantity)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-center ">
                                                                {moment(e?.date_needed).format("DD/MM/YYYY")}
                                                            </h6>

                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-left ml-3.5">
                                                                {e?.note_item != undefined ? (
                                                                    <ExpandableContent content={e?.note_item} />
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </h6>
                                                        </div>
                                                    ))}
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
                                                    {props.dataLang?.purchase_order_table_item_not_found ||
                                                        "purchase_order_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-medium p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total || "purchase_total"}
                                </h2>
                                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className="col-span-7">
                                        <h3 className="text-[13px] p-1">
                                            {props.dataLang?.returns_reason || "returns_reason"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                            disabled
                                            value={data?.internalPlans?.note}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1 text-right">
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>{props.dataLang?.internal_plan_total || "internal_plan_total"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(data?.internalPlans?.total_quantity)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default PopupDetail;
