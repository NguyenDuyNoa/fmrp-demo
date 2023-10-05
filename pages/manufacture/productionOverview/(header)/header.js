import Zoom from "components/UI/zoomElement/zoomElement";
import Image from "next/image";

const Header = (props) => {
    const data = [
        { id: 1, title: "12/03/2023 - 20/03/2023", icon: "/manufacture/calendar.png" },
        { id: 2, title: "Đơn hàng/ KH Nội Bộ", icon: "/manufacture/document-text.png" },
        { id: 3, title: "Khách hàng", icon: "/manufacture/user.png" },
        { id: 4, title: "Sản phẩm", icon: "/manufacture/box.png" },
    ];
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium text-[#11315B]">Tổng quản sản xuất</h1>
                {data.map((e, index) => (
                    <div className="flex gap-1 items-center">
                        <div className="h-[16px] w-[16px]">
                            <Image src={e.icon} width={16} height={16} className="w-full h-full object-cover" />
                        </div>
                        <h3 className={`${index == 0 ? "text-[#444C64]" : "text-[#7E859B]/80"} text-base font-normal`}>
                            {e.title}
                        </h3>
                    </div>
                ))}
                <div>
                    <Zoom>
                        <button
                            type="button"
                            className="bg-[#11315B] rounded-2xl hover:bg-[#11315B]/50 hover:scale-105 transition-all duration-200 ease-linear group"
                        >
                            <div className="3xl:py-3 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 flex items-center gap-2">
                                <h3 className="text-white text-base group-hover:text-[#11315B] font-bold transition-all duration-200 ease-linear">
                                    Bộ lọc
                                </h3>
                                <div className="h-[16px] w-[16px]">
                                    <Image
                                        src={"/manufacture/setting-5.png"}
                                        width={16}
                                        height={16}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </button>
                    </Zoom>
                </div>
            </div>
        </>
    );
};
export default Header;
