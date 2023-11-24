import Image from "next/image";

import dynamic from "next/dynamic";

import Loading from "@/components/UI/loading";

import NoData from "@/components/UI/noData/nodata";

const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });

const TabItem = ({ filterItem, handShowItem, isFetching }) => {
    return (
        <>
            <h1 className="text-[#11315B] font-normal 3xl:text-lg text-base">Danh sách sản phẩm (theo đơn hàng)</h1>
            <div className="my-4">
                <div className="grid grid-cols-10 my-4">
                    <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs uppercase">Đơn hàng</h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">Số lượng</h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                        Số lượng dự phòng
                    </h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                        Tổng số lượng
                    </h4>
                </div>
            </div>
            {isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
            ) : (
                <ScrollArea
                    className="3xl:h-[47.7vh] xxl:h-[27.5vh] 2xl:h-[36vh] xl:h-[29vh] lg:h-[30.5vh] h-[34vh] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 "
                    speed={1}
                    smoothScrolling={true}
                >
                    {filterItem?.type == "item" && filterItem.listData.length > 0 ? (
                        filterItem?.listData?.map((e) => (
                            <>
                                {e.showList && (
                                    <div key={e.id} className="grid grid-cols-10 items-center ">
                                        <div
                                            onClick={() => handShowItem(e.id)}
                                            className="col-span-10 bg-[#EEF4FD] flex items-center gap-0.5 my-1 rounded cursor-pointer"
                                        >
                                            <Image
                                                src={"/materials_planning/dow.png"}
                                                width={14}
                                                height={17}
                                                className={`object-cover ${
                                                    e.showChild ? "" : "-rotate-90"
                                                } transition-all duration-150 ease-linear`}
                                            />
                                            <h1 className="text-[#52575E] font-semibold 3xl:text-sm text-xs py-2">
                                                {e.title}
                                            </h1>
                                        </div>

                                        {e.showChild &&
                                            e.arrListData.map((i, index) => (
                                                <div
                                                    key={i.id}
                                                    className={`grid grid-cols-10 items-center col-span-10  ${
                                                        e.arrListData?.length - 1 == index ? "" : "border-b"
                                                    }`}
                                                >
                                                    <h4 className="col-span-4 text-[#344054] font-normal text-xs flex items-center py-2 px-4 gap-2">
                                                        <Image
                                                            src={i.image}
                                                            width={36}
                                                            height={36}
                                                            className="object-cover rounded"
                                                        />
                                                        <div className="flex flex-col gap-0.5">
                                                            <h1 className="text-[#000000] font-semibold 3xl:text-sm text-xs">
                                                                {i.name}
                                                            </h1>
                                                            <h1 className="text-[#9295A4] font-normal text-[10px]">
                                                                {i.subName}
                                                            </h1>
                                                        </div>
                                                    </h4>
                                                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                        {i.quantity}
                                                    </h4>
                                                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                        {i.quantityPreventive}
                                                    </h4>
                                                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                                                        {i.quantityTotal}
                                                    </h4>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </>
                        ))
                    ) : (
                        <NoData />
                    )}
                </ScrollArea>
            )}
        </>
    );
};
export default TabItem;
