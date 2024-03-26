import Image from "next/image";
import dynamic from "next/dynamic";

const Zoom = dynamic(() => import("@/components/UI/zoomElement/zoomElement"), { ssr: false });
const Header = ({ }) => {
    return (
        <>
            <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                <span className="text-[#141522]/40">/</span>
                <h6>{"Kế hoạch nguyên vật liệu"}</h6>
            </div>
            <div className="flex justify-between items-center">
                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                    Kế hoạch nguyên vật liệu
                </h2>
                <div>
                    <Zoom>
                        <button
                            type="button"
                            className="bg-white border-[#D0D5DD] border rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2.5 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 flex items-center gap-2"
                        >
                            <Image
                                src={"/productionPlan/Icondow.png"}
                                width={16}
                                height={16}
                                className="object-cover"
                            />
                            <h3 className="text-[#141522] font-medium transition-all duration-200 ease-linear text-sm">
                                Xuất báo cáo
                            </h3>
                        </button>
                    </Zoom>
                </div>
            </div>
        </>
    );
};
export default Header;
