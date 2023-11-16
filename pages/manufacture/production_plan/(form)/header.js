import dynamic from "next/dynamic";

const Zoom = dynamic(() => import("@/components/UI/zoomElement/zoomElement"), {
    ssr: false,
});

const Header = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className={` flex space-x-3  xl:text-[14.5px] text-[12px]`}>
                    <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                    <span className="text-[#141522]/40">/</span>
                    <h6 className="text-[#141522]/40">{"Kế hoạch nguyên vật liệu"}</h6>
                    <span className="text-[#141522]/40">/</span>
                    <h6>{"Thêm kế hoạch NVL"}</h6>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-medium text-[#11315B] capitalize">Thêm kế hoạch nguyên vật liệu</h1>
                <div className="flex items-center gap-4">
                    <div>
                        <Zoom>
                            <button
                                type="button"
                                className="bg-white border-[#D0D5DD] border rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
                            >
                                Lưu nháp
                            </button>
                        </Zoom>
                    </div>
                    <div>
                        <Zoom>
                            <button
                                type="button"
                                className="bg-[#0F4F9E] text-white  rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
                            >
                                Lưu lại
                            </button>
                        </Zoom>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Header;
