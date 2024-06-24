import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useSetingServer from "@/hooks/useConfigNumber";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { FaArrowAltCircleRight, FaCheck, FaCheckCircle } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import ModalImage from "react-modal-image";
import PopupImportProducts from "../popup/popupImportProducts";

const TabInFormation = memo(({ isStateModal, width, isState, dataLang, listTab }) => {
    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const initialState = {
        dataInformation: {},
    };


    const [isInfomation, setIsInfomation] = useState(initialState);

    const queryStateInfomation = (key) => setIsInfomation((x) => ({ ...x, ...key }));

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
                        ...e,
                        id: e?.id,
                        image: "/no_img.png",
                        name: e?.item_name,
                        code: e?.item_code,
                        itemVariation: e?.product_variation,
                        quantity: e?.quota_primary,
                        show: true,
                        processBar: e?.stages?.map(i => {
                            return {
                                ...i,
                                active: false,
                                quantity: 100,
                                arraySemi: [
                                    // {
                                    //     id: uddid(),
                                    //     image: "/no_img.png",
                                    //     name: "ÁO SƠ MI - S - TRẮNG",
                                    //     itemVariation: "Biến thể 1",
                                    //     quantity: 1000,
                                    // },
                                ],
                            }
                        })
                    }
                })
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
                        <h1 className={`text-[#9295A4] font-normal text-sm italic`}>
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
                            {dataLang?.productions_orders_details_unit || 'productions_orders_details_unit'}:{" "}
                            <span className="text-sm font-semibold text-black">
                                {isInfomation.dataInformation?.unit ?? ""}
                            </span>
                        </h1>
                        <h1 className="text-[#9295A4] font-normal text-sm">
                            {dataLang?.productions_orders_details_quantity || 'productions_orders_details_quantity'}:{" "}
                            <span className="text-sm font-semibold text-black">
                                {isInfomation.dataInformation?.quantity > 0 ? formatNumber(isInfomation.dataInformation?.quantity) : "-"}
                            </span>
                        </h1>
                        <h1 className="text-[#9295A4] font-normal text-sm">
                            {dataLang?.productions_orders_details_accomplished || 'productions_orders_details_accomplished'}:{" "}
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
                            <Renderitem
                                name={e.name}
                                code={e.code}
                                checkBorder={shownElements}
                                id={e?.id}
                                image={e?.image}
                                itemVariation={e?.itemVariation}
                                quantity={e?.quantity}
                                processBar={e?.processBar}
                                type='semi'
                                dataLang={dataLang}
                            />
                        );
                    })}
                    <div className="">
                        <Renderitem
                            name={isStateModal.dataDetail?.poi?.item_name}
                            code={isStateModal.dataDetail?.poi?.item_code}
                            checkBorder={''}
                            id={undefined}
                            image={"/no_img.png"}
                            type='products'
                            itemVariation={isStateModal.dataDetail?.poi?.product_variation}
                            quantity={isStateModal.dataDetail?.poi?.quantity}
                            processBar={isStateModal.dataDetail?.poi?.stages}
                            dataLang={dataLang}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

