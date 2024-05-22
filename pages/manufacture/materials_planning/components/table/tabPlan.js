import dynamic from "next/dynamic";
import Image from "next/image";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import Loading from "@/components/UI/loading";
import NoData from "@/components/UI/noData/nodata";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import ModalImage from "react-modal-image";

const TabPlan = ({ dataTable, isFetching }) => {
    const { dataBom } = dataTable.listDataRight
    console.log("dataBom", dataBom);
    // productsBom bán tp
    const dataSeting = useSetingServer();
    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);
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
            <div className="flex gap-2">
                <div className="w-1/2 ">
                    <div className="grid grid-cols-12 items-center py-2 bg-[#FBFCEE] rounded">
                        <h4 className="col-span-5 px-4 text-[#344054] font-normal text-xs capitalize">Bán TP</h4>
                        <h4 className="col-span-1 px-4 text-center text-[#344054] font-normal text-xs capitalize">
                            ĐVT
                        </h4>
                        <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                            S.dụng
                            {/* <div className="flex-col flex gap-1 cursor-pointer">
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
                            </div> */}
                        </h4>
                        <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                            Đã giữ
                        </h4>
                        <h4 className="col-span-2  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                            Thiếu
                            {/* <div className="flex-col flex gap-1 cursor-pointer">
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
                            </div> */}
                        </h4>
                    </div>
                    {isFetching ? (
                        <Loading className="h-80" color="#0f4f9e" />
                    ) : dataBom?.productsBom.length > 0 ? (
                        <Customscrollbar
                            className="3xl:h-[49.5vh] xxl:h-[30vh] 2xl:h-[38.5vh] xl:h-[31.5vh] lg:h-[33vh] h-[34vh]"
                        >
                            {dataBom?.productsBom.map(
                                (e, index) =>
                                    <div
                                        key={e.id}
                                        className={`grid grid-cols-12 items-center py-2 ${dataBom?.productsBom?.length - 1 == index ? "" : "border-b"}
                                           `}
                                    >
                                        <h4 className="col-span-5 px-4 text-[#141522] flex items-center gap-2 font-medium text-sm">
                                            <ModalImage
                                                small={e.image}
                                                large={e.image}
                                                width={36}
                                                height={36}
                                                alt={e.name}
                                                className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                            />
                                            <div className="flex flex-col">
                                                <h1 className="3xl:text-sm text-xs">{e.name}</h1>
                                                <h1 className="text-[#9295A4] font-normal text-[10px]">
                                                    {e.code} - {e.itemVariation}
                                                </h1>
                                                <h1 className="text-red-500 font-normal text-[10px]">
                                                    {e.exist > 0 ? `Tồn: ${formatNumber(e.exist)}` : 'Hết kho'}
                                                </h1>
                                            </div>
                                        </h4>
                                        <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {e.unit}
                                        </h4>
                                        <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.use)}
                                        </h4>
                                        <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.quantityKeep)}
                                        </h4>
                                        <h4 className="col-span-2 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.lack)}
                                        </h4>
                                    </div>
                            )}
                        </Customscrollbar>
                    ) : (
                        <NoData />
                    )}
                </div>
                <div className="w-1/2 ">
                    <div className="grid grid-cols-8 items-center py-2 bg-[#F2FBF7] rounded">
                        <h4 className="col-span-3 px-4 text-[#344054] font-normal text-xs capitalize whitespace-nowrap">
                            Nguyên vật liệu
                        </h4>
                        <h4 className="col-span-1 px-4 text-center text-[#344054] font-normal text-xs capitalize">
                            ĐVT
                        </h4>
                        <h4 className="col-span-1  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                            S.dụng
                            {/* <div className="flex-col flex gap-1 cursor-pointer">
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
                            </div> */}
                        </h4>
                        <h4 className="col-span-1  text-center flex items-center justify-center gap-1 text-[#344054] font-normal text-xs capitalize">
                            Q.đổi
                            {/* <div className="flex-col flex gap-1 cursor-pointer">
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
                            </div> */}
                        </h4>
                        <h4 className="col-span-1  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                            Đã giữ
                        </h4>
                        <h4 className="col-span-1  text-center flex items-center justify-center gap-2 text-[#344054] font-normal text-xs capitalize">
                            Thiếu
                            {/* <div className="flex-col flex gap-1 cursor-pointer">
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
                            </div> */}
                        </h4>
                    </div>
                    {isFetching ? (
                        <Loading className="h-80" color="#0f4f9e" />
                    ) : dataBom?.materialsBom?.length > 0 ? (
                        <Customscrollbar
                            className="3xl:h-[49.5vh] xxl:h-[30vh] 2xl:h-[38.5vh] xl:h-[31.5vh] lg:h-[33vh] h-[34vh]"
                        >
                            {dataBom?.materialsBom.map(
                                (e, index) =>
                                    <div
                                        key={e.id}
                                        className={`grid grid-cols-8 items-center py-2 ${dataBom?.materialsBom?.length - 1 == index ? "" : "border-b"
                                            }`}
                                    >
                                        <h4 className="col-span-3 px-4 text-[#141522] flex items-center gap-2 font-medium text-sm">
                                            <ModalImage
                                                small={e.image}
                                                large={e.image}
                                                width={36}
                                                height={36}
                                                alt={e.name}
                                                className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                            />
                                            <div className="flex flex-col">
                                                <h1 className="3xl:text-sm text-xs">{e.name}</h1>
                                                <h1 className="text-[#9295A4] font-normal text-[10px]">
                                                    {e.code} - {e.itemVariation}
                                                </h1>
                                                <h1 className="text-red-500 font-normal text-[10px]">
                                                    {e.exist > 0 ? `Tồn: ${formatNumber(e.exist)}` : 'Hết kho'}
                                                </h1>
                                            </div>
                                        </h4>
                                        <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {e.unit}
                                        </h4>
                                        <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.use)}
                                        </h4>
                                        {/* <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.exist)}
                                        </h4> */}
                                        <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.exchange)}
                                        </h4>
                                        <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.quantityKeep)}
                                        </h4>
                                        <h4 className="col-span-1 px-4 text-center text-[#52575E] font-normal text-xs">
                                            {formatNumber(e.lack)}
                                        </h4>
                                    </div>
                            )}
                        </Customscrollbar>
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </>
    );
};
export default TabPlan;
