import Zoom from "components/UI/zoomElement/zoomElement";
import Image from "next/image";

const Header = ({}) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className={` flex space-x-3  xl:text-[14.5px] text-[12px]`}>
                    <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                    <span className="text-[#141522]/40">/</span>
                    <h6>{"Điều độ sản xuất"}</h6>
                </div>
                <div>
                    <Zoom>
                        <button
                            type="button"
                            className="bg-[#0F4F9E] rounded-xl hover:scale-105 transition-all duration-200 ease-linear"
                        >
                            <button
                                type="button"
                                className="3xl:py-2.5 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 flex items-center gap-2"
                            >
                                <h3 className="text-white font-semibold transition-all duration-200 ease-linear text-sm">
                                    Xuất báo cáo
                                </h3>
                            </button>
                        </button>
                    </Zoom>
                </div>
            </div>
            <h1 className="text-lg font-medium text-[#11315B]">Điều độ sản xuất</h1>
            {/* <ModalFilter isShow={isShow} handleIsShowFilter={handleIsShowFilter} /> */}
        </>
    );
};
export default Header;
