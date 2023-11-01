import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import Zoom from "@/components/UI/zoomElement/zoomElement";
const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });
const TabKeepStock = ({ filterItem, handShowItem, handDeleteItem, isFetching }) => {
    return (
        <>
            <div className="flex justify-start items-center gap-8">
                <h1 className=" text-[#11315B] font-normal 3xl:text-lg text-base">Trạng thái kế hoạch NVL</h1>
                <div className="flex  items-center gap-4">
                    <h3 className="bg-[#EBFEF2] text-[#0BAA2E] py-[6px] px-[10px] font-normal 3xl:text-sm text-xs w-fit rounded-md">
                        Giữ kho
                    </h3>
                    <h3 className="bg-[#FFEEF0] text-[#EE1E1E] py-[2px] px-[10px] font-normal 3xl:text-sm text-xs w-fit rounded-md border-[#EE1E1E] border flex gap-1 items-center">
                        YCMH
                        <span className="bg-[#EE1E1E] text-white 3xl:px-[8.5px] px-[7px] py-0.5 rounded-full">2</span>
                    </h3>
                </div>
            </div>
            {isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
            ) : filterItem?.listData.length > 0 ? (
                <ScrollArea
                    className="3xl:h-[52.5vh] xxl:h-[34.5vh] 2xl:h-[42.5vh] xl:h-[36vh] lg:h-[37.5vh] h-[35vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 "
                    speed={1}
                    smoothScrolling={true}
                >
                    {filterItem?.type == "keepStock" &&
                        filterItem?.listData?.map(
                            (e) =>
                                e.showList && (
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
                                                            onClick={() => handShowItem(e.id)}
                                                            className={`cursor-pointer text-[#3276FA] font-normal 3xl:text-sm text-xs border-b border-[#3276FA] w-fit`}
                                                        >
                                                            {e.showList && e.showChild ? "Ẩn" : "Hiện thêm"}
                                                        </h3>
                                                    </Zoom>
                                                    <Zoom
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 1.08 }}
                                                        className="w-fit"
                                                    >
                                                        <h3
                                                            onClick={() => handDeleteItem(e.id)}
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
                                                <div className="bg-[#FEF8EC] rounded-xl w-fit flex items-center gap-2">
                                                    <div className="bg-[#FF8F0D] h-2 w-2 rounded-full ml-2" />
                                                    <h1 className="text-[#FF8F0D] font-medium 3xl:text-sm text-xs py-1.5 pr-2">
                                                        Kết thúc
                                                    </h1>
                                                </div>
                                            </div>
                                            {e.showList && e.showChild && (
                                                <>
                                                    <div className="grid grid-cols-12 py-2 bg-[#EEF4FD] rounded">
                                                        <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs ">
                                                            Mặt hàng
                                                        </h4>
                                                        <h4 className="col-span-2 flex items-center gap-2 justify-center text-[#344054] font-normal text-xs ">
                                                            Số lượng
                                                            <div className="flex-col flex gap-1 cursor-pointer">
                                                                <Image
                                                                    alt=""
                                                                    width={7}
                                                                    height={4}
                                                                    src={"/productionPlan/Shapedrop.png"}
                                                                    className={` object-cover hover:scale-110 transition-all ease-linear duration-200`}
                                                                />
                                                                <Image
                                                                    alt=""
                                                                    width={7}
                                                                    height={4}
                                                                    src={"/productionPlan/Shapedow.png"}
                                                                    className={` object-cover hover:scale-110 transition-all ease-linear duration-200`}
                                                                />
                                                            </div>
                                                        </h4>
                                                        <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs ">
                                                            Đơn vị tính
                                                        </h4>
                                                        <h4 className="col-span-4 text-[#344054] font-normal text-xs ">
                                                            Trạng thái
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        {e.arrListData.map((i, index) => (
                                                            <div
                                                                key={i.id}
                                                                className={`grid grid-cols-12 items-center ${
                                                                    e.arrListData?.length - 1 == index ? "" : "border-b"
                                                                } `}
                                                            >
                                                                <h4 className="col-span-4 flex items-center py-2 px-4 gap-2">
                                                                    <Image
                                                                        src={i.image}
                                                                        width={36}
                                                                        height={36}
                                                                        className="object-cover rounded"
                                                                    />
                                                                    <h1 className="text-[#0F4F9E] font-semibold 3xl:text-sm text-xs">
                                                                        {i.name}
                                                                    </h1>
                                                                </h4>
                                                                <h4 className="col-span-2 text-center text-[#141522] font-semibold 3xl:text-base text-xs">
                                                                    {i.quantity}
                                                                </h4>
                                                                <h4 className="col-span-2 text-center text-[#52575E] font-normal 3xl:text-sm text-xs">
                                                                    {i.unit}
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
                                                                                    {index === 0 && (
                                                                                        <div
                                                                                            className={`${
                                                                                                j.active
                                                                                                    ? "bg-[#00C170]"
                                                                                                    : "bg-gray-500"
                                                                                            } w-2 h-2 rounded-full`}
                                                                                        />
                                                                                    )}
                                                                                    <div
                                                                                        className={` ${
                                                                                            j.active
                                                                                                ? "bg-[#00C170]"
                                                                                                : "bg-gray-500"
                                                                                        } 3xl:w-[187px] xxl:w-[120px] 2xl:w-[137px] xl:w-[105px] lg:w-[75px] w-[120px] h-[1px]`}
                                                                                    />
                                                                                    {index ===
                                                                                        i.processBar.length - 1 && (
                                                                                        <div
                                                                                            className={`${
                                                                                                j.active
                                                                                                    ? "bg-[#00C170]"
                                                                                                    : "bg-gray-500"
                                                                                            } w-2 h-2 rounded-full`}
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            </motion.div>
                                                                            <div
                                                                                className={`mt-1 ${
                                                                                    index === i.processBar.length - 1 &&
                                                                                    "relative -right-[94%]"
                                                                                }`}
                                                                            >
                                                                                <p
                                                                                    className={`${
                                                                                        j.active
                                                                                            ? "text-[#0BAA2E]"
                                                                                            : "text-gray-500"
                                                                                    } font-normal text-[10px] uppercase`}
                                                                                >
                                                                                    {j.title}
                                                                                </p>
                                                                                <p className="text-[#667085] font-normal text-[10px]">
                                                                                    SL:
                                                                                    <span className="text-[#141522] font-semibold text-[10px] px-1">
                                                                                        {j.quantity}
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
                                )
                        )}
                </ScrollArea>
            ) : (
                <NoData />
            )}
        </>
    );
};
export default TabKeepStock;
