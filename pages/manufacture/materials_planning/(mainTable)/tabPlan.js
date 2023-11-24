import Image from "next/image";
import dynamic from "next/dynamic";

import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";

const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });

const TabPlan = ({ filterItem, isFetching }) => {
    return (
        <>
            <div className="flex items-start">
                <h1 className="w-1/2 text-[#11315B] font-normal 3xl:text-lg text-base">
                    Danh sách kế hoạch bán thành phẩm
                </h1>
                <h1 className="w-1/2 text-[#11315B] font-normal 3xl:text-lg text-base">
                    Danh sách kế hoạch nguyên vật liệu
                </h1>
            </div>
            {filterItem?.type == "plan" && (
                <div className="flex gap-2">
                    <div className="w-1/2 ">
                        <div className="grid grid-cols-12 items-center py-2 bg-[#FBFCEE] rounded">
                            <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs capitalize">Bán TP</h4>
                            <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs capitalize">
                                ĐVT
                            </h4>
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                                S.dụng
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
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                                Tồn
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
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                                Thiếu
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
                        </div>
                        {isFetching ? (
                            <Loading className="h-80" color="#0f4f9e" />
                        ) : filterItem.listData.length > 0 ? (
                            <ScrollArea
                                className="3xl:h-[49.5vh] xxl:h-[30vh] 2xl:h-[38.5vh] xl:h-[31.5vh] lg:h-[33vh] h-[34vh]"
                                speed={1}
                                smoothScrolling={true}
                            >
                                {filterItem.listData.map(
                                    (e, index) =>
                                        e.showList &&
                                        e.type == "semiProducts" && (
                                            <div
                                                key={e.id}
                                                className={`grid grid-cols-12 items-center py-2 border-b
                                           `}
                                            >
                                                <h4 className="col-span-4 px-4 text-[#141522] flex items-center gap-2 font-medium text-sm">
                                                    <Image
                                                        src={e.image}
                                                        width={44}
                                                        height={44}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    {e.name}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.unit}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.use}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.exist}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.lack}
                                                </h4>
                                            </div>
                                        )
                                )}
                            </ScrollArea>
                        ) : (
                            <NoData />
                        )}
                    </div>
                    <div className="w-1/2 ">
                        <div className="grid grid-cols-13 items-center py-2 bg-[#F2FBF7] rounded">
                            <h4 className="col-span-3 px-4 text-[#344054] font-normal text-xs capitalize whitespace-nowrap">
                                Nguyên vật liệu
                            </h4>
                            <h4 className="col-span-2 px-4 text-center text-[#344054] font-normal text-xs capitalize">
                                ĐVT
                            </h4>
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                                S.dụng
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
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-1 text-[#344054] font-normal text-xs capitalize">
                                Tồn
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
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-1 text-[#344054] font-normal text-xs capitalize">
                                Q.đổi
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
                            <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                                Thiếu
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
                        </div>
                        {isFetching ? (
                            <Loading className="h-80" color="#0f4f9e" />
                        ) : filterItem.listData.length > 0 ? (
                            <ScrollArea
                                className="3xl:h-[49.5vh] xxl:h-[30vh] 2xl:h-[38.5vh] xl:h-[31.5vh] lg:h-[33vh] h-[34vh]"
                                speed={1}
                                smoothScrolling={true}
                            >
                                {filterItem.listData.map(
                                    (e, index) =>
                                        e.showList &&
                                        e.type == "materials" && (
                                            <div
                                                key={e.id}
                                                className={`grid grid-cols-13 items-center py-2 ${
                                                    filterItem.listData?.length - 1 == index ? "" : "border-b"
                                                }`}
                                            >
                                                <h4 className="col-span-3 px-4 text-[#141522] flex items-center gap-2 font-medium text-sm">
                                                    <Image
                                                        src={e.image}
                                                        width={44}
                                                        height={44}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    {e.name}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.unit}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.use}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.exchange}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.exist}
                                                </h4>
                                                <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                                    {e.lack}
                                                </h4>
                                            </div>
                                        )
                                )}
                            </ScrollArea>
                        ) : (
                            <NoData />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
export default TabPlan;