const Renderitem = ({ type, id, image, name, code, itemVariation, quantity, processBar, checkBorder, dataLang }) => {

    const dataSeting = useSetingServer()

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    return (
        <div key={id ?? ""} className={`max-w-sm`}>
            <div className={`bg-white sticky top-0 z-10 `}>
                <div className={`flex items-start py-2 px-4 h-[90px]  gap-2 border-[#5599EC]/50 border-[0.5px] shadow-[0_0_2px_rgba(0,0,0,0.2) rounded-xl w-full`}>
                    <div className="h-8 w-8">
                        <Image src={image} width={1280} height={1024} alt="" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className={`text-xs ${type === "semi" ? "font-medium" : "text-[#5599EC] font-semibold"}`}>
                            {name} - {code}
                        </div>
                        <div className={`text-[10px] italic text-gray-500 w-fit`}>
                            {itemVariation}
                        </div>
                        <div className="text-[10px] border border-[#5599EC] text-[#5599EC] font-medium w-fit px-2 py-0.5 rounded-2xl">
                            Số lượng: {quantity > 0 ? formatNumber(quantity) : "-"}
                        </div>
                    </div>
                </div>
            </div>
            {processBar?.map((j, jIndex) => {
                const checkLast = processBar?.length - 1 != jIndex
                return (
                    <div className={`px-4 mx-auto ${jIndex == 0 && 'mt-5'} ${checkBorder ? "border-r" : ""}`}>
                        <div className="flex min-h-[70px] gap-3">
                            <div className={`text-[10px] ${j?.active ? 'text-black' : "text-black/70"} font-normal text-right`}>
                                <div className={`${j?.date_production ? 'opacity-100' : 'opacity-0'}`}>
                                    {formatMoment(j?.date_production ? j?.date_production : new Date(), FORMAT_MOMENT.DATE_SLASH_LONG)}
                                </div>
                                <div className={`${j?.date_production ? 'opacity-100' : 'opacity-0'}`}>
                                    {formatMoment(j?.date_production ? j?.date_production : new Date(), FORMAT_MOMENT.TIME_SHORT)}
                                </div>
                            </div>
                            <div className="flex">
                                <div className={`mr-3 flex flex-col items-center`}>
                                    <div className="">
                                        <div className={`flex h-5 w-5 ${j?.active ? "border-[#14b8a6] bg-[#14b8a6]" : j?.begin_production == 1 ? 'border-orange-600' : "border-gray-400"}  items-center justify-center rounded-full border `}>
                                            {
                                                processBar?.length - 1 != jIndex ?
                                                    <>
                                                        {jIndex % 2 == 0 && <FaArrowDown size={9} className={`${j?.active ? 'text-white' : j?.begin_production == 1 ? 'text-orange-600' : "text-gray-400"}`} />}
                                                        {jIndex % 2 != 0 && <AiOutlineFileText size={9} className={`${j?.active ? 'text-white' : j?.begin_production == 1 ? 'text-orange-600' : "text-gray-400"}`} />}
                                                    </>
                                                    : <FaCheck size={8} className={`${j?.active ? 'text-white' : j?.begin_production == 1 ? 'text-orange-600' : "text-gray-400"}`} />
                                            }
                                        </div>
                                    </div>
                                    {checkLast && <div className={`h-full w-px ${j?.begin_production == 1 ? 'bg-orange-400' : 'bg-gray-300'} relative`}>
                                    </div>}
                                </div>
                                <div className="mt-0.5">
                                    <div className="flex items-center gap-2">
                                        <p className={`-mt-1 text-sm font-medium ${j?.active ? "text-[#14b8a6]" : j?.begin_production == 1 ? 'text-orange-600' : "text-black/60"}`}>{j.stage_name}</p>
                                        {(+j?.type == 2 || +j?.type == 3) ?
                                            <div className="flex items-center gap-1">
                                                <PopupImportProducts type='begin_production' dataStage={j} dataLang={dataLang}>
                                                    <FaArrowAltCircleRight className={`${j?.begin_production == 1 ? 'text-orange-600' : "text-[#5599EC]"} cursor-pointer hover:scale-110 transition-all duration-150 ease-linear`} />
                                                </PopupImportProducts>
                                                <PopupImportProducts type='end_production' dataStage={j} dataLang={dataLang}>
                                                    <FaCheckCircle className="text-[#10b981] cursor-pointer hover:scale-110 transition-all duration-150 ease-linear" />
                                                </PopupImportProducts>
                                            </div>
                                            :
                                            +j?.type == 0 &&
                                            <PopupImportProducts type='end_production' dataStage={j} dataLang={dataLang}>
                                                <FaCheckCircle className="text-[#10b981] cursor-pointer hover:scale-110 transition-all duration-150 ease-linear" />
                                            </PopupImportProducts>
                                        }
                                    </div>
                                    <p className="text-gray-600 text-xs dark:text-slate-400"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TabInFormation;
