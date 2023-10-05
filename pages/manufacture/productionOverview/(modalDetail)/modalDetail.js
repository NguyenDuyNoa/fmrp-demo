import Loading from "components/UI/loading";
import Zoom from "components/UI/zoomElement/zoomElement";
import Image from "next/image";
import History from "./history";
import Step from "./steps";

const ModalDetail = ({ data, isShow, fetch, handleIsShowModel, handleIsShow }) => {
    return (
        <>
            <div
                style={{
                    transform: isShow.showHidden ? "translateX(0%)" : "translateX(100%)", // Thêm transform translatex
                }}
                className={`bg-[#FFFFFF] absolute 3xl:top-[70px] xxl:top-[53px] 2xl:top-[60px] xl:top-[52px] lg:top-[44px]  right-0  transition-all duration-300 ease-linear h-auto w-[500px] shadow-md z-[999]`}
            >
                <div className="border-b-2 border-gray-300 flex justify-between py-4 px-6">
                    <h1>Thông tin</h1>
                    <button
                        onClick={() => handleIsShowModel()}
                        type="button"
                        className="w-[20px] h-[20px]  hover:animate-spin transition-all duration-300 ease-linear"
                    >
                        <Image
                            src={"/manufacture/x.png"}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
                <div className="bg-[#F7F9FB] m-6 rounded-xl">
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-4 3xl:my-4 xxl:my-1 2xl:my-1 xl:my-1 lg:my-1 my-3">
                            <h3 className="text-[#667085] 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px]  font-normal w-[150px]">
                                Lệnh SX tổng
                            </h3>
                            <h3 className="text-[#141522] col-span-2 3xl:text-base xxl:text-sm 2xl:text-sm xl:text-xs lg:text-[11px] text-[14px] font-medium">
                                Cold Design
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4 3xl:my-4 xxl:my-1 2xl:my-1 xl:my-1 lg:my-1 my-3">
                            <h3 className="text-[#667085] 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] font-normal w-[150px]">
                                Lệnh SX chi tiết
                            </h3>
                            <h3 className="text-[#141522] col-span-2 3xl:text-base xxl:text-sm 2xl:text-sm xl:text-xs lg:text-[11px] text-[14px] font-medium">
                                LSXCT-22072301
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4 3xl:my-4 xxl:my-1 2xl:my-1 xl:my-1 lg:my-1 my-3">
                            <h3 className="text-[#667085] 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] font-normal w-[150px]">
                                Đơn hàng
                            </h3>
                            <h3 className="text-[#141522] col-span-2 3xl:text-base xxl:text-sm 2xl:text-sm xl:text-xs lg:text-[11px] text-[14px] font-medium">
                                byewind.com
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4 3xl:my-4 xxl:my-1 2xl:my-1 xl:my-1 lg:my-1 my-3">
                            <h3 className="text-[#667085] 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] font-normal w-[150px]">
                                Khách hàng
                            </h3>
                            <h3 className="text-[#141522] col-span-2 3xl:text-base xxl:text-sm 2xl:text-sm xl:text-xs lg:text-[11px] text-[14px] font-medium">
                                Cty truyền thông Mắt Biếc (FOSSASIA)
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4 3xl:my-4 xxl:my-1 2xl:my-1 xl:my-1 lg:my-1 my-3">
                            <h3 className="text-[#667085] 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] font-normal w-[150px]">
                                SL cần sản xuất
                            </h3>
                            <h3 className="text-[#141522] col-span-2 3xl:text-base xxl:text-sm 2xl:text-sm xl:text-xs lg:text-[11px] text-[14px] font-medium">
                                12.000
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4 3xl:my-4 xxl:my-1 2xl:my-1 xl:my-1 lg:my-1 my-3">
                            <h3 className="text-[#667085] 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px] font-normal w-[150px]">
                                Ngày giao dự kiến
                            </h3>
                            <h3 className="text-[#141522] col-span-2 3xl:text-base xxl:text-sm 2xl:text-sm xl:text-xs lg:text-[11px] text-[14px] font-medium">
                                12/08/2023
                            </h3>
                        </div>
                        <div>
                            <div className="grid grid-cols-12 border-t-2 border-gray-300 pt-4">
                                <div className="col-span-3 3xl:w-[80px] 3xl:h-[84px] xxl:w-[60px] xxl:h-[64px] 2xl:w-[60px] 2xl:h-[64px] xl:w-[60px] xl:h-[64px] lg:w-[50px] lg:h-[54px] w-[80px] h-[84px] rounded-xl">
                                    <Image
                                        src={"/manufacture/Image.png"}
                                        width={80}
                                        height={84}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                                <div className="col-span-8">
                                    <h1 className="text-[#000000] font-semibold 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px] text-[13px]">
                                        Cổ áo
                                    </h1>
                                    <h1 className="3xl:text-[10px] xxl:text-[9px] 2xl:text-[9px] xl:text-[8px] lg:text-[8px] text-[10px] font-normal text-[#667085]">
                                        COAOTHUN
                                    </h1>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="3xl:text-[10px] xxl:text-[9px] 2xl:text-[9px] xl:text-[8px] lg:text-[8px] text-[10px] font-normal text-[#667085]">
                                                Số lượng đặt
                                            </h1>
                                            <h1 className="3xl:text-lg xxl:text-base 2xl:text-sm xl:text-sm lg:text-xs text-[13px] font-medium text-[#0BAA2E]">
                                                1.2000
                                            </h1>
                                        </div>
                                        <div>
                                            <h1 className="3xl:text-[10px] xxl:text-[9px] 2xl:text-[9px] xl:text-[8px] lg:text-[8px] text-[10px] font-normal text-[#667085]">
                                                Số lượng phế
                                            </h1>
                                            <h1 className="3xl:text-lg xxl:text-base 2xl:text-sm xl:text-sm lg:text-xs text-[13px] font-medium text-[#EE1E1E]">
                                                120
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#F7F9FB] m-6 rounded-xl shadow">
                    <div className="p-2 flex justify-center items-center gap-4">
                        <Zoom>
                            <button
                                type="button"
                                onClick={() => handleIsShow(1)}
                                className={`text-[#11315B] font-medium 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px]  3xl:py-3 3xl:px-4 xxl:py-2 xxl:px-3 2xl:py-1.5 2xl:px-2.5 xl:py-1.5 xl:px-3lg:py-1.5 lg:px-3 py-3 px-4
                                 hover:bg-white hover:shadow-xl  transition-all duration-200 ease-linear  rounded-xl ${
                                     isShow.showHistory == 1 ? "bg-white shadow-xl" : ""
                                 }`}
                            >
                                Lịch sử xuất NVL/BTP
                            </button>
                        </Zoom>
                        <Zoom>
                            <button
                                type="button"
                                onClick={() => handleIsShow(2)}
                                className={`text-[#11315B] font-medium 3xl:text-sm xxl:text-xs 2xl:text-xs xl:text-[11px] lg:text-[10px]  3xl:py-3 3xl:px-4 xxl:py-2 xxl:px-3 2xl:py-1.5 2xl:px-2.5 xl:py-1.5 xl:px-3 lg:py-1.5 lg:px-3 py-3 px-4
                                 hover:bg-white hover:shadow-xl  transition-all duration-200 ease-linear rounded-xl ${
                                     isShow.showHistory == 2 ? "bg-white shadow-xl" : ""
                                 }`}
                            >
                                Lịch sử hoạt động
                            </button>
                        </Zoom>
                    </div>
                </div>
                <div className="mx-11 3xl:h-[275px] xxl:h-[161px] 2xl:h-[240px] xl:h-[190px] lg:h-[192px] h-[275px] overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    {fetch.fetchHistory ? (
                        <Loading />
                    ) : isShow.showHistory == 1 ? (
                        <History data={data} />
                    ) : (
                        <Step data={data} />
                    )}
                </div>
            </div>
        </>
    );
};
export default ModalDetail;
