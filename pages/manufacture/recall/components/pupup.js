import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
} from "iconsax-react";

import "react-datepicker/dist/react-datepicker.css";

import moment from "moment/moment";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "@/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";

import { useEffect } from "react";

import ExpandableContent from "@/components/UI/more";
import ImageErrors from "@/components/UI/imageErrors";
import LinkWarehouse from "@/pages/manufacture/components/linkWarehouse";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import useFeature from "@/hooks/useConfigFeature";
import { TagWarehouse } from "@/components/UI/common/Tag/TagWarehouse";
import CustomAvatar from "@/components/UI/common/user/CustomAvatar";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import NoData from "@/components/UI/noData/nodata";

const Popup_chitiet = (props) => {
    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [data, sData] = useState();

    const dataSeting = useSetingServer()

    const { dataMaterialExpiry } = useFeature()

    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting)
    };

    const _ServerFetching_detailOrder = () => {
        Axios(
            "GET",
            `/api_web/Api_material_recall/materialRecall/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sData(data);
                }
                sOnFetching(false);
            }
        );
    };
    useEffect(() => {
        setTimeout(() => {
            (onFetching && _ServerFetching_detailOrder())
        }, 400);
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.recall_title_detail || "recall_title_detail"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 3xl:w-[1200px] 2xl:w-[1150px] w-[1100px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                    <div>
                        <div className="3xl:w-[1200px] 2xl:w-[1150px] w-[1100px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2 text-[13px]">
                                    {props.dataLang?.import_detail_info || "import_detail_info"}
                                </h2>
                                <div className="grid grid-cols-9  min-h-[100px] px-2 items-center bg-zinc-50">
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium">
                                                {data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h3>
                                            <h3 className=" text-[13px]  font-medium text-blue-600 capitalize">
                                                {data?.code}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props?.dataLang?.production_warehouse_LSX ||
                                                    "production_warehouse_LSX"}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props.dataLang?.import_from_browse || "import_from_browse"}
                                            </h3>
                                            <div className="flex flex-wrap  gap-2 items-center ">
                                                <TagWarehouse data={data} />
                                            </div>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props?.dataLang?.productsWarehouse_warehouseImport || "productsWarehouse_warehouseImport"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium capitalize">
                                                {/* {data?.warehouse_name} */}
                                                <LinkWarehouse
                                                    open={open}
                                                    warehouse_id={data?.warehouse_id}
                                                    warehouse_name={data?.warehouse_name}
                                                />
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props?.dataLang?.production_warehouse_Total_value || "production_warehouse_Total_value"}
                                            </h3>
                                            <h3 className="text-[13px] font-medium capitalize">
                                                {formatNumber(data?.grand_total)}
                                            </h3>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className=" text-[13px] ">
                                                {props?.dataLang?.production_warehouse_creator || "production_warehouse_creator"}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <CustomAvatar data={data} fullName={data?.staff_create?.full_name} profileImage={data?.staff_create?.profile_image} />
                                            </div>
                                        </div>
                                        <div className="my-2 font-medium grid grid-cols-2">
                                            <h3 className="text-[13px]">
                                                {props.dataLang?.import_branch || "import_branch"}
                                            </h3>
                                            <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-[100%]">
                                    <div
                                        className={`grid-cols-11  grid sticky top-0 bg-white shadow-lg  z-10 rounded `}
                                    >
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-3 text-center whitespace-nowrap">
                                            {props.dataLang?.import_detail_items || "import_detail_items"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang?.productsWarehouse_warehouseLocaImport ||
                                                "productsWarehouse_warehouseLocaImport"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1 text-center whitespace-nowrap">
                                            {"ĐVT"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang?.recall_revenueQty || "recall_revenueQty"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang?.import_from_note || "import_from_note"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading className="max-h-28" color="#0f4f9e" />
                                    ) : data?.items?.length > 0 ? (
                                        <>
                                            <Customscrollbar
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px]"
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-11 hover:bg-slate-50 items-center"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]  px-2 py-2 col-span-3 text-left ">
                                                                <div className="flex items-center gap-2">
                                                                    <div>
                                                                        {e?.item?.images != null ? (
                                                                            <ModalImage
                                                                                small={e?.item?.images}
                                                                                large={e?.item?.images}
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
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item?.name}
                                                                        </h6>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {e?.item?.product_variation}
                                                                        </h6>
                                                                        <div className="flex items-center font-oblique flex-wrap">
                                                                            {dataMaterialExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Lot:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                            {e?.lot == null ||
                                                                                                e?.lot == ""
                                                                                                ? "-"
                                                                                                : e?.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Date:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                            {e?.expiration_date
                                                                                                ? moment(
                                                                                                    e?.expiration_date
                                                                                                ).format("DD/MM/YYYY")
                                                                                                : "-"}
                                                                                        </h6>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]   px-2 py-2 col-span-2 text-center break-words">
                                                                <h6 className="font-medium">
                                                                    {e?.warehouse?.location_name}
                                                                </h6>
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {e?.item?.unit}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-center mr-1">
                                                                {formatNumber(e?.quantity)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-left ml-3.5">
                                                                {e?.note != undefined ? (
                                                                    <ExpandableContent content={e?.note} />
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
                                        <h3 className="text-[13px] p-1">
                                            {props.dataLang?.returns_reason || "returns_reason"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1 text-right">
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>
                                                {props?.dataLang?.production_warehouse_totalItem ||
                                                    "production_warehouse_totalItem"}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-left text-[13px]">
                                            <h3>{props.dataLang?.recall_totalQty || "recall_totalQty"}</h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(data?.items?.length)}
                                            </h3>
                                        </div>
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(
                                                    data?.items?.reduce(
                                                        (total, item) => total + Number(item.quantity),
                                                        0
                                                    )
                                                )}
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
export default Popup_chitiet;
