import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { TagWarehouse } from "@/components/UI/common/Tag/TagWarehouse";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { motion } from "framer-motion";
import { TickCircle } from "iconsax-react";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";

const TabKeepStock = ({ dataTable, handShowItem, handDeleteItem, isFetching }) => {
    const dataSeting = useSetingServer();
    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);
    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()
    const [isTab, setIsTab] = useState('dataKeepStock');

    return (
        <>
            <div className="flex justify-start items-center gap-8">
                <h1 className=" text-[#11315B] font-normal 3xl:text-lg text-base">Trạng thái kế hoạch NVL</h1>
                <div className="flex  items-center gap-4">
                    <button type="button" onClick={() => setIsTab('dataKeepStock')} className={`${isTab === 'dataKeepStock' && 'border-green-500 border'} bg-[#EBFEF2] text-[#0BAA2E] py-[2px] px-[10px] font-normal 3xl:text-sm text-xs w-fit rounded-md  flex gap-1 items-center`}>
                        Giữ kho
                        <span className="bg-[#0BAA2E] text-white 3xl:px-[8.5px] px-[7px] py-0.5 rounded-full">{dataTable?.listDataRight?.dataKeepStock?.length}</span>
                    </button>
                    <button type="button" onClick={() => setIsTab('dataPurchases')} className={`${isTab === 'dataPurchases' && 'border-[#EE1E1E] border'} bg-[#FFEEF0] text-[#EE1E1E] py-[2px] px-[10px] font-normal 3xl:text-sm text-xs w-fit rounded-md  flex gap-1 items-center`}>
                        YCMH
                        <span className="bg-[#EE1E1E] text-white 3xl:px-[8.5px] px-[7px] py-0.5 rounded-full">{dataTable?.listDataRight?.dataPurchases?.length}</span>
                    </button>
                </div>
            </div>
            {isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
            ) : dataTable?.listDataRight?.[isTab]?.length > 0 ? (
                <Customscrollbar className="3xl:h-[52.5vh] xxl:h-[34.5vh] 2xl:h-[42.5vh] xl:h-[36vh] lg:h-[37.5vh] h-[35vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 "
                >
                    {isTab === 'dataKeepStock' && dataTable?.listDataRight?.dataKeepStock?.map(
                        (e) =>
                            <div key={e.id} className="border my-3 rounded">
                                <div className="px-2">
                                    <div className="my-2 flex justify-between items-center">
                                        <h3 className="text-[#191D23] font-semibold 3xl:text-base  text-sm">
                                            {e.title}
                                        </h3>
                                        <div className="flex items-center gap-6 mr-3">
                                            <Zoom
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 1.08 }}
                                                className="w-fit"
                                            >
                                                <h3
                                                    onClick={() => handShowItem(e.id, isTab)}
                                                    className={`cursor-pointer text-[#3276FA] font-normal 3xl:text-sm text-xs border-b border-[#3276FA] w-fit`}
                                                >
                                                    {e.showChild ? "Ẩn" : "Hiện thêm"}
                                                </h3>
                                            </Zoom>
                                            <Zoom
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 1.08 }}
                                                className="w-fit"
                                            >
                                                <h3
                                                    onClick={() => handDeleteItem(e.id, isTab)}
                                                    className="cursor-pointer text-[#EE1E1E] font-normal 3xl:text-sm text-xs border-b border-[#EE1E1E] w-fit"
                                                >
                                                    {"Xoá"}
                                                </h3>

                                            </Zoom>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 my-2">
                                        <h5 className="text-[#3A3E4C] font-normal 3xl:text-sm text-xs">
                                            {e.time}
                                            <span className="px-2 text-[#9295A4] font-normal 3xl:text-sm text-xs">
                                                bởi
                                            </span>
                                            {e.user}
                                        </h5>
                                        <TagWarehouse data={e?.warehousemanId} />
                                    </div>
                                    <div className="flex items-center gap-5 my-2">
                                        <h5 className="text-[#3A3E4C] font-normal 3xl:text-sm text-xs">
                                            <span className="pr-2 text-[#9295A4] font-normal 3xl:text-sm text-xs">
                                                Kho chuyển:
                                            </span>
                                            {e.warehouseFrom}
                                        </h5>
                                        <h5 className="text-[#3A3E4C] font-normal 3xl:text-sm text-xs">
                                            <span className="pr-2 text-[#9295A4] font-normal 3xl:text-sm text-xs">
                                                Kho nhận:
                                            </span>
                                            {e.warehouseTo}
                                        </h5>
                                    </div>

                                    {e.showChild && (
                                        <>
                                            <div className="grid grid-cols-12 py-2 bg-[#EEF4FD] rounded">
                                                <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs ">
                                                    Mặt hàng
                                                </h4>
                                                <h4 className="col-span-2 flex items-center gap-2 justify-center text-[#344054] font-normal text-xs ">
                                                    Số lượng giữ kho
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs ">
                                                    Đơn vị tính
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs ">
                                                    Vị trí chuyển
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs ">
                                                    Vị trí nhận
                                                </h4>
                                            </div>
                                            <div>
                                                {e.arrListData.map((i, index) => (
                                                    <div
                                                        key={i.id}
                                                        className={`grid grid-cols-12 items-center ${e.arrListData?.length - 1 == index ? "" : "border-b"} `}
                                                    >
                                                        <h4 className="col-span-4 flex items-center py-2 px-4 gap-2">
                                                            <Image
                                                                src={i.image}
                                                                width={36}
                                                                height={36}
                                                                className="object-cover rounded"
                                                            />
                                                            <div className="flex flex-col gap-0.5">
                                                                <h1 className="text-[#0F4F9E] font-semibold 3xl:text-sm text-xs">
                                                                    {i.name}
                                                                </h1>
                                                                <h1 className="text-[#9295A4] font-normal text-[10px]">
                                                                    {i.code} - {i.itemVariation}
                                                                </h1>
                                                                <div className="flex items-center font-oblique flex-wrap">
                                                                    {dataProductSerial.is_enable === "1" ? (
                                                                        <div className="flex gap-0.5">
                                                                            <h6 className="text-[12px]">
                                                                                Serial:
                                                                            </h6>
                                                                            <h6 className="text-[10px]  px-2   w-[full] text-left ">
                                                                                {i?.serial == null || i?.serial == "" ? "-" : i?.serial}
                                                                            </h6>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                                        <>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[10px]">
                                                                                    Lot:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[10px]  px-2   w-[full] text-left ">
                                                                                    {i?.lot == null || i?.lot == "" ? "-" : i?.lot}
                                                                                </h6>
                                                                            </div>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[10px]">
                                                                                    Date:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[10px]  px-2   w-[full] text-center ">
                                                                                    {i?.expiration_date ? moment(i?.expiration_date).format("DD/MM/YYYY") : "-"}
                                                                                </h6>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </h4>
                                                        <h4 className="col-span-2 text-center text-[#141522] font-semibold 3xl:text-base text-xs">
                                                            {formatNumber(i.quantity)}
                                                        </h4>
                                                        <h4 className="col-span-2 text-center text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                            {i.unit}
                                                        </h4>
                                                        <h4 className="col-span-2 text-center text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                            {i.locationFrom}
                                                        </h4>
                                                        <h4 className="col-span-2 text-center text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                            {i.locationTo}
                                                        </h4>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                    )}
                    {isTab === 'dataPurchases' && dataTable?.listDataRight?.dataPurchases?.map(
                        (e) =>
                            <div key={e.id} className="border my-3 rounded">
                                <div className="px-2">
                                    <div className="my-2 flex justify-between items-center">
                                        <h3 className="text-[#191D23] font-semibold 3xl:text-base  text-sm">
                                            {e.title}
                                        </h3>
                                        <div className="flex items-center gap-6 mr-3">
                                            <Zoom
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 1.08 }}
                                                className="w-fit"
                                            >
                                                <h3
                                                    onClick={() => handShowItem(e.id, 'dataPurchases')}
                                                    className={`cursor-pointer text-[#3276FA] font-normal 3xl:text-sm text-xs border-b border-[#3276FA] w-fit`}
                                                >
                                                    {e.showChild ? "Ẩn" : "Hiện thêm"}
                                                </h3>
                                            </Zoom>
                                            <Zoom
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 1.08 }}
                                                className="w-fit"
                                            >
                                                <h3
                                                    onClick={() => handDeleteItem(e.id, isTab)}
                                                    className="cursor-pointer text-[#EE1E1E] font-normal 3xl:text-sm text-xs border-b border-[#EE1E1E] w-fit"
                                                >
                                                    {"Xoá"}
                                                </h3>
                                            </Zoom>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 my-2">
                                        <h5 className="text-[#3A3E4C] font-normal 3xl:text-sm text-xs">
                                            {e.time}
                                            <span className="px-2 text-[#9295A4] font-normal 3xl:text-sm text-xs">
                                                bởi
                                            </span>
                                            {e.user}
                                        </h5>
                                        {/* <div className="bg-[#FEF8EC] rounded-xl w-fit flex items-center gap-2">
                                            <div className="bg-[#FF8F0D] h-2 w-2 rounded-full ml-2" />
                                            <h1 className="text-[#FF8F0D] font-medium 3xl:text-sm text-xs py-1.5 pr-2">
                                                Kết thúc
                                            </h1>
                                        </div> */}
                                        {e?.status == 0 &&
                                            <div className={` font-medium text-[#3b82f6]  rounded-2xl py-1 px-2 w-fit  bg-[#bfdbfe] text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px]`}>
                                                Chưa duyệt
                                            </div>
                                            ||
                                            e?.status != 0 &&
                                            <div className={`font-medium gap-1  text-lime-500   rounded-2xl py-1 px-2 w-fit  bg-lime-200 text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] flex items-center justify-center`}>
                                                <TickCircle
                                                    className="bg-lime-500 rounded-full animate-pulse "
                                                    color="white"
                                                    size={15}
                                                />
                                                <span>
                                                    Đã duyệt
                                                </span>
                                            </div>
                                        }
                                    </div>
                                    {e.showChild && (
                                        <>
                                            <div className="grid grid-cols-12 py-2 bg-[#EEF4FD] rounded">
                                                <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs ">
                                                    Mặt hàng
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs ">
                                                    Đơn vị tính
                                                </h4>
                                                <h4 className="col-span-2 flex items-center gap-2 justify-center text-[#344054] font-normal text-xs ">
                                                    Số lượng
                                                </h4>
                                                <h4 className="col-span-4 text-[#344054] font-normal text-xs ">
                                                    Trạng thái
                                                </h4>
                                            </div>
                                            <div>
                                                {e.arrListData.map((i, index) => (
                                                    <div
                                                        key={i.id}
                                                        className={`grid grid-cols-12 items-center ${e.arrListData?.length - 1 == index ? "" : "border-b"
                                                            } `}
                                                    >
                                                        <h4 className="col-span-4 flex items-center py-2 px-4 gap-2">
                                                            <Image
                                                                src={i.image}
                                                                width={36}
                                                                height={36}
                                                                className="object-cover rounded"
                                                            />
                                                            <div className="flex flex-col gap-0.5">
                                                                <h1 className="text-[#0F4F9E] font-semibold 3xl:text-sm text-xs">
                                                                    {i.name}
                                                                </h1>
                                                                <h1 className="text-[#9295A4] font-normal text-[10px]">
                                                                    {i.code} - {i.itemVariation}
                                                                </h1>
                                                                <div className="flex items-center font-oblique flex-wrap">
                                                                    {dataProductSerial.is_enable === "1" ? (
                                                                        <div className="flex gap-0.5">
                                                                            <h6 className="text-[12px]">
                                                                                Serial:
                                                                            </h6>
                                                                            <h6 className="text-[10px]  px-2   w-[full] text-left ">
                                                                                {i?.serial == null || i?.serial == "" ? "-" : i?.serial}
                                                                            </h6>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                                        <>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[10px]">
                                                                                    Lot:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[10px]  px-2   w-[full] text-left ">
                                                                                    {i?.lot == null || i?.lot == "" ? "-" : i?.lot}
                                                                                </h6>
                                                                            </div>
                                                                            <div className="flex gap-0.5">
                                                                                <h6 className="text-[10px]">
                                                                                    Date:
                                                                                </h6>{" "}
                                                                                <h6 className="text-[10px]  px-2   w-[full] text-center ">
                                                                                    {i?.expiration_date ? moment(i?.expiration_date).format("DD/MM/YYYY") : "-"}
                                                                                </h6>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </h4>
                                                        <h4 className="col-span-2 text-center text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                            {i.unit}
                                                        </h4>
                                                        <h4 className="col-span-2 text-center text-[#141522] font-semibold 3xl:text-base text-xs">
                                                            {formatNumber(i.quantity)}
                                                        </h4>
                                                        <div className="col-span-2 flex items-center">
                                                            {i.processBar.map((j, index) => (
                                                                <div className="flex flex-col my-2" key={j.id}>
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ duration: 0.5 }}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            {index === 0 && <div className={`${j.active ? "bg-[#00C170]" : "bg-gray-500"} w-[10px] h-[10px] rounded-full`} />}
                                                                            <div className={`${j.active ? "bg-[#00C170]" : "bg-gray-500"} 3xl:w-[167px] xxl:w-[110px] 2xl:w-[127px] xl:w-[100px] lg:w-[65px] w-[110px] h-[2px]`} />
                                                                            {index === i.processBar.length - 1 && <div className={`${j.active ? "bg-[#00C170]" : "bg-gray-500"} w-[10px] h-[10px] rounded-full`} />}
                                                                        </div>
                                                                    </motion.div>
                                                                    <div className={`mt-1 ${index === i.processBar.length - 1 && "relative -right-[94%]"}`}>
                                                                        <p className={`${j.active ? "text-[#0BAA2E]" : "text-gray-500"} font-normal text-[10px] uppercase`}>
                                                                            {j.title}
                                                                        </p>
                                                                        <p className={` ${j.quantity > 0 ? "opacity-100" : "opacity-0"} text-[#0BAA2E] font-normal text-[10px]`}>
                                                                            SL:
                                                                            <span className="text-[#0BAA2E] font-semibold text-[10px] px-1">
                                                                                {formatNumber(j.quantity)}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                    )}
                </Customscrollbar>
            ) : <NoData />}
        </>
    );
};


export default TabKeepStock;
