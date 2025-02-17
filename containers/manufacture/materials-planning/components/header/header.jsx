import Image from "next/image";
import dynamic from "next/dynamic";

const Zoom = dynamic(() => import("@/components/UI/zoomElement/zoomElement"), { ssr: false });
const Header = ({ dataLang }) => {
    return (
        <>
            <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                <h6 className="text-[#141522]/40">{dataLang?.materials_planning_manufacture || "materials_planning_manufacture"}</h6>
                <span className="text-[#141522]/40">/</span>
                <h6>{dataLang?.materials_planning || 'materials_planning'}</h6>
            </div>
            <div className="flex justify-between items-center">
                <h2 className=" 2xl:text-lg text-base text-[#52575E] capitalize">
                    {dataLang?.materials_planning || 'materials_planning'}
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
                                {dataLang?.materials_planning_export_report || 'materials_planning_export_report'}
                            </h3>
                        </button>
                    </Zoom>
                </div>
            </div>
        </>
    );
};
export default Header;
