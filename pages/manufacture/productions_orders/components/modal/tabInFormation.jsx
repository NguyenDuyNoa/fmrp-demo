import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import { v4 as uddid } from "uuid";
const TabInFormation = memo(({ isStateModal, width, isState, dataLang, listTab }) => {
    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const initialState = {
        dataInformation: {},
    };


    const [isInfomation, setIsInfomation] = useState(initialState);

    const queryStateInfomation = (key) => setIsInfomation((x) => ({ ...x, ...key }));

    const handleShowProcess = (id) => {
        const newData = isInfomation.dataInformation.arrayProducts.map((e) => {
            if (e.id == id) {
                e.show = !e.show;
            }
            return e;
        });
        queryStateInfomation({
            dataInformation: {
                ...isInfomation.dataInformation,
                arrayProducts: newData,
            },
        });
    };

    useEffect(() => {
        if (!isStateModal.dataDetail) return;
        console.log("isStateModal.dataDetail", isStateModal.dataDetail);
        queryStateInfomation({
            dataInformation: {
                ...isInfomation.dataInformation,
                id: isStateModal.dataDetail?.poi?.poi_id,
                image: isStateModal.dataDetail?.poi?.images ?? "/no_img.png",
                name: isStateModal.dataDetail?.poi?.item_name + " - " + isStateModal.dataDetail?.poi?.item_code,
                itemVariation: isStateModal.dataDetail?.poi?.product_variation,
                quantity: isStateModal.dataDetail?.poi?.quantity,
                quantitySussces: 0,
                unit: isStateModal.dataDetail?.poi?.unit_name,
                type: "products",
                arrayProducts: isStateModal.dataDetail?.items_semi?.map(e => {
                    return {
                        id: e?.id,
                        image: "/no_img.png",
                        name: e?.item_name,
                        code: e?.item_code,
                        itemVariation: e?.product_variation,
                        quantity: e?.quota_primary,
                        show: true,
                        processBar: []
                    }
                })
                // arrayProducts: [
                //     {
                //         id: uddid(),
                //         image: "/no_img.png",
                //         name: "ÁO SƠ MI - S - TRẮNG",
                //         itemVariation: "Biến thể 1",
                //         quantity: 1000,
                //         show: true,
                //         processBar: [
                //             {
                //                 id: uddid(),
                //                 active: true,
                //                 date: new Date(),
                //                 title: "Bồi",
                //                 status: "Đã điều độ",
                //                 quantity: 100,
                //                 arraySemi: [
                //                     {
                //                         id: uddid(),
                //                         image: "/no_img.png",
                //                         name: "ÁO SƠ MI - S - TRẮNG",
                //                         itemVariation: "Biến thể 1",
                //                         quantity: 1000,
                //                     },
                //                     {
                //                         id: uddid(),
                //                         image: "/no_img.png",
                //                         name: "ÁO SƠ MI - S - TRẮNG",
                //                         itemVariation: "Biến thể 1",
                //                         quantity: 1000,
                //                     },
                //                 ],
                //             },
                //             {
                //                 id: uddid(),
                //                 active: true,
                //                 date: new Date(),
                //                 title: "Bế",
                //                 status: "Đã điều độ",
                //                 quantity: 150,
                //                 arraySemi: [
                //                     {
                //                         id: uddid(),
                //                         image: "/no_img.png",
                //                         name: "ÁO SƠ MI - S - TRẮNG",
                //                         itemVariation: "Biến thể 1",
                //                         quantity: 1000,
                //                     },
                //                 ],
                //             },
                //             {
                //                 id: uddid(),
                //                 active: true,
                //                 date: new Date(),
                //                 title: "Dán TP",
                //                 status: "Đã điều độ",
                //                 quantity: 200,
                //                 arraySemi: [
                //                     {
                //                         id: uddid(),
                //                         image: "/no_img.png",
                //                         name: "ÁO SƠ MI - S - TRẮNG",
                //                         itemVariation: "Biến thể 1",
                //                         quantity: 1000,
                //                     },
                //                 ],
                //             },
                //             {
                //                 id: uddid(),
                //                 active: true,
                //                 date: new Date(),
                //                 title: "Hoàn thành sản xuất",
                //                 status: "Hoàn thành sản xuất",
                //                 quantity: 0,
                //                 arraySemi: [],
                //             },
                //         ],
                //     },
                // ],
            },
        });
    }, [isStateModal.dataDetail]);

    return (
        <div>
            <h1 className="3xl:text-xl text-base my-1">{listTab[isStateModal.isTab - 1]?.name}</h1>
            <div className="flex gap-2 w-full overflow-auto ">
                <div
                    className={`${width > 900 ? "3xl:w-[15%] 2xl:w-[23%] xl:w-[25%] lg:w-[25%]" : "3xl:w-[30%] 2xl:w-[30%] xl:w-[35%] lg:w-[30%]"}  flex items-start py-2 px-4 gap-2 bg-gray-50 border rounded-md`}
                >
                    <ModalImage
                        small={isInfomation.dataInformation?.image}
                        large={isInfomation.dataInformation?.image}
                        width={36}
                        height={36}
                        alt={isInfomation.dataInformation?.name}
                        className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                    />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[#0F4F9E] font-semibold xl:text-sm text-sm">
                            {isInfomation.dataInformation?.name ?? ""}
                        </h1>
                        <h1 className={`text-[#9295A4] font-normal text-sm`}>
                            {isInfomation.dataInformation?.itemVariation ?? ""}
                        </h1>
                        <h1 className={`text-[#9295A4] font-normal text-sm`}>
                            Loại:{" "}
                            <span className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-xs
                                 ${(isInfomation.dataInformation?.type === "products" && "text-lime-500 border-lime-500") ||
                                (isInfomation.dataInformation?.type === 1 && "text-orange-500 border-orange-500") ||
                                (isInfomation.dataInformation?.type === 2 && "text-sky-500 border-sky-500")}`}
                            >
                                {isInfomation.dataInformation?.type === "products" && "Thành phẩm"}
                            </span>
                        </h1>

                        <h1 className="text-[#9295A4] font-normal text-sm">
                            Đơn vị tính:{" "}
                            <span className="text-sm font-semibold text-black">
                                {isInfomation.dataInformation?.unit ?? ""}
                            </span>
                        </h1>
                        <h1 className="text-[#9295A4] font-normal text-sm">
                            Số lượng:{" "}
                            <span className="text-sm font-semibold text-black">
                                {isInfomation.dataInformation?.quantity > 0 ? formatNumber(isInfomation.dataInformation?.quantity) : "-"}
                            </span>
                        </h1>
                        <h1 className="text-[#9295A4] font-normal text-sm">
                            Đã hoàn thành:{" "}
                            <span className="text-sm font-semibold text-black">
                                {isInfomation.dataInformation?.quantitySussces > 0 ? formatNumber(isInfomation?.dataInformation?.quantitySussces) : "-"}
                            </span>
                        </h1>
                    </div>
                </div>
                <div
                    className={`flex flex-nowrap gap-2 justify-start  ${width > 900
                        ? "3xl:h-[calc(100vh_-_343px)] 2xl:h-[calc(100vh_-_343px)] xxl:h-[calc(100vh_-_345px)] 3xl:w-[85%] 2xl:w-[77%] xl:w-[75%] lg:w-[75%]"
                        : "3xl:h-[calc(100vh_-_500px)] h-[calc(100vh_-_460px)] 3xl:w-[70%] 2xl:w-[70%] xl:w-[65%] lg:w-[70%]"}  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-x-auto pr-2`}
                >
                    {isInfomation.dataInformation?.arrayProducts?.map((e) => {
                        const shownElements = isInfomation.dataInformation?.arrayProducts?.filter((e) => e?.show);
                        return (
                            <div key={e?.id} className="min-w-fit max-w-fit w-fit">
                                <div className="bg-white sticky top-0 z-10 ">
                                    <div
                                        onClick={() => handleShowProcess(e?.id)}
                                        className={` text-xs flex flex-col py-2 px-4 gap-2 ${e?.show ? "bg-blue-500 text-white" : "bg-gray-50"} hover:bg-blue-500 hover:text-white transition-all duration-150 ease-linear border rounded-md w-fit cursor-pointer`}
                                    >
                                        <div className="">
                                            {e?.name} - {e?.code}
                                        </div>
                                        <div className="">{e?.itemVariation} - SL: {e?.quantity > 0 ? formatNumber(e?.quantity) : "-"}</div>
                                    </div>
                                </div>
                                <div className="w-full pt-3">
                                    {e?.show && (
                                        <ol className={`flex flex-col border-r ${shownElements?.length > 0 && shownElements[shownElements?.length - 1] === e ? "border-r-0" : ""} pr-2`}>
                                            {e?.processBar?.map((j, jIndex) => {
                                                return (
                                                    <li
                                                        key={jIndex}
                                                        className={`${jIndex == e.processBar?.length - 1 ? "relative flex-1" : `relative flex-1 after:content-['']  after:w-0.5 after:h-full  after:inline-block after:absolute after:top-0 after:left-[5px] 
                                                            ${j.active ? "after:bg-[#00C170]" : "after:bg-gray-500"} `}`}
                                                    >
                                                        <div className="flex font-medium w-full">
                                                            <span
                                                                className={`w-3 h-3 ${j?.active ? "bg-[#00C170]" : "bg-gray-500"} border-2 border-transparent rounded-full mr-3 text-sm text-white`}
                                                            ></span>
                                                            <div className="block">
                                                                <h4 className={`3xl:text-base xxl:text-sm text-xs ${j?.active ? "text-[#00C170]" : "text-gray-500"} my-2`}>
                                                                    {j?.title}{" "}
                                                                    <span className="3xl:text-[12px] xxl:text-[12px] text-[10px]">
                                                                        ({moment(j?.date).format("DD/MM/YYYY, HH:mm:ss")})
                                                                    </span>
                                                                </h4>
                                                                <div className="flex flex-col gap-2">
                                                                    {j?.arraySemi?.map((s) => {
                                                                        return (
                                                                            <div key={s?.id} className="">
                                                                                <div className="border border-gray-400 px-2 py-1 rounded-xl flex items-center gap-1">
                                                                                    <ModalImage
                                                                                        small={s?.image}
                                                                                        large={s?.image}
                                                                                        width={18}
                                                                                        height={18}
                                                                                        alt={s?.name}
                                                                                        className="object-cover rounded-md min-w-[18px] min-h-[18px] w-[18px] h-[18px] max-w-[18px] max-h-[18px]"
                                                                                    />
                                                                                    <span className="text-[#9295A4] 3xl:text-[12px]  2xl:text-[10px] xxl:text-[12px] text-[10px]">
                                                                                        {s?.name} - SL:{" "}
                                                                                        {s?.quantity > 0 ? formatNumber(s?.quantity) : "-"}{" "}-{" "} {moment(s?.date).format("DD/MM/YYYY")}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default TabInFormation;
