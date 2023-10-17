import Zoom from "components/UI/zoomElement/zoomElement";
import { Add, SearchNormal1 } from "iconsax-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import PopupAdd from "../(popupAdd)/popup";
import Loading from "components/UI/loading";

const MainTable = ({
    data,
    newDatabody,
    dataLang,
    handleShowProgress,
    isOpen,
    idParent,
    dataFind,
    isLoading,
    handleOpenPopup,
    isOpenPopup,
}) => {
    const container1Ref = useRef();
    const container2Ref = useRef();

    const handleScroll = (e) => {
        const container1Element = container1Ref.current;
        const container2Element = container2Ref.current;

        container2Element.scrollLeft = container1Element.scrollLeft;
    };
    return (
        <>
            <div className="flex bg-[#D0D5DD]/20 border-[#d8dae5] border !mt-[14px]">
                <div className="min-w-[300px] border-r py-2 px-1 flex items-center justify-center">
                    <form className="flex items-center relative  w-full">
                        <SearchNormal1
                            size={20}
                            className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]"
                        />
                        <input
                            className="relative border border-[#d8dae5] bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5 py-2.5 rounded-md 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                            type="text"
                            placeholder="Tìm lệnh sản xuất"
                        />
                    </form>
                </div>
                <div className="min-w-[100px] border-r py-2 px-1 flex items-center justify-center">Ngày</div>
                <div className="flex items-center overflow-hidden " ref={container2Ref}>
                    {data.stages.map((e, inedex) => (
                        <div className={`min-w-[200px] border-r h-full py-4`} key={inedex}>
                            <h3 className="text-center text-[#9295A4] text-xs uppercase ">{e.name.nameStages}</h3>
                            <h2 className="flex gap-1 uppercase items-center justify-center text-center text-[#141522] text-base font-medium">
                                {e.active && (
                                    <div className="w-[20px] h-[20px]">
                                        <Image
                                            src={"/productionSmoothing/tick-circle.png"}
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}{" "}
                                {e.name.subStages}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex border border-t-0 !mt-0">
                <div
                    className=" overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 
                3xl:h-[66.6vh] border-r xxl:h-[54.5vh] 2xl:h-[58.8vh]  xl:h-[54.8vh] lg:h-[55.6vh] h-[60vh] !m-0  overflow-y-auto min-w-[300px] "
                >
                    {data.data.map((e, index) => (
                        <div className={`border-[#E7EAEE] bg-white ${index == 0 ? "" : ""} border-b`}>
                            <div
                                onClick={() => handleShowProgress(e.id)}
                                className={` ${
                                    isOpen && e.id == idParent ? "bg-[#EBF5FF]/100" : ""
                                }  cursor-pointer hover:bg-[#EBF5FF]  transition-all    duration-200 ease-linear flex   items-center`}
                            >
                                <div className="p-5">
                                    <div className="grid grid-cols-13 items-center gap-1 justify-center">
                                        <Image
                                            src={e.image}
                                            alt=""
                                            className="object-cover col-span-3"
                                            width={44}
                                            height={44}
                                        />
                                        <div className="col-span-10">
                                            <h3 className="text-[#0F4F9E] text-sm font-semibold my-0.5">{e.name}</h3>
                                            <h3 className="text-[#52575E] text-sm font-normal">{e.desriptions}</h3>
                                        </div>
                                    </div>
                                    {isOpen && e.id == idParent && (
                                        <>
                                            <div className="my-5">
                                                <div className="flex items-center">
                                                    {e.process.map((i, index) => (
                                                        <>
                                                            <div
                                                                className={`${
                                                                    i.active
                                                                        ? `h-2 w-2 rounded-full bg-green-500`
                                                                        : `h-2 w-2 rounded-full bg-[#CCCCCC]`
                                                                } `}
                                                            />
                                                            <div
                                                                className={`${
                                                                    i.active
                                                                        ? `w-[13%] bg-green-500 h-0.5 `
                                                                        : `w-[13%] bg-[#CCCCCC] h-0.5 `
                                                                }`}
                                                            />
                                                            {index === e.process.length - 1 && (
                                                                <div
                                                                    className={`${
                                                                        i.active
                                                                            ? `h-2 w-2 rounded-full bg-green-500`
                                                                            : `h-2 w-2 rounded-full bg-[#CCCCCC]`
                                                                    } `}
                                                                />
                                                            )}
                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[#3A3E4C] font-light text-sm flex gap-2 items-center my-1.5">
                                                    Ngày lập: <h3 className="font-normal text-sm">{e.dateStart}</h3>
                                                </div>
                                                <div className="text-[#3A3E4C] font-light text-sm flex gap-2 items-center my-1.5">
                                                    Ngày giao: <h3 className="font-normal text-sm">{e.dateEnd}</h3>
                                                </div>
                                                <div className="text-[#3A3E4C] font-light text-sm flex gap-2 items-center my-1.5">
                                                    Công ty: <h3 className="font-normal text-sm">{e.customer}</h3>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {isLoading ? (
                    <Loading className="h-80" color="#0f4f9e" />
                ) : (
                    <div
                        ref={container1Ref}
                        onScroll={handleScroll}
                        className="flex flex-col   overflow-x-auto  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 
                    3xl:h-[66.6vh] xxl:h-[54.5vh] 2xl:h-[58.8vh] xl:h-[54.8vh] lg:h-[55.6vh] h-[60vh] !m-0  overflow-y-auto"
                    >
                        {isOpen &&
                            dataFind?.child.map((ce, ceIndex) => {
                                return (
                                    <div className={`flex `}>
                                        <div className="min-w-[100px] bg-white z-[999] border-r border-b py-2 px-1 flex items-center justify-center sticky top-0 left-0">
                                            <div className="flex flex-col justify-center items-center">
                                                <h3 className="text-[#595C68] text-xs font-light">{ce.date.month}</h3>
                                                <div className="flex gap-2">
                                                    <h2 className="text-[#667085] font-light text-base">
                                                        {ce.date.rank}
                                                    </h2>
                                                    <h2 className="text-[#202236] font-semibold text-base">
                                                        {ce.date.days}
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex border-b`}>
                                            {ce.dataChild.map((e, eIndex) => {
                                                return (
                                                    <div
                                                        className={`flex flex-col  min-w-[200px]  border-t-0 border-r`}
                                                    >
                                                        {e.db?.map((i) => (
                                                            <div className="m-auto">
                                                                <div className="w-fit">
                                                                    <div className="text-[#0F4F9E] w-full flex items-center  gap-1 font-medium text-sm py-1 px-2 bg-[#EBF5FF] rounded-2xl my-1">
                                                                        <div className="bg-gradient-to-l from-blue-400/80 to-[#1556D9] text-sm  rounded-full h-[24px]  w-[24px] text-[#FFFFFF] flex items-center justify-center">
                                                                            {i.name[0]}
                                                                        </div>
                                                                        <h1>{i.name}</h1>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </>
    );
};
export default MainTable;
